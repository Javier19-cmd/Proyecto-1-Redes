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
                console.log('Funcionalidad de registro no implementada aún');
                showMenu();
                break;
            case '3':
                rl.close();
                break;
            default:
                console.log('Opción inválida, por favor intenta de nuevo');
                showMenu();
        }
    });
}

function mostrarMenu(jid) { // Este es el menú que se le enseñará al usuario una vez se haya iniciado sesión.
  console.log("\n---- Menú de opciones ----");
  console.log("1. Enseñar todos los usuarios/contactos y su estado.");
  console.log("2. Agregar un usuario a mis contactos.");
  console.log("3. Comunicación 1 a 1 con cualquier usuario/contacto.");
  console.log("4. Participar en conversaciones grupales.");
  console.log("5. Definir un mensaje de presencia.");
  console.log("6. Enviar/recibir notificaciones.");
  console.log("7. Enviar/recibir archivos.");
  console.log("8. Salir.");

  // Pidiendo la opción al usuario.
  rl.question('¿Qué opción deseas?: ', (answer) => {
    const option = parseInt(answer);

    switch (option) {
      case 1:
        console.log("Opción 1 seleccionada: Enseñar todos los usuarios/contactos y su estado.");
        // Lógica para la opción 1...
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
        mostrarMenu();
        break;
      case 4:
        console.log("Opción 4 seleccionada: Participar en conversaciones grupales.");
        // Lógica para la opción 4...
        mostrarMenu();
        break;
      case 5:
        console.log("Opción 5 seleccionada: Definir un mensaje de presencia.");
        // Pidiendo el mensaje de presencia.
        rl.question("Ingrese el mensaje de presencia: ", (message) => {
          // Enviando el mensaje de presencia.
          const xmlPresence = `
          <presence from="${jid}/pda">
            <show>xa</show>
            <status>${message}</status>
          </presence>
          `;
          // Envío de datos al servidor XMPP
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
        rl.close();
        client.end(); // Cerrar la conexión antes de salir
        break;
      default:
        console.log("Opción no válida. Por favor, elige una opción válida.");
        mostrarMenu();
        break;
    }
  });
}

showMenu();
