export const registerServiceWorker = url => {
  if( typeof url !== "string"){
    console.warning(`Can't register ServiceWorker with: ${url}`);
    return;
  }
  const local = Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
  if ('serviceWorker' in navigator && ("https:" === window.location.protocol || local) {
  	navigator.serviceWorker.register('/pushSW.js', {
        scope: '/'
      })
      .then( registration => {
        // registration worked
        console.log('Service worker registration succeeded. Scope is ' + reg.scope);
      }).catch( error => {
        // registration failed
        console.error("Error during service worker registration:", error)
  	});
  }
}
