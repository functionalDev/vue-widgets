(() => {
  'use strict'

  const PushServiceWorker = {
    init () {
      self.addEventListener('push', this.notificationPush.bind(this))
      self.addEventListener('notificationclick', this.notificationClick.bind(this))
      self.addEventListener('notificationclose', this.notificationClose.bind(this))
      self.addEventListener('sync', this.backgroundSync.bind(this))
    },
    /**
     * Handle sync event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/SyncEvent
     * https://developers.google.com/web/updates/2015/12/background-sync
     *
     * @param {NotificationEvent} event
     */
    backgroundSync (event) {
      if(event.tag === 'myFirstSync'){
       event.waitUntil(
        console.log('Sync successful');
       ); 
      }
    },
    /**
     * Handle notification push event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/push
     *
     * @param {NotificationEvent} event
     */
    notificationPush (event) {
      if (!(self.Notification && self.Notification.permission === 'granted')) {
        return
      }

      // https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData
      if (event.data && event.data.json() && event.data.json().notification) {
        event.waitUntil(
          this.sendNotification(event.data.json().notification)
        )
      }
    },

    /**
     * Handle notification click event.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/notificationclick
     *
     * @param {NotificationEvent} event
     */
    notificationClick (event) {
      // console.log(event.notification)

      switch (event.action) {
        case "open":
          self.clients.openWindow('/')
          break;
        case "setting":
          self.clients.openWindow('/#/settings')
          //
          break;
        case "blaa":
          //
          break;
        default:
          break;
      } 
    },

    /**
     * Handle notification close event (Chrome 50+, Firefox 55+).
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/onnotificationclose
     *
     * @param {NotificationEvent} event
     */
    notificationClose (event) {
      self.registration.pushManager.getSubscription().then(subscription => {
        if (subscription) {
          this.dismissNotification(event, subscription)
        }
      })
    },

    /**
     * Send notification to the user.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
     *
     * @param {PushMessageData|Object} data
     */
    sendNotification (data) {
      return self.registration.showNotification(data.title, data)
    },

    /**
     * Send request to server to dismiss a notification.
     *
     * @param  {NotificationEvent} event
     * @param  {String} subscription.endpoint
     * @return {Response}
     */
    dismissNotification ({ notification }, { endpoint }) {
      if (!notification.data || !notification.data.id) {
        return
      }

      const data = new FormData()
      data.append('endpoint', endpoint)

      // Send a request to the server to mark the notification as read.
      // fetch(`/notifications/${notification.data.id}/dismiss`, {
      //   method: 'POST',
      //   body: data
      // })
    }
  }

  PushServiceWorker.init()
})();
