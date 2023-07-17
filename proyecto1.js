const xmpp = require('node-xmpp-client');

const client = new xmpp.Client({
  jid: 'val20159',
  password: '1234',
  host: 'alumchat.xyz',
  port: 5222,
});

client.on('connect', function() {
  console.log('Conectado al servidor XMPP');

});




// client.on('online', function() {
//   console.log('Online');
// });

client.on('error', function(error) {
  console.error('Error:', error);
});

// client.on('reconnect', function() {
//   console.log('Reconectando al servidor XMPP');
// });

// client.connect()
// console.log("Client: ", client);
