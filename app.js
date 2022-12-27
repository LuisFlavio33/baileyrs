const makeWaSocket = require('@adiwajshing/baileys').default
const {
    useSingleFileAuthState,
    makeWALegacySocket,
    delay,
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState
} = require('@adiwajshing/baileys')
const {
    unlink,
    existsSync,
    mkdirSync,
    readFileSync
} = require('fs')
const P = require('pino')
const http = require("http")
const qrcode = require("qrcode")
const express = require("express")
const socketIO = require("socket.io")
const port = process.env.PORT || 8001;
const app = express();
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const io = socketIO(server)
const Path = 'Sessao1';
const request = require('request');
const retries = new Map()


const {
    body,
    validationResult
} = require('express-validator');
const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/assets", express.static(__dirname + "/assets"))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});

const GroupCheck = (jid) => {
    const regexp = new RegExp(/^\d{18}@g.us$/)
    return regexp.test(jid)
}



io.on("connection", async socket => {
    
    const shouldReconnect = (sessionId) => {
        let maxRetries = parseInt(2 ?? 0)
        let attempts = retries.get(sessionId) ?? 0
        maxRetries = maxRetries < 1 ? 1 : maxRetries
        if (attempts < maxRetries) {
            ++attempts
            console.log('Reconectando...', {
                attempts,
                sessionId
            })
            retries.set(sessionId, attempts)
            return true
        }
        return false
    }

    const Update = (sock) => {
        sock.on('connection.update', ({
            connection,
            lastDisconnect,
            qr
        }) => {
            
            console.log(connection + ' status da merda de conexão')

            if (qr) {
                console.log('OLHA O QR: ', qr);
                qrcode.toDataURL(qr, (err, url) => {
                    socket.emit("qr", url)
                    socket.emit("message", "Novo QR")
                })
            };


            
            if (connection === 'close') {
                const Reconnect = lastDisconnect.error?.output?.statusCode === DisconnectReason.loggedOut
                if (Reconnect) Connection()
                console.log(`© BOT- - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
                socket.emit("fechada", "/assets/check.svg")
                if (Reconnect === false) {
                   fs.rmSync('', { recursive: true, force: true });
                   const removeAuth =  Path
                   unlink(removeAuth, err => {
                      if (err) throw err
                   })
                }
             }

             if (connection === 'open') {
                console.log('© BOT- - CONECTADO')
                socket.emit('message', 'online!');
                socket.emit("check", "/assets/check.svg")
            }
            
            
        })
    }



    const Connection = async () => {
        const {
            version
        } = await fetchLatestBaileysVersion()
        if (!existsSync(Path)) {
            mkdirSync(Path, {
                recursive: true
            });
        }
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState(Path)
        const config = {
            auth: state,
            logger: P({
                level: 'error'
            }),
            printQRInTerminal: true,
            version,
            connectTimeoutMs: 60_000,
            async getMessage(key) {
                return {
                    conversation: 'Teste_envio_automatico'
                };
            },
        }
        const sock = makeWaSocket(config, {
            auth: state
        });
        Update(sock.ev);
        sock.ev.on('creds.update', saveCreds);

        const SendMessage = async (jid, msg) => {
            await sock.presenceSubscribe(jid)
            await delay(1500)
            await sock.sendPresenceUpdate('composing', jid)
            await delay(1000)
            await sock.sendPresenceUpdate('paused', jid)
            return await sock.sendMessage(jid, msg)
        }

        sock.ev.on('messages.upsert', async ({
            messages,
            type
        }) => {
            const msg = messages[0]
            const jid = msg.key.remoteJid

            if (!msg.key.fromMe && jid !== 'status@broadcast' && !GroupCheck(jid)) {
                const options = {
                    'method': 'POST',
                    'url': 'http://localhost:5678/webhook-test/7a7de506-3006-4d6d-8899-fb48adaf6a5b',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    json: msg
                };

                request(options, function (error, response) {
                    if (error) {
                        throw new Error(error);
                    } else {
                        console.log(response.body);
                    }
                });

            }
        })
    

            //menssagem
            // Dois botões + Imagem
            app.post('/botaoimagem', async (req, res) => {

                const jid = req.body.jid + '@s.whatsapp.net';
                const body = req.body.body;
                const footer = req.body.footer;
                const caption = req.body.caption;
                const file = req.body.file;
                const description = req.body.description;


                const buttons = [{
                    buttonId: '1',
                    buttonText: {
                        displayText: req.body.Btn1
                    },
                    type: 1
                },
                {
                    buttonId: '2',
                    buttonText: {
                        displayText: req.body.Btn2
                    },
                    type: 1
                },

                ]

                const enviar_img = {
                    caption: caption,
                    footer: footer,
                    buttons: buttons,
                    image: {
                        url: file,
                    },

                };

                sock.sendMessage(jid, enviar_img).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response

                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });
            app.post('/quatrobotoes', async (req, res) => {

                const jid = req.body.jid + '@s.whatsapp.net';
                const body = req.body.body;
                const footer = req.body.footer;
                const caption = req.body.caption;
                const file = req.body.file;
                const description = req.body.description;


                const buttons = [{
                    buttonId: '1',
                    buttonText: {
                        displayText: req.body.Btn1
                    },
                    type: 1
                },
                {
                    buttonId: '2',
                    buttonText: {
                        displayText: req.body.Btn2
                    },
                    type: 1
                },
                {
                    buttonId: '3',
                    buttonText: {
                        displayText: req.body.Btn3
                    },
                    type: 1
                },
                {
                    buttonId: '4',
                    buttonText: {
                        displayText: req.body.Btn4
                    },
                    type: 1
                },

                ]

                const enviar_img = {
                    caption: caption,
                    footer: footer,
                    buttons: buttons,
                    image: {
                        url: file,
                    },

                };

                sock.sendMessage(jid, enviar_img).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response

                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });
            // Enviar Mensagem Somente Botão 
            app.post('/somentebotao', [
                body('jid').notEmpty()
            ], async (req, res) => {
                const errors = validationResult(req).formatWith(({
                    msg
                }) => {
                    return msg;
                });
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: false,
                        message: errors.mapped()
                    });
                }

                const buttons = [{
                    buttonId: '1',
                    buttonText: {
                        displayText: req.body.Btn1
                    },
                    type: 1
                },
                {
                    buttonId: '2',
                    buttonText: {
                        displayText: req.body.Btn2
                    },
                    type: 1
                },
                ]

                const jid = req.body.jid + '@s.whatsapp.net';
                const title = req.body.title;
                const footer = req.body.footer;
                const description = req.body.description;

                const LayoutPost = {
                    text: title,
                    buttons: buttons,
                    headerType: 1
                }

                sock.sendMessage(jid, LayoutPost).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response
                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });


            app.post('/cidades', [
                body('jid').notEmpty()
            ], async (req, res) => {
                const errors = validationResult(req).formatWith(({
                    msg
                }) => {
                    return msg;
                });
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: false,
                        message: errors.mapped()
                    });
                }

                const buttons = [{
                    buttonId: '1',
                    buttonText: {
                        displayText: req.body.Btn1
                    },
                    type: 1
                },
                {
                    buttonId: '2',
                    buttonText: {
                        displayText: req.body.Btn2
                    },
                    type: 1
                },
                {
                    buttonId: '3',
                    buttonText: {
                        displayText: req.body.Btn3
                    },
                    type: 1
                },
                {
                    buttonId: '4',
                    buttonText: {
                        displayText: req.body.Btn4
                    },
                    type: 1
                },
                {
                    buttonId: '5',
                    buttonText: {
                        displayText: req.body.Btn5
                    },
                    type: 1
                },
                {
                    buttonId: '6',
                    buttonText: {
                        displayText: req.body.Btn6
                    },
                    type: 1
                },
                {
                    buttonId: '7',
                    buttonText: {
                        displayText: req.body.Btn7
                    },
                    type: 1
                },
                {
                    buttonId: '8',
                    buttonText: {
                        displayText: req.body.Btn8
                    },
                    type: 1
                },
                {
                    buttonId: '9',
                    buttonText: {
                        displayText: req.body.Btn9
                    },
                    type: 1
                },
                {
                    buttonId: '10',
                    buttonText: {
                        displayText: req.body.Btn10
                    },
                    type: 1
                },
                {
                    buttonId: '11',
                    buttonText: {
                        displayText: req.body.Btn11
                    },
                    type: 1
                }
                ]

                const jid = req.body.jid + '@s.whatsapp.net';
                const title = req.body.title;
                const footer = req.body.footer;
                const description = req.body.description;

                const LayoutPost = {
                    text: title,
                    buttons: buttons,
                    headerType: 1
                }

                sock.sendMessage(jid, LayoutPost).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response
                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });
            // Enviar 4 Botões + Imagem
            app.post('/enviartexto', async (req, res) => {

                const jid = req.body.jid + '@s.whatsapp.net';
                const message = req.body.message;

                sock.sendMessage(jid, {
                    text: message
                }).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response

                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });
            // Enviar Imagem
            app.post('/imagem', [
                body('jid').notEmpty(),
            ], async (req, res) => {
                const errors = validationResult(req).formatWith(({
                    msg
                }) => {
                    return msg;
                });
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: false,
                        message: errors.mapped()
                    });
                }

                const jid = req.body.jid;
                const sendImagem = {
                    // opicional
                    caption: '' + req.body.caption + '',
                    image: {
                        url: req.body.url,
                    },
                    mimetype: 'image/png',
                    gifPlayback: true
                }
                sock.sendMessage(jid, sendImagem).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response
                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });
            app.post('/enviarlista', [
                body('jid').notEmpty()
            ], async (req, res) => {
                const errors = validationResult(req).formatWith(({
                    msg
                }) => {
                    return msg;
                });
                if (!errors.isEmpty()) {
                    return res.status(422).json({
                        status: false,
                        message: errors.mapped()
                    });
                }

                const sections = [{
                    title: req.body.sectionTitle,
                    rows: [{
                        title: req.body.title1,
                        description: req.body.description1,
                        rowId: '1'
                    },
                    {
                        title: req.body.title2,
                        description: req.body.description2,
                        rowId: '2'
                    },
                    {
                        title: req.body.title3,
                        description: req.body.description3,
                        rowId: '3'
                    },
                    ],
                }]

                const jid = req.body.jid;
                const title = req.body.title;
                const footer = req.body.footer;
                const description = req.body.description;

                const sendList = {
                    title: title + '\n',
                    text: description + '\n',
                    buttonText: req.body.button,
                    footer: footer,
                    sections: sections
                }

                sock.sendMessage(jid, sendList).then(response => {
                    res.status(200).json({
                        status: true,
                        response: response
                    });
                }).catch(err => {
                    res.status(500).json({
                        status: false,
                        response: err
                    });
                });
            });


        socket.on('delete-session', async function () {
            await sock.logout()
                .then(fs.rmSync(Path, { recursive: true, force: true }))
                .catch(function () {
                    console.log('© BOT- - Sessão removida');
                });
        });
    }
    Connection()

})
server.listen(port, function () {
    console.log('© BOT - Servidor rodando na porta: ' + port);
});
