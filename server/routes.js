// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require('./push');

const mensajes = [

  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensaje
router.post('/', function (req, res) {
  
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push( mensaje );

  console.log(mensajes);


  res.json({
    ok: true,
    mensaje
  });
});



// Almacenar la subscripción que nuestros clientes van a mandarnos
router.post('/subscribe', (req, res) => {

  const suscripcion = req.body;

  push.addSubscription(suscripcion);

  // console.log(suscripcion);

   res.json('subscribe');

});

// Nos va ayudar a nosotros a mandarles nuestro key publico a los clientes para que los pueda procesar y mandarnos la subcripcion
router.get('/key', (req, res) => {

  const key = push.getKey();
  
  // para enviar directamente colocamos un send
  res.send(key);

});

// Enviar una notificación push a las personas que nosotros queramos
// es algo que se controla en el lado del server
router.post('/push', (req, res) => {
 
  const notificacion = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  }

  push.sendPush(notificacion);

  res.json(notificacion);

});



module.exports = router;