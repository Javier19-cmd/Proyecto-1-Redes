const axios = require('axios');

axios.get('http://alumchat.xyz')
  .then(response => {
    console.log(response.data);
    console.log("No hubo errores")
    // Aquí puedes manipular los datos recibidos
  })
  .catch(error => {
    console.log(error);
    // Manejo de errores
  });
