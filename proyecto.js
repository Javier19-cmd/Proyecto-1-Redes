const { client, xml, jid } = require("@xmpp/client");
const debug = require("@xmpp/debug");
const { unsubscribe } = require("diagnostics_channel");
const net = require("net");
const cliente = new net.Socket();
const fetch = require('node-fetch');
const { join } = require("path");
// const muc = require('node-xmpp-muc');

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
        // Cerrando el programa.
        process.exit();
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

  //debug(xmpp, true);

  xmpp.on("error", (err) => {
    console.error(err);
  });

  xmpp.on("online", async (address) => {
    // Makes itself available
    await xmpp.send(xml("presence", { type: "available" }))

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
    
    const mainMenu = () => {

    const MAX_MESSAGE_LENGTH = 50; // Longitud máxima del mensaje a mostrar
      
    const messages = []; // Lista para almacenar todos los mensajes recibidos

    const soliAmi = [] // Lista para guardar las solicitudes de amistad.

    const gChat = [] // Lista para guardar las invitaciones a chats grupales.

    xmpp.on('stanza', (stanza) => {

      // Imprimiendo las stanzas que se reciben.
      //console.log("Stanza recibida: ", stanza)

      // Verificar que sea un mensaje y que el tipo sea 'chat'
      if (stanza.is('message') && stanza.attrs.type === 'chat') {
        const from = stanza.attrs.from;
        const body = stanza.getChildText('body');
        if (body !== null) {
          // Almacenar el mensaje en la lista messages
          messages.push(`${from}: ${body}`);

          // Imprimir el último mensaje recibido inmediatamente después de recibirlo
          printLastMessage();

          // Llamando a la función opciones para que no se pierda el hilo de opciones.
          opciones();
          console.log("¿Qué opción deseas?")
        }
      }

      // Verificando si la stanza es solicitud de amistad.
      if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
        const from = stanza.attrs.from;
        // console.log("From: ", from)
        soliAmi.push(from);
        console.log("Solicitud de amistad recibida de: ", from)
      }

      // Verificando si la stanza es de tipo message el attrs.from tiene el @conference.alumchat.xyz, entonces dar la opción de ingresar o no al chat grupal.
      if (stanza.is('message') && stanza.attrs.from.includes('@conference.alumchat.xyz')) {
        
        const chatG = stanza.attrs.from
        
        console.log(`Invitación para participar en el chat ${chatG}`)

        // Guardando el nombre del chat en la lista.
        gChat.push(chatG)

        // // Preguntando a la persona si quiere entrar o no.
        // rl.question("¿Deseas entrar al chat grupal en este momento? (s/n): ", async (answer) => {
        //   const response = answer.toLowerCase();
        //   if (response === 's') {
            
        //     // Extrayendo el nombre del chat, o sea lo que está antes del @.
        //     const nombreChat = chatG.split('@')[0];
        //     console.log("Nombre chat: ", nombreChat)

        //     // Aceptar la solicitud de suscripción
        //     joinGroupChat(nombreChat, username)
            
        //   } else {
        //     // Rechazar la solicitud de suscripción
        //     await xmpp.send(xml('presence', { to: chatG, type: 'unsubscribed' }));
        //     console.log(`Solicitud de suscripción rechazada de ${chatG}`);
        //     mainMenu()
        //   }
        // })
      }

    });

    // Función para imprimir el último mensaje recibido
    function printLastMessage() {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage !== undefined) {
        if (lastMessage.length > MAX_MESSAGE_LENGTH) {
          const truncatedMessage = lastMessage.substring(0, MAX_MESSAGE_LENGTH) + '...';
          console.log(`Último mensaje recibido: ${truncatedMessage}`);
        } else {
          console.log(`Último mensaje recibido: ${lastMessage}`);
        }
      } else {
        console.log("No se han recibido mensajes.");
      }
    }

    async function unirseASala(nombreSala) {
      const roomJID = jid(`${nombreSala}@conference.alumchat.xyz`);
      try {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
    
        rl.on('line', async (message) => {
          if (message.trim() === 'exit') {
            // Salir del chat al escribir "exit"
            rl.close();
          } else {
            // Enviar el mensaje a la sala
            const messageToSend = xml(
              'message', 
              { type: 'chat', to: roomJID }, 
              xml('body', {}, message)
              );
            await xmpp.send(messageToSend);
          }
        });
    
        // Unirse a la sala
        await xmpp.send(xml('presence', { to: roomJID }));
        console.log(`Te has unido a la sala "${nombreSala}"`);
    
        // Suscribirse a los mensajes del grupo (stanza)
        xmpp.on('stanza', (message) => {
          if (message.is('message') && message.attrs.type === 'chat') {
            const from = message.attrs.from;
            const body = message.getChildText('body');
            if (body) {
              console.log(`${from}: ${body}`);
            }
          }
        });
    
        rl.on('close', () => {
          console.log('Saliendo de la sala...');
          mainMenu(); // Vuelve al menú principal cuando el usuario cierra el programa
        });
    
        console.log("Puedes escribir mensajes para enviar a la sala. Escribe 'exit' para salir.");
      } catch (error) {
        console.error(`Error al unirse a la sala "${nombreSala}":`, error.message);
      }
    }
    
    
    async function crearSala(nombreSala) {
      const roomJID = jid(`${nombreSala}@conference.alumchat.xyz`);
      try {
        await xmpp.send(
          xml('iq', { type: 'set' }, 
            xml('query', { xmlns: 'http://jabber.org/protocol/muc#owner' },
              xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
                xml('field', { var: 'FORM_TYPE' },
                  xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig')
                )
              )
            )
          )
        );
        console.log(`Se ha creado la sala "${nombreSala}" con JID: ${roomJID}`);
        unirseASala(nombreSala);
      } catch (error) {
        console.error(`Error al crear la sala "${nombreSala}":`, error.message);
      }
    }

    
    // Creando el cuarto.
    async function createGroupChat(roomJid, nickname) {
      roomJid = roomJid + "@conference.alumchat.xyz";

      try {
        await xmpp.send(xml('presence', { to: roomJid + '/' + nickname }));
        console.log('Joined group chat:', roomJid);

        // Leyendo lo que el usuario ingrese desde el teclado.
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        rl.on('line', async (message) => {
          if (message.trim() === 'exit') {
            // Salir del chat al escribir "exit"
            mainMenu()
          } else if (message.trim() === 'invitar') {
            rl.question('Ingresa el nombre de la persona a la que deseas invitar: ', async (nombrePersona) => {
              
              // Verificando que el nombre de la persona no sea el mismo que el user del que está invitando.
              if (nombrePersona !== username) {
                //console.log("Nombres no iguales.")
                const jidInvitado = `${nombrePersona}@alumchat.xyz`;
  
                // Enviar una invitación al usuario
                const invite = xml(
                  'message',
                  { to: roomJid },
                  xml(
                    'x',
                    { xmlns: 'http://jabber.org/protocol/muc#user' },
                    xml(
                      'invite',
                      { to: jidInvitado },
                      xml('reason', {}, `Join our group: ${roomJid}`)
                    )
                  )
                );
                await xmpp.send(invite);
              }
              //console.log(`Invitación enviada a ${jidInvitado}`);
            });
          } else {
            // Mandando un mensaje al chat.
            const messageT = xml(
              "message",
              { type: "groupchat", to: roomJid },
              xml("body", {}, message),
            );
            await xmpp.send(messageT).catch((err) => { console.warn(err) });
          }
        });

        xmpp.on('stanza', async (stanza) => {
          if (stanza.is('message') && stanza.getChild('body')) {
            const { from, body } = stanza;
            //console.log('Message received from', from, ':', body);

            // Verificando el tipo del body de la stanza.
            if (stanza.attrs.type === "groupchat") {
              // Obteniendo de quien se mandó el mensaje.
              const from = stanza.attrs.from;
              // Obteniendo el cuerpo del mensaje.
              const body = stanza.getChildText("body");

              // console.log(`${from}: ${body}`);

              // Si el from y el body no están vacíos, entonces se imprime el mensaje.
              if (from && body) {
                console.log(`${from}: ${body}`);
              }
            }
          }
        });

      } catch (error) {
        console.error('Error joining group chat:', error.toString());
      }
    }
    
    async function joinGroupChat(roomJid, nickname) {
      console.log("Room JID: ", roomJid);
    
      roomJid = roomJid + "@conference.alumchat.xyz";
    
      try {
        await xmpp.send(xml('presence', { to: roomJid + '/' + nickname }));
        console.log('Joined group chat:', roomJid);
    
        // Leyendo lo que el usuario ingrese desde el teclado.
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
    
        rl.on('line', async (message) => {
          if (message.trim() === 'exit') {
            // Salir del chat al escribir "exit"
            rl.close();
          } else if (message.trim() === 'invitar') {
            rl.question('Ingresa el nombre de la persona a la que deseas invitar: ', async (nombrePersona) => {
              const jidInvitado = `${nombrePersona}@alumchat.xyz`;
    
              // Enviar una invitación al usuario
              const invite = xml(
                'message',
                { to: roomJid },
                xml(
                  'x',
                  { xmlns: 'http://jabber.org/protocol/muc#user' },
                  xml(
                    'invite',
                    { to: jidInvitado },
                    xml('reason', {}, `Join our group: ${roomJid}`)
                  )
                )
              );
              await xmpp.send(invite);
    
              console.log(`Invitación enviada a ${jidInvitado}`);
            });
          } else {
            // Mandando un mensaje al chat.
            const messageT = xml(
              "message",
              { type: "groupchat", to: roomJid },
              xml("body", {}, message),
            );
            await xmpp.send(messageT).catch((err) => { console.warn(err) });
          }
        });
    
        xmpp.on('stanza', async (stanza) => {
          if (stanza.is('message') && stanza.getChild('body')) {
            const { from, body } = stanza;
            //console.log('Message received from', from, ':', body);
    
            // Verificando el tipo del body de la stanza.
            if (stanza.attrs.type === "groupchat") {
              // Obteniendo de quien se mandó el mensaje.
              const from = stanza.attrs.from;
              // Obteniendo el cuerpo del mensaje.
              const body = stanza.getChildText("body");
    
              // console.log(`${from}: ${body}`);
    
              // Si el from y el body no están vacíos, entonces se imprime el mensaje.
              if (from && body) {
                console.log(`${from}: ${body}`);
              }
            }
          }
        });
    
      } catch (error) {
        console.error('Error joining group chat:', error.toString());
      }
    }
    

    
      // Llamar a la función para imprimir el último mensaje cada 10 segundos
      //setInterval(printLastMessage, 10000); // 5000 ms = 5 segundos
      
      // Función para mostrar el menú de opciones
      const opciones = () => {
        console.log("1. Enseñar todos los usuarios y su estado");
        console.log("2. Agregar un usuario a mis contactos");
        console.log("3. Mostrar detalles de un contacto");
        console.log("4. Comunicación 1 a 1 con cualquier usuario/contacto");
        console.log("5. Participar en conversaciones grupales");
        console.log("6. Definir un mensaje de presencia");
        console.log("7. Enviar notificaciones");
        console.log("8. Enviar/recibir archivos");
        console.log("9. Eliminar cuenta");
        console.log("10. Cerrar sesión");
      };
      
      opciones()

      // // Mostrar el menú de opciones
      // setInterval(opciones, 6500);
      


      rl.question("¿Qué opción deseas?: ", async (answer) => {
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
          
                  // Obtener el estado de presencia del contacto (si está disponible)
                  const presence = xmpp.presences && xmpp.presences[jid];
                  const status = presence && presence.status ? presence.status : 'Offline';

                  console.log(`- JID: ${jid}, Nombre: ${name}, Suscripción: ${subscription}, Estado: ${status}`);
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
            // Creando dos opciones.
            // 1. Agregar un usuario a mis contactos.
            // 2. Aceptar solicitudes.
            console.log("1. Agregar un usuario a mis contactos");
            console.log("2. Aceptar solicitudes");

            rl.question("¿Qué opción deseas?: ", async (answer) => {
              switch (answer) {
                case '1':
                  console.log("Agregando un usuario a mis contactos...");
                  rl.question("JID del usuario que deseas agregar: ", (userJID) => {

                    // Agregando al userJID el @alumchat.xyz
                    userJID = userJID + "@alumchat.xyz"

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
                case '2':
                  console.log("Aceptando solicitudes...");

                  // Revisando si hay solicitudes en la lista de soliAmi.
                  if (soliAmi.length === 0) {
                    console.log("No hay solicitudes de amistad.")
                  } else {
                    console.log("Solicitudes de amistad recibidas: ", soliAmi);
                  
                    // Preguntar al usuario si desea aceptar alguna solicitud
                    rl.question('¿Quieres aceptar alguna solicitud? (s/n): ', async (answer) => {

                      if (answer.toLowerCase() === 's') {
                        rl.question('Ingresa el nombre de la persona a la que deseas aceptar: ', async (nombrePersona) => {
                          const jidAceptado = `${nombrePersona}@alumchat.xyz`;
                          
                          // Buscando la persona en la lista.
                          const solicitud = soliAmi.find((solicitud) => solicitud === jidAceptado);

                          console.log("Solicitud: ", solicitud)
                    
                          if (solicitud) {
                            await xmpp.send(xml('presence', { to: solicitud, type: 'subscribed' }));
                            console.log(`Accepted subscription request from: ${solicitud}`);

                            // Una vez se aceptó a la persona, se quita de la lista de soliAmi.
                            const index = soliAmi.indexOf(solicitud);
                            if (index > -1) {
                              soliAmi.splice(index, 1);
                            }

                          } else {
                            console.log("No se encontró solicitud de amistad para la persona indicada.");
                          }
                      })
                    }});
                  }


                  // Escuchar solicitudes de suscripción (solicitudes de amistad)
                  xmpp.on('stanza', async (stanza) => {
                    const fromJid = stanza.attrs.from;
                    // Verificar que sea una solicitud de suscripción
                    if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
                      // Preguntado si se quiere aceptar o no la solicitud.
                      rl.question(`¿Deseas aceptar la solicitud de ${fromJid}? (s/n): `, async (answer) => {
                        const response = answer.toLowerCase();
                        if (response === 's') {
                          // Aceptar la solicitud de suscripción
                          await xmpp.send(xml('presence', { to: fromJid, type: 'subscribed' }));
                          console.log(`Solicitud de suscripción aceptada de ${fromJid}`);
                          mainMenu()
                        } else {
                          // Rechazar la solicitud de suscripción
                          await xmpp.send(xml('presence', { to: fromJid, type: 'unsubscribed' }));
                          console.log(`Solicitud de suscripción rechazada de ${fromJid}`);
                          mainMenu()
                        }
                      }
                    )};
                  });
                  break;
                default:
                  console.log("Opción inválida.")
                  mainMenu(); // Vuelve al menú principal en caso de opción inválida
              }
            });
            break
          // Mostrar detalles de un contacto
          case "3":
            console.log("Mostrando detalles de un contacto...");
            rl.question("JID del contacto que deseas ver detalles: ", (contactJID) => {
              const newC = contactJID + "@alumchat.xyz";
          
              // Evento para recibir la respuesta del roster del servidor
              xmpp.on('stanza', (stanza) => {
                if (stanza.is('iq') && stanza.attrs.type === 'result') {
                  const query = stanza.getChild('query', 'jabber:iq:roster');
                  const contacts = query.getChildren('item');
          
                  // Buscar el contacto en la lista de contactos (roster)
                  const contact = contacts.find((contact) => contact.attrs.jid === newC);
          
                  if (contact) {
                    console.log(`Detalles del contacto ${contactJID}:`);
                    console.log(`- JID: ${contact.attrs.jid}`);
                    console.log(`- Nombre: ${contact.attrs.name || contact.attrs.jid}`);
                    // Puedes acceder a más detalles del contacto aquí, como el estado de presencia, mensaje personalizado, etc.
                  } else {
                    console.log(`El contacto ${contactJID} no está en tu lista de contactos.`);
                  }
          
                  mainMenu(); // Vuelve al menú principal después de completar la opción
                }
              });
          
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
            });
            break;
            
          case "4":
            console.log("Comunicación 1 a 1 con cualquier usuario/contacto...");
          
            // Función para manejar los mensajes entrantes
            function handleIncomingMessages() {
              xmpp.on('stanza', (stanza) => {
                if (stanza.is('message') && stanza.attrs.type === 'chat') {
                  const from = stanza.attrs.from;
                  const body = stanza.getChildText('body');
                  if (body !== null) {
                    console.log(`${from}: ${body}`);
                  }
                }
              });
            }
          
            rl.question("¿Con quién deseas comunicarte?: ", (user) => {
              const fullUser = user + "@alumchat.xyz";
              handleIncomingMessages(); // Comenzar a escuchar los mensajes entrantes
              // console.log("\n")
              // rl.setPrompt('Tu: ');
              // rl.prompt();
          
              rl.on('line', async (message) => {
                if (message.trim() === 'exit') {
                  // Salir del chat al escribir "exit"
                  rl.close();
                  mainMenu()
                } else {
                  // Enviando el mensaje.
                  const messageToSend = xml(
                    "message",
                    { type: "chat", to: fullUser }, // Usamos el usuario completo con el dominio
                    xml("body", {}, message),
                  );
                  await xmpp.send(messageToSend);
                }
              });
          
              rl.on('close', () => {
                console.log('Chat finalizado.');
                mainMenu(); // Vuelve al menú principal después de completar la opción
              });
            });
            break;
                    
          case "5":
            console.log("Participando en conversaciones grupales...");

            rl.question("¿Deseas unirte a una sala existente o crear una nueva sala? (Unir/Crear): ", (respuesta) => {
              const opcion = respuesta.toLowerCase();
              if (opcion === "unir") {
                rl.question("Ingresa el nombre de la sala a la que deseas unirte: ", (nombreSala) => {

                  console.log("Nombre sala: ", nombreSala)

                  joinGroupChat(nombreSala, username);
                });
              } else if (opcion === "crear") {
                rl.question("Ingresa el nombre de la nueva sala que deseas crear: ", (nombreSala) => {
                  createGroupChat(nombreSala, username);
                });
              } else {
                console.log("Opción no válida. Volviendo al menú principal.");
                mainMenu();
              }
            });


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
            console.log("Enviando/recibiendo archivos...");

            // Función para enviar un archivo a un contacto específico
            async function enviarArchivo(contactJID, filePath) {
              const newC = contactJID + '@alumchat.xyz';

              // Leer el archivo para obtener su nombre y tamaño
              const fileStats = fs.statSync(filePath);
              const fileName = filePath.split('/').pop(); // Obtener el nombre del archivo desde la ruta
              const fileSize = fileStats.size;

              // Crear un enlace de descarga para el archivo
              const fileURL = `http://${xmppDomain}:5222/files/${fileName}`;

              // Crear el elemento de "Out of Band Data" con los metadatos del archivo
              const oobData = xml(
                'x',
                { xmlns: 'jabber:x:oob' },
                xml('url', {}, fileURL),
                xml('desc', {}, `Archivo: ${fileName}, Tamaño: ${fileSize} bytes`)
              );

              // Crear el mensaje con el archivo adjunto
              const message = xml(
                'message',
                { to: newC, type: 'chat' },
                xml('body', {}, `Aquí tienes un archivo para descargar: ${fileURL}`),
                oobData
              );

              // Enviar el mensaje al contacto
              await xmppClient.send(message);
              console.log('Archivo enviado con éxito.');
            }

            // Solicitar información para enviar el archivo
            rl.question('JID del contacto al que deseas enviar el archivo: ', (contactJID) => {
              rl.question('Ruta del archivo que deseas enviar: ', (filePath) => {
                enviarArchivo(contactJID, filePath)
                  .then(() => {
                    mainMenu(); // Vuelve al menú principal después de completar la opción
                  })
                  .catch((err) => {
                    console.error('Error al enviar el archivo:', err);
                    mainMenu(); // Vuelve al menú principal después de completar la opción
                  });
              });
            });
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