const functions = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.database.ref('/notifications/{pushId}').onWrite((event) => {
  const projectData = event.data.val();
	const projectCreated = !event.data.previous.exists();
  const projectStateChanged = !projectCreated && event.data.changed();

  const msg = projectCreated ?
    `New entry: ${projectData.title}`:
    'Entry updated';

  return loadUsers().then(users => {
    const tokens = users.map( user => user.pushToken);
    console.log('data', projectData);
    const payload = {
      notification: {
        title: projectData.title,
        body: projectData.body,
        icon: projectData.icon,
        badge: projectData.badge,
        actions: projectData.actions,
        vibrate: [500, 100, 0],
      }
    };
    return subscription = loadSubscriptions().then( subscription => {    // eslint-disable-line promise/no-nesting
      webpush.setGCMAPIKey('AAAAQKfgxnA:APA91bGrSOcLHXVJOC_UVPUInWqu1X5PQ5_8cRDwo9F2pEmwCvMdHS8gqwHD4L18aVu15igs7zdahvh4nzQg5VumjTLmyzvS-LwkJdhBNKVLsqRRf2NIy5Cv4yhryB8DwTeOjcUHNr92');
      return webpush.sendNotification(subscription, JSON.stringify(payload));
    });
  });
});

function loadUsers() {
  let dbRef = admin.database().ref('users/');
  let defer = new Promise((resolve, reject) => {
      dbRef.once('value', (snap) => {
          let data = snap.val();
          const users = data && data.map( user => user );
          resolve(users);
      }, (err) => {
          reject(err);
      });
  });
  return defer;
}

function loadSubscriptions() {
  let dbRef = admin.database().ref('subscriptions/');
  let defer = new Promise((resolve, reject) => {
      dbRef.once('value', (snap) => {
          let data = snap.val();
          const subscriptions = data['123'];
          resolve(subscriptions);
      }, (err) => {
          reject(err);
      });
  });
  return defer;
}
