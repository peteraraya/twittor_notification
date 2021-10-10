// Para generar archivos con filesystem
const fs = require('fs');


const urlsafeBase64 = require('urlsafe-base64');
const vapid = require('./vapid');

const suscripciones = require('./subs-db.json');

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
  fs.writeFileSync(`${ __dirname}/subs-db.json`,JSON.stringify(suscripciones))

  console.log(suscripciones);
}


module.exports.sendPush = (post) => {
  
  suscripciones.forEach((suscripcion, i) => {
    
    webpush.sendNotification(suscripcion, JSON.stringify(post));

  });


};