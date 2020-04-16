/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//publication models
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'}
    
});

module.exports = mongoose.model('Publication', PublicationSchema);
