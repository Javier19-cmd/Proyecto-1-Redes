# Proyecto 1: Chat con el protocolo de XMPP

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