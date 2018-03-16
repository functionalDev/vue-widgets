const functions = require('firebase-functions');
const admin = require('firebase-admin');
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

    const payload = {
        notification: {
            title: 'Firebase Notification',
            body: msg,
            sound: 'default',
            badge: '1'
        }
    };

    return admin.messaging().sendToDevice(tokens, payload);
  });
});

function loadUsers() {
  let dbRef = admin.database().ref('users/');
  let defer = new Promise((resolve, reject) => {
      dbRef.once('value', (snap) => {
          let data = snap.val();
          console.log(snap.val());
          const users = data && data.map( user => user );
          resolve(users);
      }, (err) => {
          reject(err);
      });
  });
  return defer;
}
