const { client, xml } = require("@xmpp/client");
const debug = require("@xmpp/debug");

const xmpp = client({
  service: "xmpp://alumchat.xyz:5222",
  domain: "alumchat.xyz",
  username: "val20159",
  password: "1234",
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// debug(xmpp, true);

xmpp.on("error", (err) => {
  console.error(err);
});

xmpp.on("online", async (address) => {
  // Makes itself available
  await xmpp.send(xml("presence"));

  // Sends a chat message to "gon20362@alumchat.xyz"
  const message = xml(
    "message",
    { type: "chat", to: "gon20362@alumchat.xyz" },
    xml("body", {}, "Hello, this is a message from val20159!"),
  );

  // Log the sent message to avoid an infinite loop of receiving it as well
  //console.log("Sending message:", message.toString());

  await xmpp.send(message);
});

xmpp.start().catch(console.error);
