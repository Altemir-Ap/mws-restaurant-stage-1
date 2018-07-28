if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (response) {
      console.log("Service Worker Registered:", response.active.state);
    }, function (error) {
      console.log("ServiceWorker Registration has failed: ", error);
    });
  }