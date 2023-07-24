const { Client } = require('stanza');

// Datos de conexión
const jid = 'val20159@alumchat.xyz';
const password = '1234';
const serverHost = 'alumchat.xyz';
const serverPort = 5222;

// Crear un cliente XMPP
const client = new Client({
  jid: jid,
  password: password,
  host: serverHost,
  port: serverPort,
});

// Manejo de eventos de inicio de sesión
client.on('session:started', () => {
  console.log('Conexión establecida con el servidor XMPP');

  // Obtener el roster
  obtenerRoster();
});

// Manejo de eventos de recepción de mensajes
client.on('iq', (iq) => {
  if (iq.is('iq') && iq.attrs.type === 'result') {
    // Procesar la respuesta del roster (lista de contactos)
    const items = iq.getChild('query').getChildElements('item');
    items.forEach((item) => {
      const jid = item.attrs.jid;
      // Puedes hacer lo que necesites con los datos del contacto (JID, nombre, etc.)
      console.log('Contacto:', jid);
    });
  }
});

// Función para obtener el roster (lista de contactos)
function obtenerRoster() {
  // Construir y enviar la solicitud de roster
  const iq = client.iq({ type: 'get' }).c('query', { xmlns: 'jabber:iq:roster' });
  client.send(iq);
}

// Conectar al servidor XMPP
client.connect();
