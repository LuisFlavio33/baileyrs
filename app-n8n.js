const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState  } = require('@adiwajshing/baileys')
const P = require('pino')
const { unlink, existsSync, mkdirSync } = require('fs')
const express = require('express');
const { body, validationResult } = require('express-validator');
const http = require('http');
const port = process.env.PORT || 8001;
const app = express();
const server = http.createServer(app);
const ZDGPath = 'ZDGSessions1';
const request = require('request')

const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const ZDGGroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

const ZDGUpdate = (ZDGsock) => {
   ZDGsock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr){
         console.log('© BOT-ZDG - Qrcode: ', qr);
      };
      if (connection === 'close') {
         const ZDGReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
         if (ZDGReconnect) ZDGConnection()
         console.log(`© BOT-ZDG - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
         if (ZDGReconnect === false) {
            fs.rmSync(ZDGPath, { recursive: true, force: true });
            const removeAuth = ZDGPath
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }
      if (connection === 'open'){
         console.log('© BOT-ZDG - CONECTADO')
      }
   })
}

const ZDGConnection = async () => {
   const { version } = await fetchLatestBaileysVersion()
   if (!existsSync(ZDGPath)) {
      mkdirSync(ZDGPath, { recursive: true });
   }
   const { state, saveCreds } = await useMultiFileAuthState(ZDGPath)
   const config = {
      auth: state,
      logger: P({ level: 'error' }),
      printQRInTerminal: true,
      version,
      connectTimeoutMs: 60_000,
      async getMessage(key) {
         return { conversation: 'botzg' };
      },
   }
   const ZDGsock = makeWaSocket(config, { auth: state });
   ZDGUpdate(ZDGsock.ev);
   ZDGsock.ev.on('creds.update', saveCreds);

   const ZDGSendMessage = async (jid, msg) => {
      await ZDGsock.presenceSubscribe(jid)
      await delay(1500)
      await ZDGsock.sendPresenceUpdate('composing', jid)
      await delay(1000)
      await ZDGsock.sendPresenceUpdate('paused', jid)
      return await ZDGsock.sendMessage(jid, msg)
   }

   ZDGsock.ev.on('messages.upsert', async ({ messages, type }) => {
      const msg = messages[0]
      const jid = msg.key.remoteJid
   
         if (!msg.key.fromMe && jid !== 'status@broadcast' && !ZDGGroupCheck(jid)) {
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
               }
               else {
                 console.log(response.body);
               }
             });	

         }
   })

   // Send button
   app.post('/zdg-button', [
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

      const buttons = [
         { buttonId: 'zdg1', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'zdg2', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         { buttonId: 'zdg3', buttonText: { displayText: req.body.ZDGBtn3 }, type: 1 },
      ]

      const jid = req.body.jid;
      const title = req.body.title;
      const footer = req.body.footer;
      const description = req.body.description;

      const ZDGLayoutPost = {
         text: title + '\n' + description,
         footer: footer,
         buttons: buttons,
         headerType: 1
      }

         ZDGsock.sendMessage(jid, ZDGLayoutPost).then(response => {
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

   // Send button
   app.post('/zdg-list', [
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

      const sections = [
         {
            title: req.body.sectionTitle,
            rows: [
               { title: req.body.title1, description: req.body.description1, rowId: 'zdg1' },
               { title: req.body.title2, description: req.body.description2, rowId: 'zdg2' },
               { title: req.body.title3, description: req.body.description3, rowId: 'zdg3' },
            ],
         }
      ]

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

         ZDGsock.sendMessage(jid, sendList).then(response => {
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

   // Send message
   app.post('/zdg-message', [
      body('jid').notEmpty(),
      body('message').notEmpty(),
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
      const message = req.body.message;

         ZDGsock.sendMessage(jid, { text: message }).then(response => {
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

   // Send video
   app.post('/zdg-video', [
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
      const sendVideo = {
         // opicional
         caption: '```' + req.body.caption + '```',
         video: {
            url: req.body.url,
         },
         mimetype: 'video/mp4',
         gifPlayback: true
      }

         ZDGsock.sendMessage(jid, sendVideo).then(response => {
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

   // Send video
   app.post('/zdg-imagem', [
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
         caption: '```' + req.body.caption + '```',
         image: {
            url: req.body.url,
         },
         mimetype: 'image/png',
         gifPlayback: true
      }
         ZDGsock.sendMessage(jid, sendImagem).then(response => {
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

   // Send audio
   app.post('/zdg-audio', [
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
      const sendAudio = {
         audio: { 
            url: req.body.url 
         },
         mimetype: 'audio/mp4'
      }

         ZDGsock.sendMessage(jid, sendAudio).then(response => {
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

      // Send record
   app.post('/zdg-record', [
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
         const sendAudio = {
            audio: { 
               url: req.body.url 
            },
            mimetype: 'audio/ogg',
            ptt:true
         }
   
            ZDGsock.sendMessage(jid, sendAudio).then(response => {
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

   // Send vcard
   app.post('/zdg-vcard', [
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
   
      const jid = req.body.jid;
      const name = req.body.name;
      const organization = req.body.organization;
      const cel = req.body.cel;
      const wid = req.body.wid;
      // send a contact!
      const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
      + 'VERSION:3.0\n' 
      + 'FN:'+ name +'\n' // full name
      + 'ORG:'+ organization + ';\n' // the organization of the contact
      + 'TEL;type=CELL;type=VOICE;waid='+ wid + ':'+cel+'\n' // WhatsApp ID + phone number
      + 'END:VCARD'

         await ZDGsock.sendMessage(jid, {contacts: {displayName: name, contacts: [{ vcard }]}}).then(response => {
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

}

ZDGConnection()

server.listen(port, function() {
   console.log('© BOT-ZDG - Servidor rodando na porta: ' + port);
 });
