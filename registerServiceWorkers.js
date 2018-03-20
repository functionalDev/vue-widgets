export const registerServiceWorker = url => {
  if( typeof url !== "string"){
    console.warning(`Can't register ServiceWorker with: ${url}`);
    return;
  }
  const local = Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
  if ('serviceWorker' in navigator && ("https:" === window.location.protocol || local) {
  	navigator.serviceWorker.register('/pushSW.js', {
      })
      .then( registration => {
        // registration worked
        console.log('Service worker registration succeeded.');
        return registration.sync.getTags();
      })
      .then((tags) => {
        if(tags.includes('backgroundSync')){
         console.log('There is already a background sync pending');
        }
      })
      .catch( error => {
        // registration failed
        console.error("Error during service worker registration:", error)
  	});
  }
}
