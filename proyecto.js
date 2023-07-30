const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const { unsubscribe } = require("diagnostics_channel");
const net = require("net");
const cliente = new net.Socket();

// Password: 1234

const readline = require("readline");

// const xmpp = client({
//   service: "xmpp://alumchat.xyz:5222",
//   domain: "alumchat.xyz",
//   username: "val20159",
//   password: "1234",
// });

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// // debug(xmpp, true);

// xmpp.on("error", (err) => {
//   console.error(err);
// });

// xmpp.on("online", async (address) => {
//   // Makes itself available
//   await xmpp.send(xml("presence"));

//   // Sends a chat message to "gon20362@alumchat.xyz"
//   const message = xml(
//     "message",
//     { type: "chat", to: "mom20067@alumchat.xyz" },
//     xml("body", {}, "Hello, this is a message from val20159!"),
//   );

//   // Log the sent message to avoid an infinite loop of receiving it as well
//   //console.log("Sending message:", message.toString());

//   await xmpp.send(message);
// });

// xmpp.start().catch(console.error);

// Lector del input.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menú inicial.
function showMenu() {
  console.log("\nMenú");
  console.log("1. Iniciar sesión");
  console.log("2. Registrarse");
  console.log("3. Salir");

  rl.question("Selecciona una opción: ", (answer) => {
    switch (answer) {
      case "1":
        // Pidiendo los datos del usuario, o sea usuario y contraseña.
        
        rl.question("Usuario: ", (username) => {
          rl.question("Contraseña: ", (password) => {
            login(username, password);
        
          })})
        break;
      case "2":
        register();
        break;
      case "3":
        console.log("Saliendo...");
        rl.close(); // Cerrar la interfaz antes de salir del programa.
        showMenu()
        break;
      default:
        console.log("Opción inválida.");
        showMenu();
    }
  });
}

async function login(username, password) {
  // Implementa aquí la lógica para iniciar sesión.
  // Por ejemplo, puedes pedir al usuario su nombre de usuario y contraseña y validarlas.

  //console.log("Usuario: ", username)
  //console.log("Contraseña:", password)

  const xmpp = client({
    service: "xmpp://alumchat.xyz:5222",
    domain: "alumchat.xyz",
    username: username,
    password: password,
    terminal: true,
  });

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // debug(xmpp, true);

  xmpp.on("error", (err) => {
    console.error(err);
  });

  xmpp.on("online", async (address) => {
    // Makes itself available
    await xmpp.send(xml("presence"));

    // console.log("Inició sesión con este address: ", address)

    /**
     * Creando un menú con estas opciones: 
     * 1. Mostrar todos los usuarios/contactos y su estado.
     * 2. Agregar un usuario a los contactos.
     * 3. Mostrar detalles de contacto de un usuario.
     * 4. Comunicación 1 a 1 con cualquier usuario/contacto.
     * 5. Participar en conversaciones grupales.
     * 6. Definir mensaje de presencia.
     * 7. Enviar/recibir notificaciones.
     * 8. Enviar/recibir archivos.
     * 9. Eliminar cuenta del servidor.
     */

    console.log("1. Enseñar todos los usuarios y su estado")
    console.log("2. Agregar un usuario a mis contactos")
    console.log("3. Mostrar detalles de un contacto")
    console.log("4. Comunicación 1 a 1 con cualquier usuario/contacto")
    console.log("5. Participar en conversaciones grupales")
    console.log("6. Definir un mensaje de presencia")
    console.log("7. Enviar/recibir notificaciones")
    console.log("8. Enviar/recibir archivos")
    console.log("9. Eliminar cuenta")

    const mainMenu = () => {
      rl.question("¿Qué opción deseas?: ", (answer) => {
        switch (answer) {
          case '1':
            console.log('Mostrando todos los usuarios y su estado...');
            
            mainMenu();
            break;
        
          
          case "2":
            console.log("Agregando un usuario a mis contactos...")
            // Lógica para la subopción 2
            mainMenu(); // Vuelve al menú principal después de completar la opción
            break;
          case "3":
            console.log("Mostrando detalles de un contacto...")
            // Lógica para la subopción 3
            mainMenu(); // Vuelve al menú principal después de completar la opción
            break;
          case "4":
            console.log("Comunicación 1 a 1 con cualquier usuario/contacto...");
            // Lógica para la subopción 4
            xmpp.on('stanza', async (stanza) => {
              if (stanza.is('message') && stanza.attrs.type === 'chat') {
                const from = stanza.attrs.from;
                const body = stanza.getChildText('body');
            
                console.log(`Mensaje recibido de ${from}: ${body}`);
              }
            });
            rl.question("¿Con quién deseas comunicarte?: ", async (user) => {
              // Pidiendo el mensaje que se desea mandar.
              rl.question("Mensaje: ", async (message) => {
                
                const fullUser = user + "@alumchat.xyz";
                
                // Enviando el mensaje.
                const messageToSend = xml(
                  "message",
                  { type: "chat", to: fullUser }, // Usamos el usuario completo con el dominio
                  xml("body", {}, message),
                );
                await xmpp.send(messageToSend);
                mainMenu(); // Vuelve al menú principal después de completar la opción
              });
            });
            break;
          case "5":
            console.log("Participando en conversaciones grupales...")
            // Lógica para la subopción 5
            mainMenu(); // Vuelve al menú principal después de completar la opción
            break;
          case "6":
            console.log("Definiendo un mensaje de presencia...");
          
            // Pedir el estado de presencia al usuario
            rl.question("Estado de presencia (ejemplo: 'disponible', 'ocupado', 'no disponible'): ", async (presenceState) => {
              // Pedir el mensaje personalizado para el estado de presencia
              rl.question("Mensaje personalizado: ", async (customMessage) => {
                const presence = xml(
                  'presence',
                  {},
                  xml('show', {}, presenceState),
                  xml('status', {}, customMessage)
                );
          
                // Enviar el mensaje de presencia al servidor XMPP
                await xmpp.send(presence);
          
                // Imprimiendo el mensaje de presencia con el usuario y la respuesta del servidor.
                console.log(`Mensaje de presencia enviado a ${username}: ${presence.toString()}`);
                mainMenu(); // Vuelve al menú principal después de completar la opción
              });
            });
            break;          
          case "7":
            console.log("Enviando/recibiendo notificaciones...")
            // Lógica para la subopción 7
            mainMenu(); // Vuelve al menú principal después de completar la opción
            break;
          case "8":
            console.log("Enviando/recibiendo archivos...")
            // Lógica para la subopción 8
            mainMenu(); // Vuelve al menú principal después de completar la opción
            break;
          case "9":
            console.log("Eliminando cuenta...")
            // Lógica para la subopción 9.

            // Escribiendo la stanza para eliminar la cuenta.
            const stanza = xml(
              'iq',
              { type: 'set', id: 'unreg1' },
              xml(
                'query',
                { xmlns: 'jabber:iq:register' },
                xml('remove')
              )
            );

            // Enviando la stanza al servidor XMPP.
            xmpp.send(stanza);
            process.exit();
          default:
            console.log("Opción inválida.")
            mainMenu(); // Vuelve al menú principal en caso de opción inválida
        }
      });
    };
    
    // Iniciando el menú principal
    mainMenu();
    
    // // Sends a chat message to "gon20362@alumchat.xyz"
    // const message = xml(
    //   "message",
    //   { type: "chat", to: "mom20067@alumchat.xyz" },
    //   xml("body", {}, "Hello, this is a message from val20159!"),
    // );

    // // Log the sent message to avoid an infinite loop of receiving it as well
    // //console.log("Sending message:", message.toString());

    // await xmpp.send(message);
  });

  xmpp.start().catch(console.error);
}

function register() {
  cliente.connect(5222, 'alumchat.xyz', function() {
      //console.log('Conectado al servidor XMPP');
      cliente.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
  });


  // Pidiendo al usuario los datos.
  rl.question("Usuario: ", (username) => {
    rl.question("Contraseña: ", (password) => {
      cliente.on('data', function(data) {
          if (data.toString().includes('<stream:features>')) {
              // Enviar consulta de registro
              const xmlRegister = `
              <iq type="set" id="reg_1" mechanism='PLAIN'>
                <query xmlns="jabber:iq:register">
                  <username>${username}</username>
                  <password>${password}</password>
                </query>
              </iq>
              `;
              cliente.write(xmlRegister);
          } else if (data.toString().includes('<iq type="result"')) {
              // Registro exitoso
              console.log('Registro exitoso');
              showMenu();
          } else if (data.toString().includes('<iq type="error"')) {
              // Error al registrar
              console.log('Error al registrar', data.toString());
          }
      });
    });
  });


  cliente.on('close', function() {
      console.log('Conexión cerrada');
  });
}


// Mostrar el menú inicial.
showMenu();