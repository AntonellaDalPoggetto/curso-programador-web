var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var nodemailer = require('nodemailer');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
var maquinasModel = require('./../models/maquinasModel')
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function (req, res, next) {

  var maquinas = await maquinasModel.getMaquinas();

  maquinas = maquinas.splice(0, 5);  //seleccionamos el ultimo elemento del array
  maquinas = maquinas.map(maquina => {
    if (maquina.img_id) {
      const imagen = cloudinary.url(maquina.img_id, {
        width: 460,
        crop: 'fill'
      });
      return {
        ...maquina,
        imagen
      }
    } else {
      return {
        ...maquina,
        imagen: '/images/noimage.jpg'
      }
    }
  });


  res.render('index', { 
    maquinas 
  });
});

router.post('/', async (req, res, next) => {
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var telefono = req.body.telefono;
  var email = req.body.email;
  var mensaje = req.body.mensaje;

  var obj = {
    to: 'fabiana@disegno.com.ar',
    subject: 'PRESUPUESTO WEB',
    html: nombre + apellido + " se contacto a traves de la web y quiere mas informacion a este correo : " + email + ". <br> Ademas, hzio este comentario : " + mensaje + ". <br> Su telefono es: " + telefono
}

var transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
var info = await transport.sendMail(obj);

res.render('index', {
  message: 'mensaje enviado correctamente'
});

}); 

module.exports = router;
