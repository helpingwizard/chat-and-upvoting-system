import {server as WebSocketServer, connection} from "websocket"
import http from "http"
import { IncomingMessages, SupportesMessage } from "./messages/incomingMessages";
import { InMemoryStore } from "./inMemoryStore";
import { UserManager } from "./userManager";
import { OutgoingMessages, SupportesMessage1 } from "./messages/outgoingMessages";

const userManager = new UserManager();
const store = new InMemoryStore();

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function messageHandler(ws: connection, message: IncomingMessages) {
    if (message.type == SupportesMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    if (message.type ==  SupportesMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if (!user) {
            console.log("user not found in DB");
            return;  
        }

        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat) {
            return;
        }
        //add broadcast logic here
        const outgoingPayload: OutgoingMessages = {
            type: SupportesMessage1.AddChat,
            payload: {
                chatId: chat.id,
                roomId : payload.roomId,
                message: payload.message,
                name : user.name,
                upvotes: 0   
            }
            
        }
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload)
    }
    if (message.type == SupportesMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upVote(payload.userId, payload.roomId, payload.chatId );
        console.log("inside upvote")
        if(!chat) {
            return;
        }
        console.log("inside upvote 2")
        const outgoingPayload: OutgoingMessages= {
            type: SupportesMessage1.UpdateChat,
            payload: {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upvotes.length
            }
        }
        console.log("inside upvote 3")
        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        // to add rate limiting logic here
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data)); 
            } catch (error: any) {
                
            }
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
})