'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res){
	res.status(200).send({message: 'Hola que tal desde los mensajes privados'});


}


function saveMessage(req, res){
	var params = req.body;

	if(!params.text || !params.reciever) return res.status(200).send({message: 'Envia los datos necesarios'});

	var message = new Message();
	message.emitter = req.use.sub;
	message.reciever = params.reciever;
	message.text = params.text;
	message.created_at = moment().unix();
	messages.viewed = 'false';

	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({message:  messageStored});



	});


}

//mensajes recividos

function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;

	}

	var itemsPerPage = 4;

	menssage.find({receiver: userId}).populate('emitter', 'name surname nick image _id' ).paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		if(!messages) return res.status(404).send({message: 'no hay mensajes'});
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages

		});

	});


}

//mensajes enviados

function getEmmitMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;

	}

	var itemsPerPage = 4;

	menssage.find({emitter: userId}).populate('emitter receiver', 'name surname nick image _id' ).paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		if(!messages) return res.status(404).send({message: 'no hay mensajes'});
		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages

		});

	});


}



//mensajes no visto

function getUnviewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver:userId, viewed: 'false'}).exec((err, count) => {
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		return res.status(200).send({
			'unviewed': count

	});
});
}

//mensajes leidos

function setViewedMessanges(req, res){
	var userId = req.user.sub;

	Message.update({receiver:userId, viewed:'false'}, {viewed: 'true'}, {"multi": true}, (err, messageUpdated) =>{
		if(err) return res.status(500).send({message: 'Error en la peticion'});
		return res.status(200).send({
			Message: messageUpdated

	});
	});
}






module.exports = {
	probando,
	saveMessage,
	getReceivedMessages,
	getEmmitMessages,
	getUnviewedMessages,
	setViewedMessanges
}