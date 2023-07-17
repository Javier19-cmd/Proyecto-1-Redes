const net = require('net');

// Datos de conexión
const jid = 'val20159';
const password = '1234';
const serverHost = 'alumchat.xyz';
const serverPort = 5222;

// Conexión TCP
const client = net.connect({ host: serverHost, port: serverPort }, () => {
  console.log('Conexión establecida con el servidor XMPP');

  // Envío del inicio de sesión
  const xmlAuth = `<auth xmlns="urn:ietf:params:xml:ns:xmpp-sasl" mechanism="PLAIN">${Buffer.from(`${jid}\x00${jid}\x00${password}`).toString('base64')}</auth>`;
  client.write(xmlAuth);

   // Envío del inicio de la secuencia XML
   const xmlStream = `<?xml version="1.0" encoding="UTF-8"?><stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="${serverHost}" version="1.0">`;
    client.write(xmlStream);
});

// Recepción de datos del servidor XMPP
client.on('data', (data) => {
  console.log('Datos recibidos del servidor XMPP:', data.toString());
  
  // Procesar la respuesta del servidor y realizar otras acciones según sea necesario
});

// Manejo de errores
client.on('error', (error) => {
  console.error('Error en la conexión con el servidor XMPP:', error);
});

// Cierre de la conexión
client.on('end', () => {
  console.log('Conexión cerrada con el servidor XMPP');
});
