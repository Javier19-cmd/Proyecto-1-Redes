const net = require('net');
const readline = require('readline');
const client = new net.Socket();
let loggedIn = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function connectToServer(username, password) {
    client.connect(5222, 'alumchat.xyz', function() {
        console.log('Conectado al servidor XMPP');
        client.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
    });

    client.on('data', function(data) {
        //console.log('Recibido: ' + data);
        if (!loggedIn) {
            if (data.toString().includes('<stream:features>')) {
                // Enviar credenciales en base64
                let auth = Buffer.from(`\u0000${username}\u0000${password}`).toString('base64');
                client.write(`<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>${auth}</auth>`);
            } else if (data.toString().includes('<success')) {
                // Inicio de sesión exitoso
                console.log('Inicio de sesión exitoso');
                loggedIn = true;
                // Reiniciar stream
                client.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");

                // Agregándole al usuario el @alumchat.xyz.
              
                // Mostrar menú de opciones
                mostrarMenu(username);
            } else if (data.toString().includes('<failure')) {
                // Error al iniciar sesión
                console.log('Error al iniciar sesión', data.toString());
                loggedIn = false;
            }
        }
    });

    client.on('close', function() {
        console.log('Conexión cerrada');
    });
}


function registerAccount(username, password) {
  client.connect(5222, 'alumchat.xyz', function() {
      console.log('Conectado al servidor XMPP');
      client.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
  });

  client.on('data', function(data) {
      if (data.toString().includes('<stream:features>')) {
          // Enviar consulta de registro
          const xmlRegister = `
          <iq type="set" id="reg_1">
            <query xmlns="jabber:iq:register">
              <username>${username}</username>
              <password>${password}</password>
            </query>
          </iq>
          `;
          client.write(xmlRegister);
      } else if (data.toString().includes('<iq type="result"')) {
          // Registro exitoso
          console.log('Registro exitoso');
      } else if (data.toString().includes('<iq type="error"')) {
          // Error al registrar
          console.log('Error al registrar', data.toString());
      }
  });

  client.on('close', function() {
      console.log('Conexión cerrada');
  });
}



function showMenu() {
  console.log('\nMenú de opciones:');
  console.log('1. Iniciar sesión');
  console.log('2. Registrarse');
  console.log('3. Salir');
  rl.question('\nSelecciona una opción: ', function(option) {
      switch (option) {
          case '1':
              rl.question('\nIngresa tu nombre de usuario: ', function(username) {
                  rl.question('\nIngresa tu contraseña: ', function(password) {
                      connectToServer(username, password);
                  });
              });
              break;
          case '2':
              console.log('Opción 2 seleccionada: Registrarse');
              rl.question('\nIngresa tu nombre de usuario: ', function(username) {
                  rl.question('\nIngresa tu contraseña: ', function(password) {
                      registerAccount(username, password)
                      showMenu()
                  });
              });
              break;
          case '3':
              console.log('Opción 3 seleccionada: Salir');
              rl.close();
              client.end();
              break;
              default:
              console.log('Opción inválida, por favor intenta de nuevo');
              showMenu();
      }
  });
}

function mostrarMenu(jid) {


  console.log("\n---- Menú de opciones ----");
  console.log("1. Enseñar todos los usuarios/contactos y su estado.");
  console.log("2. Agregar un usuario a mis contactos.");
  console.log("3. Mostrar detalles de un contacto");
  console.log("4. Comunicación 1 a 1 con cualquier usuario/contacto.");
  console.log("5. Participar en conversaciones grupales.");
  console.log("6. Definir un mensaje de presencia.");
  console.log("7. Enviar/recibir notificaciones.");
  console.log("8. Enviar/recibir archivos.");
  console.log("9. Eliminar cuenta");
  console.log("10. Salir.");
  
  client.on('data', function(data){
    console.log("Recibido: " + data);
  })
  
  // Pidiendo la opción al usuario.
  rl.question('¿Qué opción deseas?: ', (answer) => {
    const option = parseInt(answer);

    switch (option) {
      case 1:
        console.log("Opción 1 seleccionada: Enseñar todos los usuarios/contactos y su estado.");
        // Enseñando los contactos del usuario.
        // Enviar la consulta de tipo roster
        const xmlRoster = `
        <iq from="${jid}" type="get">
        <query xmlns="jabber:iq:roster"/>
        </iq>
        `;
        client.write(xmlRoster);

        // // Enviar la stanza de tipo presence
        // const xmlPresence = `
        // <presence from="${jid}" to="${jid}" type="probe"/>
        // `;
        // client.write(xmlPresence);
        
        mostrarMenu();
        break;
      case 2:
        console.log("Opción 2 seleccionada: Agregar un usuario a mis contactos.");
        // Lógica para la opción 2...
        mostrarMenu();
        break;
        case 3:
        console.log("Opción 3 seleccionada: Comunicación 1 a 1 con cualquier usuario/contacto.");
        // Lógica para la opción 3...

        // Pidiendo al usuario el

        mostrarMenu();
        break;
      case 4:
        console.log("Opción 4 seleccionada: Participar en conversaciones grupales.");
        rl.question('Ingresa el JID del destinatario: ', function(to) {
          rl.question('Ingresa el contenido del mensaje: ', function(body) {
            // Enviar el mensaje
            const xmlMessage = `
            <message from="${jid}" to="${to}" type="chat">
              <body>${body}</body>
            </message>
            `;
            client.write(xmlMessage);
            mostrarMenu(jid);
          });
        });
        mostrarMenu();
        break;
      case 5:
        console.log("Opción 5 seleccionada: Definir un mensaje de presencia.");
        // Pidiendo el mensaje de presencia.
        rl.question("Ingrese el mensaje de presencia: ", (message) => {

          // Enviar el mensaje de presencia
          const xmlPresence = `
          <presence">
          <show>xa</show>
          <status>${message}</status>
        </presence>
        `;
        
        console.log("Mensaje de presencia: ", xmlPresence)

        client.write(xmlPresence);
        mostrarMenu();
        });
        break;
        case 6:
          console.log("Opción 6 seleccionada: Enviar/recibir notificaciones.");
        // Lógica para la opción 6...
        mostrarMenu();
        break;
      case 7:
        console.log("Opción 7 seleccionada: Enviar/recibir archivos.");
        // Lógica para la opción 7...
        mostrarMenu();
        break;
      case 8:
        console.log("Opción 8 seleccionada: Salir.");
        break;
        
      case 9:

      /* 
      
      user: sam20222
      password: 1234
      
      */

        rl.question('¿Estás seguro de que deseas eliminar tu cuenta? (s/n): ', function(confirm) {
          if (confirm.toLowerCase() === 's') {
            // Enviar la consulta de tipo register con el elemento remove
            const xmlRemove = `
            <iq type="set" id="unreg_1">
              <query xmlns="jabber:iq:register">
                <remove/>
              </query>
            </iq>
            `;
            client.write(xmlRemove);
            showMenu(); // Mostrar el menú original después de eliminar la cuenta
          }
        });
        
        showMenu()
        break
      case 10: 
        console.log("Opción 10 seleccionada: Salir.");
        rl.close()
        client.end()
        break
      default:
        console.log("Opción no válida. Por favor, elige una opción válida.");
        mostrarMenu();
        break;
    }
  });
}

showMenu();
