const { WhatsAppInstance } = require('../class/instance');
const fs = require('fs');
const path = require('path');
const icon = fs.readFileSync(path.join(__dirname, `../../public/icone.png`));
const check = fs.readFileSync(path.join(__dirname, `../../public/check.png`));

exports.init = async (req, res) => {
    const key = req.query.key;
    const webhook = (!req.query.webhook) ? false : req.query.webhook;
    const webhookUrl = (!req.query.webhookUrl) ? null : req.query.webhookUrl;
    const instance = new WhatsAppInstance(key, webhook, webhookUrl);
    const data = await instance.init();
    WhatsAppInstances[data.key] = instance;
    res.json({
        error: false,
        message: 'Initializing successfully',
        key: data.key,
    });
};

exports.qr = async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    let data = '';
    try {
        data = await instance.getInstanceDetail(req.query.key);
    } catch (error) {
        data = {};
    }
    const checkB64= Buffer.from(check).toString('base64')
    const iconB64= Buffer.from(icon).toString('base64')
    const mimeType = 'image/png'
    try {
        const qrcode = await WhatsAppInstances[req.query.key].instance.qr;
        if (data.phone_connected === true) {
            res.render('qrcode', {
                check: "data:" + mimeType + ";base64," + checkB64,
                icon: "data:" + mimeType + ";base64," + iconB64,
                qrcode: "",
                instance_data_key: "Token: " + data.instance_key,
                instance_data_id: "User ID: " + data.user.id.split(":")[0],
                instance_data_name: "User Name: " + data.user.name,
            });
        }
        else {
            res.render('qrcode', {
                check: "",
                icon: "data:" + mimeType + ";base64," + iconB64,
                qrcode: qrcode,
                instance_data_key: "Token: " + data.instance_key,
                instance_data_id: "",
                instance_data_name: "",
            });
        }

    } catch {
        res.json({
            qrcode: '',
        });
    }
};

exports.qrbase64 = async (req, res) => {
    try {
        const qrcode = await WhatsAppInstances[req.query.key].instance.qr;
        res.json({
            error: false,
            message: 'QR Base64 fetched successfully',
            qrcode: qrcode,
        });
    } catch {
        res.json({
            qrcode: '',
        });
    }
};

exports.info = async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    let data = '';
    try {
        data = await instance.getInstanceDetail(req.query.key);
    } catch (error) {
        data = {};
    }
    return res.json({
        error: false,
        message: 'Instance fetched successfully',
        // instance_data: data,
        instance_data: data,
    });
};

exports.restore = async (req, res, next) => {
    try {
        let restoredSessions = [];
        const instances = fs.readdirSync(path.join(__dirname, `../sessiondata`));
        instances.map((file) => {
            if (file.includes('.json')) {
                restoredSessions.push(file.replace('.json', ''));
            }
        });
        restoredSessions.map((key) => {
            const instance = new WhatsAppInstance(key);
            instance.init();
            WhatsAppInstances[key] = instance;
        });
        return res.json({
            error: false,
            message: 'All instances restored',
            data: restoredSessions,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res) => {
    let errormsg;
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout();
    } catch (error) {
        errormsg = error;
    }
    return res.json({
        error: false,
        message: 'logout successfull',
        errormsg: errormsg ? errormsg : null,
    });
};

exports.delete = async (req, res) => {
    let errormsg;
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout();
        delete WhatsAppInstances[req.query.key];
    } catch (error) {
        errormsg = error;
    }
    return res.json({
        error: false,
        message: 'Instance deleted successfully',
        data: errormsg ? errormsg : null,
    });
};

exports.list = async (req, res) => {
    if (req.query.active) {
        let instance = Object.keys(WhatsAppInstances).map(async (key) =>
            WhatsAppInstances[key].getInstanceDetail(key),
        );
        let data = await Promise.all(instance);
        return res.json({
            error: false,
            message: 'All active instance',
            data: data,
        });
    } else {
        let instance = [];
        const sessions = fs.readdirSync(path.join(__dirname, `../sessiondata`));
        sessions.map((file) => {
            if (file.includes('.json')) {
                instance.push(file.replace('.json', ''));
            }
        });
        return res.json({
            error: false,
            message: 'All instance listed',
            data: instance,
        });
    }
};
