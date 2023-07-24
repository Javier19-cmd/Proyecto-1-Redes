var XMPP = require('stanza.io');

var client = XMPP.createClient({
    jid: 'val20159@alumchat.xyz',
    password: '1234',
    transport: 'websocket',
    wsURL: 'wss://alumchat.xyz:5222/xmpp-websocket'
});


// console.log("Client: ", client)

// Usando la propiedad presence para el status del cliente.
client.on('session:started', () => {
    client.getRoster(() => {
        client.sendPresence();
        console.log("Hola")
    })
});

// client.on('session:started', function() {
//     console.log("Session started");
//     client.getRoster();
//     client.sendPresence();
// });

// client.on('chat', function(msg) {
//     client.sendMessage({
//         to: msg.from,
//         body: 'You sent: ' + msg.body
//     });
// });

client.on('error', function(err) {
    console.error("Error occurred:", err);
});

client.connect();
