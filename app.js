const makeWaSocket = require('@adiwajshing/baileys').default
const { delay, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState  } = require('@adiwajshing/baileys')
const P = require('pino')
const { unlink, existsSync, mkdirSync } = require('fs')
const express = require('express');
const { body, validationResult } = require('express-validator');
const http = require('http');
const port = process.env.PORT || 8001;
const app = express();
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const ZDGPath = 'Sessions1';
const request = require('request');






const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const ZDGurlBtn1 = {
   url: 'link',
   displayText: 'texto',
}
const ZDGurlBtn2 = {
   url: 'link',
   displayText: 'texto',
}
const ZDGreplyBtn1 = {
   id: 'zdg1',
   displayText: 'Resposta 1',
}
const ZDGreplyBtn2 = {
   id: 'zdg2',
   displayText: 'Resposta 2',
}
const callButton = {
   displayText: 'Ligar agora â˜Žï¸',
   phoneNumber: 'tel',
}
const ZDGbtnMD = [
   { index: 0, urlButton: ZDGurlBtn1 },
   { index: 1, urlButton: ZDGurlBtn2 },
   { index: 2, callButton },
   { index: 3, quickReplyButton: ZDGreplyBtn1 },
   { index: 4, quickReplyButton: ZDGreplyBtn2 }
   
   ]

const ZDGGroupCheck = (jid) => {
   const regexp = new RegExp(/^\d{18}@g.us$/)
   return regexp.test(jid)
}

const ZDGUpdate = (ZDGsock) => {
   ZDGsock.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr){
         console.log('© BOT - Qrcode: ', qr);
      };
      if (connection === 'close') {
         const ZDGReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
         if (ZDGReconnect) ZDGConnection()
         console.log(`© BOT - CONEXÃO FECHADA! RAZÃO: ` + DisconnectReason.loggedOut.toString());
         if (ZDGReconnect === false) {
            fs.rmSync(ZDGPath, { recursive: true, force: true });
            const removeAuth = ZDGPath
            unlink(removeAuth, err => {
               if (err) throw err
            })
         }
      }
      if (connection === 'open'){
         console.log('© BOT - CONECTADO')
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
         return { conversation: 'Teste_envio_automatico' };
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
               'url': 'http://localhost:5678/webhook/73e2cb97-0296-465d-abdb-70f3a7a2e73a',
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
   
//menssagem

// Enviar Mensagem com Botão ***TRATADO***

 app.post('/textimg', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	
	  
	   const buttons = [
         { buttonId: 'sim', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'nao', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         
		 ]
	  
	  const enviar_img = {
               caption : caption,
               footer: 'https://divinodoutor.com.br/',
			   buttons: buttons,
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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
   
  // Fim Enviar Mensagem Botão
// Enviar Mensagem com Botão ***SEM TRATAMENTO***

 app.post('/textimg_st', async (req, res) => {

      const jid = req.body.jid;
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	
	  
	   const buttons = [
         { buttonId: 'sim', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'nao', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         
		 ]
	  
	  const enviar_img = {
               caption : caption,
               footer: 'https://divinodoutor.com.br/',
			   buttons: buttons,
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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
   
  // Fim Enviar Mensagem Botão
// Send message ********TRATADO******




   app.post('/message', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const message = req.body.message;
	  const title = req.body.title;
      const footer = req.body.footer;
      const description = req.body.description;

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





//final msg

// Send message ********SEM TRATAMENTO******

app.post('/message_st', async (req, res) => {

      const jid = req.body.jid;
      const message = req.body.message;
	  const title = req.body.title;
      const footer = req.body.footer;
      const description = req.body.description;

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
 // imagem
 
 // Enviar Card ok ***** TRATADO*****
 
  app.post('/imagem', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	  
	  const enviar_img = {
               caption: 'Abra seu chamado no link: ➡ http://ibitecsamu.com.br/desk',
               footer: 'teste',
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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


 
      ZDGsock.ev.on('messages.upsert', async ({ messages, type }) => {
   const msg = messages[0]
   const jid = msg.key.remoteJid
   const ZDGUser = msg.pushName;
   

      if (!ZDGGroupCheck(jid) && !msg.key.fromMe && jid !== 'status@broadcast') {
        
         if (msg.message.conversation.toLowerCase() === 'zdg1') {     
            const ZDGbtnImage = {
               caption: 'Abra seu chamado no link: ➡ http://ibitecsamu.com.br/desk',
               footer: 'teste',
               image: {
                  url: './assets/card.jpg',
               },
               
            }
            ZDGSendMessage(jid, ZDGbtnImage)
               .then(result => console.log('RESULT: ', result))
               .catch(err => console.log('ERROR: ', err))
         }
        
      }
   })

   // fim Enviar Card ok 

// fim imagem

// enviar card com botao
// Enviar Card Com botão
 
  app.post('/cardbtn1', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	  
	   const buttons = [
         { buttonId: 'zdg1', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'zdg2', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         
		 ]
	  
	  const enviar_img = {
               caption: 'Abra seu chamado no link: ➡ http://ibitecsamu.com.br/desk',
               footer: 'www.ibitecsamu.com.br/desk',
			   buttons: buttons,
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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

// fim Enviar Card Com botão 
// Enviar Card Com botão
 
  app.post('/cardbtn2', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	  
	   const buttons = [
         { buttonId: 'zdg1', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'zdg2', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         
		 ]
	  
	  const enviar_img = {
               caption: 'Abra seu chamado no link: ➡ https://sites.google.com/view/solicitacaodegravacao',
               footer: 'www.ibitecsamu.com.br/gravacao',
			   buttons: buttons,
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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

// fim Enviar Card Com botão 
// Enviar Card Com botão 3
 
  app.post('/cardbtn3', async (req, res) => {

      const jid = 55 + req.body.jid + '@c.us';
      const body = req.body.body;
	  const caption = req.body.caption;
      const file = "http://idsolucoesweb.com.br/rcenter/mes2.jpeg";
      const description = req.body.description;
	  
	   const buttons = [
         { buttonId: 'zdg1', buttonText: { displayText: req.body.ZDGBtn1 }, type: 1 },
         { buttonId: 'zdg2', buttonText: { displayText: req.body.ZDGBtn2 }, type: 1 },
         
		 ]
	  
	  const enviar_img = {
               caption: 'Fale com a nossa equipe: ➡ Contato: (11) 3397-5320',
               footer: 'http://www.ibitecsamu.com.br',
			   buttons: buttons,
               image: {
                  url: './assets/card.jpg',
               },
               
            };

      ZDGsock.sendMessage(jid,enviar_img).then(response => {
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

// fim Enviar Card Com botão 

// botao url inicio
// send button url

  app.post('/urlbtn', [
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
	
	        const jid = 55 + req.body.jid + '@c.us';
            const title = req.body.title;
            const footer = req.body.footer;
            const description = req.body.description;
	        const ZDGLayout = {
            text: '*ZDG TÃ­tulo do BotÃ£o*\n\nZDG DescriÃ§Ã£o do BotÃ£o',
            footer: 'Â© BOT-ZDG',
            templateButtons: ZDGbtnMD
			
			}
	
	ZDGsock.sendMessage(jid, ZDGLayout).then(response => {
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

		
   


// final send button url
// botao url fim



// send list inicio

  app.post('/list', [
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
                  title: 'ZDG #1',
                  rows: [
                     { title: 'Coluna #1', description: 'DescriÃ§Ã£o #1', rowId: 'zdg1' },
                     { title: 'Coluna #2', description: 'DescriÃ§Ã£o #2', rowId: 'zdg2' },
                     { title: 'Coluna #3', description: 'DescriÃ§Ã£o #3', rowId: 'zdg3' },
                  ],
               },
               {
                  title: 'ZDG #2',
                  rows: [
                     { title: 'Coluna #1', description: 'DescriÃ§Ã£o #1', rowId: 'zdg3' },
                     { title: 'Coluna #2', description: 'DescriÃ§Ã£o #2', rowId: 'zdg5' },
                     { title: 'Coluna #3', description: 'DescriÃ§Ã£o #3', rowId: 'zdg6' },
                     { title: 'Coluna #4', description: 'DescriÃ§Ã£o #4', rowId: 'zdg7' },
                  ],
               },
               {
                  title: 'ZDG #3',
                  rows: [
                     { title: 'Coluna 01', description: 'DescriÃ§Ã£o #1', rowId: 'zdg8' },
                     { title: 'Coluna 02', description: 'DescriÃ§Ã£o #2', rowId: 'zdg9' },
                  ],
               },
            ]

            const jid = 55 + req.body.jid + '@c.us';
            const title = req.body.title;
            const footer = req.body.footer;
            const description = req.body.description;
			const sendList = {
               title: 'TESTE\n',
               text: 'Clique no botÃ£o\n',
               buttonText: 'Clique aqui',
               footer: 'Â©BOT-ZDG\nComunidade ZDG: https://zapdasgalaxias.com.br/',
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

		
   


// botao list fim


// final enviar card com botao
			

   // Send button
   app.post('/button', [
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

      const jid = 55 + req.body.jid + '@c.us';
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

}

ZDGConnection()

server.listen(port, function() {
   console.log('© BOT - Servidor rodando na porta: ' + port);
 });

  