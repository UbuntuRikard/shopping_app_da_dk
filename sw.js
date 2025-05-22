if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registreret:', registration);
    })
    .catch((error) => {
      console.log('Service Worker fejlede:', error);
    });
}
