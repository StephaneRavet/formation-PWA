if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then((reg) => {
      // registration worked
      console.log('Enregistrement réussi')
    }).catch((error) => {
    // registration failed
    console.log('Erreur : ' + error)
  })
}
