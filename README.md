# Proyecto 1: Chat con el protocolo de XMPP

El presente proyecto consiste en un chat tipo WhatsApp, en el cual se puede hacer la comunicación 1 a 1 con otros usuarios o bien en chat grupal. Este proyecto utiliza el proctocolo XMPP más 
actualizado de 2023. Asimismo, para el desarrollo del presente proyecto se utilizó la terminal y el lenguaje de programación javascript. Es importante mencionar que las librerías utilizadas para 
el desarrollo del presente proyecto fueron: net y @xmpp/client.

# Requisitos para el entorno de desarrollo del proyecto

Para este proyecto, lo principal es tener instalado NodeJS, Git y un IDE para programar.

Sugerencias: 

1. Se recomienda utilizar Visual Studio Code, dado que este IDE presenta una gran amplitud de compatiblidad con casi todos o todos los lenguajes de programación.
2. Se recomienda también tener instalado GitHub Desktop para poder llevar un mejor control visual de los commits y las versiones del proyecto. 
3. Es altamente recomendable, que para el desarrollo de este proyecto, se tenga instalado la intefaz de Gajim, dado que esta interfaz provee un cliente el cual se conecta a servidores XMPP.
   Con este cliente también se podría realizar ciertas pruebas de mensajería.

# Pasos a seguir para comenzar el proyecto
Como primer paso, se debe crear un ambiente de javascript de la siguiente manera: npm init.

El segundo paso es dar enter a todo lo que se pregunta y, de preferencia, se debe colocar el link al repositorio cuando lo pregunte el init.

El tercer paso es instalar la librería node-xmpp-client, que se hace de la siguiente forma: npm install node-xmpp.

Luego de hacer los pasos anteriores, se debe crear un archivo con extensión js e importar de la siguiente forma: 
    - const { client, xml, jid } = require("@xmpp/client");
    - const debug = require("@xmpp/debug");

Los dos anteriores imports nos permiten el client, xml y jid para conectarnos a un servidor xmpp y el debug para poder verificar que la conexión no nos esté dando mensajes de error.

Luego de esto, se debe crear una conexión al cliente xmpp de la siguiente manera: 

const client = client({
    service: "ws://localhost:5280/xmpp-websocket",
    domain: "localhost",
    resource: "example",
    username: "user1",
    password: "example",
});

En el anterior código, se debe cambiar el username y el password por los que se deseen utilizar. Además, se debe cambiar el service y el domain por los que se deseen utilizar.

Es importante tener en cuenta lo siguiente: 
- Si se tiene un servidor configurado con TCP, entonces se debe cambiar el ws del service por xmpp.
- Si se tiene un servidor configurado coom TLS, entonces se debe usar xmpps en vez de ws en el service.
- El transport default es ws y está dirigido para WebSocket.

Por otro lado, es importante mencionar que el resource puede llegar a ser opcional en algunos casos. 

Luego de esto, se debe crear una función que se encargue de conectar el cliente al servidor. Esta función se debe llamar connect y se debe hacer de la siguiente manera:

async function connect() {
    try {
        await client.start();
        console.log("Connected");
    } catch (error) {
        console.error("Error:", error);
    }
}

Nota: La anterior función es de ejemplo, es posible que se implemente un sistema de login y registro para poder meter credenciales válidas a los campos de la conexión.
También es importante mencionar que esta librería se puede usar leyendo los inputs de la consola o usando una interfaz de cualquier framework.

Para utilizar la librería net, se debe hacer lo siguiente: 

1. Importar y crear un cliente de la siguiente manera: 
    const net = require("net"); 
    const cliente = new net.Socket();

2. Crear una conexión como la siguiente: 
    cliente.connect(5222, 'alumchat.xyz', function() {
      //console.log('Conectado al servidor XMPP');
      cliente.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
    });

3. Para mandar información al servidor, se puede seguir la siguiente sintaxis: 
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

Importante: El anterior código es un ejemplo de como realizar un registro de usuario.



# Funciones utilizadas 

Para el desarrollo del presente proyecto, se utilizaron las siguientes funciones:

Parte de inicio:

1. register(): Esta función sirve para crear un usuario en el servidor. Para ello, el método solicita un nombre de usuario y una contraseña. Es importante mencionar que para crear un usuario 
               en el servidor, se debe crear de la siguiente manera: usuario20XXXX, en donde las X's pertencen al número de carnet perteneciente al usuario.

2. login(username, password): Esta función solicita un usuario de la forma usuario20XXXX y una contraseña asociada al usuario. Luego de esto, se manda a verificar el usuario y la contraseña y 
                              de ser correcto, se le permite a la persona ingresar el menú principal del programa en cuestión.

Página principal: 
 
En la página principal se tienen estas implementaciones: 

0. Recibir notificaciones: Esta implementación está hecha directamente en la página principal y aquí entran solicitudes de amistad, invitaciones a chats grupales y mensajes de chats 1 a 1.

1. Enseñar todos los usuarios y su estado: En esta parte, se enseñan todos los contactos que la persona tiene en el servidor, la suscripción que tiene (si son o no amigos) y el estatus de las 
                                           personas (esto quiere decir que si están online o no).

2. Agregar un usuario a los contactos: En esta opción, existen dos subopciones en las cuales se pueden mandar solicitudes de amistad a otros usuarios del servidor (para esto se tiene que escribir el id del usuario)
                                       y la segunda opción es aceptar solicitudes de amistad entrantes.

3. Mostrar detalles de un contacto: Acá lo que se hace es ingresar el jid del contacto al cual se quiera ver su información y el servidor lo que hace es devolver el JID del contacto, su correo dentro del servidor 
                                    y la suscripción (si son o no amigos dentro del servidor).

4. Comunicación 1 a 1 con cualquier usuario/contacto: Para esta opción lo que se hace es ingresar el JID del usuario/contacto de la persona con la que se desea chatear y luego se procede a "abrir" un chat privado 
                                                      entre uno mismo y el contacto. Es importante mencionar que si la persona aún no ha entrado al chat, entonces se procede a enviar el mensaje como notificación.

5. Participar en chats grupales: Aquí existen dos subopciones, en donde se puede entrar a un chat grupal existente o crear uno nuevo. Aquí pueden entrar N personas a los chats grupales. En esta parte se puede enviar invitación a otras 
                                 personas para que entren al chat grupal.

6. Definir un estado de presencia: Para esta opción, lo que se hace es solicitarle a la persona su status actual y el mensaje que desea poner para que los demás contactos lo puedan ver.

7. Centro de notificaciones: En esta opción es la bandeja de notificaciones de la persona y aquí se pueden ver mensajes entrantes, invitaciones a chats grupales y/o ver solicitudes de amistad.

8. Enviar archivos: En esta opción se pueden enviar archivos a las personas que se deseen. Los archivos pueden ser del tipo que se desea. Es importante destacar que los archivos que se mandan, son subidos directamente al servidor.

9. Eliminar cuenta: En esta opción se puede eliminar permanentemente la cuenta del servidor XMPP.

10. Cerrar sesión: Esta opción funciona para poder salir del programa y definir el status offline en el servidor.

# Tecnologías utilizadas

Las tecnologías utilizadas en el presente proyecto fueron las siguientes: 

1. NodeJS, el cual nos provee el entorno de programación de javascript.
2. XMPP, que nos provee todo el protocolo para la mensajería entre personas mediante cualquier interfaz.