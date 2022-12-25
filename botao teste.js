// send button url

  app.post('/zdg-buttonurl', [
    body('jid').notEmpty()
],  async (req, res) => {
    const erros = validationResult(req).formatWith (({
	msg
	}) => {
		return msg;
	});
	if (!errors.isEmpty()) {
	return res.status(442).json({
		status: false,
		message: errors.mapped()
	});
	}
	
	const ZDGBtn1Post = {
		id: 'ZDGContinuar',
		displayText: req.body.ZDGBtn1,
	}
	const ZDGBtn1Post = {
		id: 'ZDGSair',
		displayText: req.body.ZDGBtn2,
	}
	const ZDGBtn1Post = {
		id: 'ZDG',
		displayText: req.body.ZDGBtn3,
	}
	const ZDGbtnMDPost = [
	   { index: 1, quickReplyButton: ZDGBtn1Post },
	   { index: 2, quickReplyButton: ZDGBtn2Post },
	   { index: 3, quickReplyButton: ZDGBtn3Post },
	]
	const jid = req.body.jid;
	const numberDDI = jid..substr(0, 2);
	const numberDDD = jid..substr(2, 2);
	const numberUser = jid..substr(-8, 8);
	const title = req.body.title;
	const footer = req.body.footer;
	const description = req.body.description;
	const mensagemTxt = req.body.mensagemTxt;
	const ZDGLayoutPost = {
		text: title + '\n' + description,
		footer: footer,
		templateButtons: ZDGbtnMDPost
	}
	if (numberDDI !== '55') {
		const numberZDG = jid + "@s.whatsapp.net";
		ZDGsock.sendMessage(numberZDG, { text: mensagemTxt})
		.then(result => ZDGsock.sendMessage(numberZDG, ZDGLayoutPost).then(response => {
		    res.status(200).json({
		   	  status: true,
			  response: response
			});
		    }).catch(err => {
		    res.status(500).json({
				status: false,
				response: err
			});
			}))
		.catch(err => console.log('ERROR: ', err))
	}
	if (numberDDI === '55' && numberDDD <== 30) {
		const numberZDG = "55" + numberDDD + "9" + numberUser + "@s.whatsapp.net";
		ZDGsock.sendMessage(numberZDG, { text: mensagemTxt})
		.then(result => ZDGsock.sendMessage(numberZDG, ZDGLayoutPost).then(response => {
			res.status(200).json ({
				status:true,
				response: response
			});
		    }).catch(err => {
				res.status(500).json({
					status: false,
					response: err
				});
			}))
		.catch(err => console.log('ERROR: ', err))
	}
	if (numberDDI == '55' && numberDDD > 30) {
		const numberZDG = "55" + numberDDD + numberUser + "@s.whatsapp.net";
		ZDGsock.sendMessage(numberZDG, {text: mensagemTxt})
		.then(result => ZDGsock.sendMessage(numberZDG, ZDGLayoutPost).then (response => {
			res.status(200).json ({
				status:true,
				response: response
			});
		    }).catch(err => {
				res.status(500).json({
					status: false,
					response: err
				});
			}))
		.catch(err => console.log('ERROR: ', err))
	}

		
   


// final send button url