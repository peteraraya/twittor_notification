// Para generar archivos con filesystem
const fs = require('fs');


const urlsafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid');

let suscripciones = require('./subs-db.json');

// webpush
const webpush = require('web-push');

webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:piteraraya@gmail.com',
  vapid.publicKey,
  vapid.privateKey
);

module.exports.getKey = () => {
  return urlsafeBase64.decode(vapid.publicKey);
};

module.exports.addSubscription = (suscripcion) => {

  suscripciones.push(suscripcion);

  // Grabamos en un archivo
  fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones));

  console.log(suscripciones);
}


module.exports.sendPush = (post) => {

  console.log('Mandando Pushes');

  let notificacionesEnviadas = [];
  
  suscripciones.forEach((suscripcion, i) => {
    
  const pushProm =  webpush.sendNotification(suscripcion, JSON.stringify(post))
      .then(console.log('Notificación enviada'))
      .catch(err => {
        console.log('Notificación falló');
        // GONE : ya no existe
        if (err.statusCode === 410) {
          suscripciones[i].borrar = true;
        }
      });
    
    notificacionesEnviadas.push(pushProm);
  });

  Promise.all(notificacionesEnviadas).then(() => {
    // borrar todas las subscripciones
    suscripciones = suscripciones.filter(subs => !subs.borrar);

    // reescribir las nuevas subscripciones
    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscripciones))


  });

};