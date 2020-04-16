/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// models user
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
			name: String,
			surname: String,
			nick: String,
			email: String,
			password: String,
			role: String,
			image: String


});

module.exports = mongoose.model('User', UserSchema);


