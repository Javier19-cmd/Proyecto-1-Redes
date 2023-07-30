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

function login(username, password) {
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

    console.log("Inició sesión con este address: ", address)

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

    rl.question("¿Qué opción deseas?: ", (answer) => {
      switch (answer) {
        case "1":
          console.log("Mostrando todos los usuarios y su estado...")
          break;
        case "2":
          console.log("Agregando un usuario a mis contactos...")
          break;
        case "3":
          console.log("Mostrando detalles de un contacto...")
          break;
        case "4":
          console.log("Comunicación 1 a 1 con cualquier usuario/contacto...")

          break;
        case "5":
          console.log("Participando en conversaciones grupales...")
          break;
        case "6":
          console.log("Definiendo un mensaje de presencia...")
          break;
        case "7":
          console.log("Enviando/recibiendo notificaciones...")
          break;
        case "8":
          console.log("Enviando/recibiendo archivos...")
          break;
        case "9":
          console.log("Eliminando cuenta...")
          break;
        default:
          console.log("Opción inválida.")
      }})

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