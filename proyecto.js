const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const { unsubscribe } = require("diagnostics_channel");
const net = require("net");
const cliente = new net.Socket();
const fetch = require('node-fetch');


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
    console.log("10. Cerrar sesión")

    const mainMenu = () => {
      rl.question("¿Qué opción deseas?: ", (answer) => {
        switch (answer) {
          case '1':
            console.log('Mostrando todos los usuarios y su estado...');
          
            // Solicitar el roster al servidor
            const rosterRequest = xml(
              'iq',
              { type: 'get', id: 'roster' },
              xml('query', { xmlns: 'jabber:iq:roster' })
            );
          
            // Enviar la solicitud de roster al servidor
            xmpp.send(rosterRequest).then(() => {
              console.log('Solicitud de roster enviada al servidor.');
            }).catch((err) => {
              console.error('Error al enviar la solicitud de roster:', err);
            });
          
            // Evento para recibir la respuesta del roster del servidor
            xmpp.on('stanza', (stanza) => {
              if (stanza.is('iq') && stanza.attrs.type === 'result') {
                const query = stanza.getChild('query', 'jabber:iq:roster');
                const contacts = query.getChildren('item');
          
                console.log('Lista de contactos:');
                contacts.forEach((contact) => {
                  const jid = contact.attrs.jid;
                  const name = contact.attrs.name || jid;
                  const subscription = contact.attrs.subscription;
          
                  console.log(`- JID: ${jid}, Nombre: ${name}, Suscripción: ${subscription}`);
                });
          
                xmpp.on('presence', (presence) => {
                  const from = presence.attrs.from;
                  const show = presence.getChildText('show');
                  const status = presence.getChildText('status');
          
                  console.log(`Presencia recibida de ${from}: show=${show}, status=${status}`);
                });
                // Evento para recibir las presencias de los contactos
              }
            });
          
            mainMenu();
            break;          
        
          // Agregar un usuario a los contactos
          case "2":
            console.log("Agregando un usuario a mis contactos...");
            rl.question("JID del usuario que deseas agregar: ", (userJID) => {
              // Enviar una solicitud de suscripción al usuario que deseas agregar
              const presence = xml(
                'presence',
                { to: userJID, type: 'subscribe' }
              );

              xmpp.send(presence).then(() => {
                console.log(`Solicitud de suscripción enviada a ${userJID}`);
                mainMenu(); // Vuelve al menú principal después de completar la opción
              }).catch((err) => {
                console.error('Error al enviar la solicitud de suscripción:', err);
                mainMenu(); // Vuelve al menú principal en caso de error
              });
            });
            break;

            // Mostrar detalles de un contacto
          case "3":
            console.log("Mostrando detalles de un contacto...");
            rl.question("JID del contacto que deseas ver detalles: ", (contactJID) => {
              
              const newC = contactJID + "@alumchat.xyz"

              console.log(xmpp.contacts)

              // // Buscar el contacto en la lista de contactos (roster)
              // const contact = xmpp.contacts[newC];

              // console.log("Contacto: ", contact)

              // if (contact) {
              //   console.log(`JID del contacto: ${contact.jid}`);
              //   console.log(`Estado de presencia: ${contact.presence.show}`);
              //   console.log(`Mensaje personalizado: ${contact.presence.status}`);
              // } else {
              //   console.log(`El contacto ${contactJID} no está en tu lista de contactos.`);
              // }

              mainMenu(); // Vuelve al menú principal después de completar la opción
            });
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
          // Enviando/recibiendo notificaciones (mensajes de chat)
          case "7":
            console.log("Enviando/recibiendo notificaciones (mensajes de chat)...");
            rl.question("JID del contacto al que deseas enviar una notificación: ", (contactJID) => {
              rl.question("Mensaje: ", async (message) => {

                const newC = contactJID + "@alumchat.xyz"

                // Crear un mensaje XMPP de tipo "chat" para enviar la notificación
                const chatMessage = xml(
                  "message",
                  { to: newC, type: "chat" },
                  xml("body", {}, message)
                );

                try {
                  // Enviar el mensaje XMPP al contacto
                  await xmpp.send(chatMessage);
                  console.log("Notificación enviada exitosamente.");
                } catch (err) {
                  console.error("Error al enviar la notificación:", err);
                }

                mainMenu(); // Vuelve al menú principal después de enviar la notificación
              });
            });

            // Evento para recibir notificaciones (mensajes de chat)
            xmpp.on("stanza", (stanza) => {
              if (stanza.is("message") && stanza.attrs.type === "chat") {
                const from = stanza.attrs.from;
                const body = stanza.getChildText("body");
                console.log(`Notificación recibida de ${from}: ${body}`);
              }
            });
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
    
          case "10":
          
            console.log("Cerrando sesión...")
            
            xmpp.stop().catch(console.error);
              xmpp.on("offline", () => {
                console.log("offline");
                showMenu()
              });
            break;
          
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