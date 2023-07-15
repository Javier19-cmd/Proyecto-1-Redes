// const axios = require('axios');

// axios.get('http://alumchat.xyz')
//   .then(response => {
//     console.log(response.data);
//     console.log("No hubo errores")
//     // Aquí puedes manipular los datos recibidos
//   })
//   .catch(error => {
//     console.log(error);
//     // Manejo de errores
//   });

const io = require('socket.io-client');
const serverUrl = "http://alumchat.xyz:5222"
const socket = io(serverUrl);

// Realizar el register al servidor.
// Se tiene que mandar usuario y contraseña.
// Si el usuario ya existe, se debe de mandar un error.

user = "val20159"
password = "1234"

socket.on('Register', {user, password}, (response) => {
  console.log("Datos")
    console.log(response)
})