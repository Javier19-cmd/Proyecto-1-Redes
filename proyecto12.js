const net = require('net');
const readline = require('readline');

// Datos de conexión
// const jid = 'val20159';
// const password = '1234';
const serverHost = 'alumchat.xyz';
const serverPort = 5222;

function inicioSesion(jid, password) {
  // Conexión TCP
  const client = net.connect({ host: serverHost, port: serverPort }, () => {
    console.log('Conexión establecida con el servidor XMPP');

    // Envío del inicio de sesión
    const xmlAuth = `<auth xmlns="urn:ietf:params:xml:ns:xmpp-sasl" mechanism="PLAIN">${Buffer.from(`${jid}\x00${jid}\x00${password}`).toString('base64')}</auth>`;
    client.write(xmlAuth);

    // Envío del inicio de la secuencia XML
    const xmlStream = `<?xml version="1.0" encoding="UTF-8"?><stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="${serverHost}" version="1.0">`;
    client.write(xmlStream);
  });

  // Recepción de datos del servidor XMPP
  client.on('data', (data) => {
    // Procesar la respuesta del servidor y realizar otras acciones según sea necesario

    // Imprimiendo la respuesta de una mejor manera.
    const xml = data.toString();
    const xmlLines = xml.split('\n');
    xmlLines.forEach((line) => {
      console.log(line);
    });
  });

  // Manejo de errores
  client.on('error', (error) => {
    console.error('Error en la conexión con el servidor XMPP:', error);
  });

  // Cierre de la conexión
  client.on('end', () => {
    console.log('Conexión cerrada con el servidor XMPP');
  });
}

// // Haciendo un registro de cuenta en el servidor XMPP.
// const xmlRegister = `<iq type="set" id="reg2" to="alumchat.xyz"><query xmlns="jabber:iq:register"><username>vale20158</username><password>1234</password></query></iq>`;

// // Envío de datos al servidor XMPP
// client.write(xmlRegister);

// // Dando mensaje de éxito.
// console.log("Registro exitoso.");

// // Manejo de errores
// client.on('error', (error) => {
//   console.error('Error en la conexión con el servidor XMPP:', error);
// });

// // Cierre de la conexión
// client.on('end', () => {
//   console.log('Conexión cerrada con el servidor XMPP');
// });


// Creando un método main.
function main() {
  // Creando un menú de opciones.
  console.log("Bienvenido al cliente XMPP.");

  // Creando un menú de opciones.
  console.log("1. Registrar una cuenta.");
  console.log("2. Iniciar sesión.");

  // Pidiendo la opción al usuario.
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Pidiendo la opción al usuario.
  rl.question('¿Qué opción deseas?: ', (answer) => {
    // Si la opción es 1, entonces se inicia sesión.
    if (answer == 1) {
      // Pidiendo usuario y contraseña.

      rl.question("Ingrese el usuario: ", (username) => {

        rl.question("Ingrese la contraseña: ", (password) => {

            // Llamando al método iniciar sesión.
            inicioSesion(username, password);

        })
      })
    
    }
  })

}

main()