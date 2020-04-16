/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.autorization){
        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'});
        
    }
    var token = req.hearders.autorization.replace(/['"]+/g, '');
    
   try{
       var payload = jwt.decode(token, secret);
       
       if(payload.exp <= moment().unix()){
           return res.status(401).send({
               message: 'El token ha exprado'
           });
       }
   }catch(ex){
       
       return res.status(401).send({
               message: 'El token no es valido'
           });
       
       
   }
    
    req.user = payload;
    
    next();
    
    
    
}