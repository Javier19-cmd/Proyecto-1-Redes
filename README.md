# Project 1: Chat with XMPP Protocol

This project consists of a WhatsApp-style chat application that enables 1-to-1 communication with other users as well as group chat functionality. The project utilizes the updated XMPP protocol
of 2023. The development is done using the JavaScript programming language and terminal environment. Notably, the libraries employed for this project include net and @xmpp/client.

# Prerequisites for Project Development Environment

For this project, it's essential to have NodeJS, Git, and an IDE for programming.

Suggestions:

1. Using Visual Studio Code is recommended, as this IDE offers broad compatibility with nearly all programming languages.
2. Installing GitHub Desktop is also recommended to maintain better visual control over commits and project versions.
3. It's highly advisable to install the Gajim interface for development. Gajim provides a client that connects to XMPP servers, which can be used for messaging tests.

# Steps to Start the Project
As a first step, set up a JavaScript environment by executing: npm init.

In the second step, press Enter for all prompts, and preferably, provide the repository link when prompted by init.

The third step is to install the node-xmpp-client library. This is done using the following command: $ npm install node-xmpp.

Following these steps, create a .js file and import the following:
    - const { client, xml, jid } = require("@xmpp/client");
    - const debug = require("@xmpp/debug");

The above imports allow access to the client, xml, and jid for connecting to an XMPP server, and debug for verifying that the connection is error-free.

After this, establish a connection to the XMPP client as follows:

const client = client({
    service: "ws://localhost:5280/xmpp-websocket",
    domain: "localhost",
    resource: "example",
    username: "user1",
    password: "example",
});

In the above code, modify username and password to your preferences, and adjust service and domain as needed.

Important Considerations:
- If you're using a server configured with TCP, replace ws in service with xmpp.
- If you're using a server configured with TLS, use xmpps instead of ws in service.
- The default transport is ws, which is designed for WebSocket.

Additionally, note that the resource might be optional in some cases.

Subsequently, create a function to connect the client to the server. This function can be named connect and is implemented as follows:

async function connect() {
    try {
        await client.start();
        console.log("Connected");
    } catch (error) {
        console.error("Error:", error);
    }
}


Note: The above function is an example. It's possible to implement a login and registration system to enter valid credentials for the connection fields. It's also important to mention that this 
library can be used by reading console inputs or using an interface from any framework.

For using the net library, follow these steps:

1. Import and create a client as follows:
    const net = require("net"); 
    const client = new net.Socket();

2. Establish a connection like this:
    client.connect(5222, 'alumchat.xyz', function() {
        client.write("<stream:stream to='alumchat.xyz' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>");
    });


3. To send information to the server, use the following syntax
    rl.question("User: ", (username) => {
        rl.question("Password: ", (password) => {
            client.on('data', function(data) {
                if (data.toString().includes('<stream:features>')) {
                    const xmlRegister = `
                    <iq type="set" id="reg_1" mechanism='PLAIN'>
                        <query xmlns="jabber:iq:register">
                        <username>${username}</username>
                        <password>${password}</password>
                        </query>
                    </iq>
                    `;
                    client.write(xmlRegister);
                } else if (data.toString().includes('<iq type="result"')) {
                    console.log('Successful registration');
                    showMenu();
                } else if (data.toString().includes('<iq type="error"')) {
                    console.log('Registration error', data.toString());
                }
            });
        });
    });



    client.on('close', function() {
        console.log('Connection closed');
    });


Note: The above code is an example of how to perform user registration.



# Used Functions

The following functions were used for developing this project:

Initial Part:

1. **register():** This function creates a user on the server. It prompts for a username and password. To create a user, the username should be in the format usuario20XXXX, where X's represent the 
               student ID.

2. **login(username, password):** This function asks for a username in the format usuario20XXXX and a corresponding password. Upon verifying the credentials, the person is granted access to the main 
                              program menu.

Main Page:
 
In the main page, these implementations are present:

0. **Receiving Notifications:** This implementation handles friend requests, group chat invitations, and 1-to-1 chat messages

1. **Displaying All Users and Their Status**: This part showcases all contacts the person has on the server, their subscription status (whether they're friends or not), and their online/offline 
                                          status.

2. **Adding a User to Contacts:** In this option, two sub-options allow sending friend requests to other users (by entering the user's ID) and accepting incoming friend requests.

3. **Showing Contact Details:** This option takes the contact's JID to display their information: JID, server email, and subscription status (friend or not).

4. **1-to-1 Communication with Users/Contacts:** This option takes the JID of the user/contact to initiate a private chat. If the person hasn't entered the chat yet, the message is sent as a 
                                             notification.

5. **Participating in Group Chats:** Here, two sub-options are available for entering existing group chats or creating new ones. N people can participate in group chats. This section also allows 
                                 sending invitations to others to join group chats.

6. **Setting Presence Status:** In this option, the person is asked for their current status and the message they want others to see.

7. **Notifications Center:** This option is the person's notification tray, showing incoming messages, group chat invitations, and friend requests.

8. **Sending Files:** Files can be sent in both one-on-one chats and group chats. Additionally, the files are sent in a decoded format and are re-encoded upon reception.

9. **Delete Account:** This option permanently deletes the XMPP account.

10. **Log Out:** This option logs out the user and sets their status to offline on the server.

# Technologies Used

The following technologies were used in this project:

1. NodeJS, providing the JavaScript programming environment.
2. XMPP, supplying the protocol for messaging between individuals through various interfaces.

## Important

If you wish to clone the repository, it is highly important to run the command npm i in order to install all the packages used in the project.

# Author
Javier Sebastián Valle Balsells
Student ID: 20159