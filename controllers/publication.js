'use strict'

//publication of controllers

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');


var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res){
    res.status(200).send({
        message: "Hola desde el CONTROLADOR DE PUBLICACIONES"
    });
}



// hace una publicacion
function savePublication(req, res){
    var params = req.body;
    
    if(params.text) return res.status(200).send({message: 'Debes enviar un texto!!'});
    
    
    var Publication = new Publication();
   publication.text = params.text;
   publication.file = 'null';
   publication.user = req.user.sub;
   publication.created_at = moment().unix();
   
   publication.save((err, publicationStored) => {
     if(err) return res.status(500).send({message: 'Error al guardar la publication'});
     
     if(!publicationSored) return res.status(404).send({message: 'la publicacion no ha sido guardada'});
   
    return res.status(200).send({publication: publicationStored});
    
    });
  
}


// publicar publicaciones en el timeline
function getPublications(req, res){
    var page = 1;
        if(req.params.page){
          page = req.params.page;
        }

    var itemsPerPage = 4;

    Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
    if(err) return res.status(500).send({message: 'Error devolver el seguimiento'});

    var follows_clean = [];

    follows.forEach((follow) => {
      follows_clean.push(follow.followed);

    });

    //console.log(follows_clean);
    Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) =>{
        if(err) return res.status(500).send({message: 'Error devolver PUBLICACIONES'});

        if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

        return res.status(200).send({
          total_items: total,
          pages: Math.ceil(total/itemsPerPage),
          page: pages,
          publications

        });
    });

  });

}


// buscar una publicacion

function getPublication(req, res){
  var publicationId = req.params.id;

  Publication.findById(publicationId, (err, publication) => {
    if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

    if(!publication) return res.status(404).send({message: 'No existe la publicacion'});

     return res.status(200).send({publication});

  });
}

// borrar publicacion que un usuario ha publicado
function deletePublication(req, res){
  var publicationId = req.params.id;

  publication.find({'user': req.user.sub, '_id' : publicationId}).exec(err => {
     if(err) return res.status(500).send({message: 'Error al borrar publicaciones'});

    if(!publicationRemoved) return res.status(404).send({message: 'No se ha borrado la publicacion'});

     return res.status(200).send({message: 'Publicacion eliminada correctamente' });


  })
}


// subir archivos de imagen / a las publicaciones
function uploadImage(req, res){
    var publicationId = req.params.id;
   
   if(req.files){
       var file_path = req.files.image.path;
       console.log(file_path);
       
       var file_split = file_path.split('\\');
       console.log(file_split);
       
       var file_name = file_split[2];
       console.log(file_name);
       
       var ext_split = file_name.split('\.');
       console.log(ext_split);
        
        var file_ext = ext_split[1];
        console.log(file_ext);
        
          
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
           

           publication.findOne({'user' : req.user.sub, '_id': publicationId}).exec((err, publication) => {

           if (publication){

           //actualizar documento de la publicacion
          publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => {
         if (err) return res.status(500).send({message: 'Error en la peticion'});
        
        if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        
        return res.status(200).send({publication:publicationUpdated});
                
           });

           }else{return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');

           }

           });

       }else{
          return removeFilesOfUploads(res, file_path, 'Extension no validad');
       }
       
       
   }else{
       return res.status(200).send({message: 'No se han subido ningun archivo y/o imagen'});
       
   }
}


function removeFilesOfUploads(res, file_path, message){
     fs.unlink(file_path, (err) => {
            return res.status(200).send({message: message});
           });
          }
    


//devolver imagen

function getImageFile(req, res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/publication/'+image_file;
    
    fs.exists(path_file, (exists) => {
       if(exists){
           res.sendFile(path.resolve(path_file));
       }else{
           res.status(200).send({message: 'No existe la imagen...'});
       } 
    });
}



module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    removeFilesOfUploads,
    getImageFile

}


