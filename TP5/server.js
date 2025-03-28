require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'chat.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

const admin = {
    id: process.env.ADMIN_ID || 'admin',
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    status: process.env.ADMIN_STATUS || 'ACTIVE',
};
const messageHistory = new Map();

function getUser(call, callback) {
    const userId = call.request.user_id;
    console.log(`Requête GetUser reçue pour id: ${userId}`);
    const user = { ...admin, id: userId };
    callback(null, { user });
}

function chat(call) {
    console.log("Flux Chat démarré.");
    call.on('data', (chatStreamMessage) => {
        if (chatStreamMessage.chat_message) {
            const msg = chatStreamMessage.chat_message;
            console.log(`Message reçu de ${msg.sender_id}: ${msg.content}`);
            
            // Ajouter un timestamp s'il n'existe pas déjà
            if (!msg.timestamp) {
                msg.timestamp = Date.now();
            }
            
            // Stocker le message dans l'historique
            if (!messageHistory.has(msg.room_id)) {
                messageHistory.set(msg.room_id, []);
            }
            messageHistory.get(msg.room_id).push(msg);
            
            // Limiter l'historique à 100 messages par room
            if (messageHistory.get(msg.room_id).length > 100) {
                messageHistory.get(msg.room_id).shift();
            }

            const reply = {
                id: msg.id + ".reply",
                room_id: msg.room_id,
                sender_id: admin.name,
                content: `Bonjour ${msg.sender_id}, votre message a été reçu !`,
                timestamp: Date.now() // Ajouter un timestamp à la réponse
            };
            call.write({ chat_message: reply });
        }
    });

    call.on('end', () => {
        console.log("Fin du flux Chat.");
        call.end();
    });
}

function getChatHistory(call, callback) {
    const { room_id, max_messages } = call.request;
    console.log(`Requête d'historique reçue pour room: ${room_id}, max: ${max_messages}`);

    const messages = messageHistory.get(room_id) || [];
    
    // Assurer que tous les messages ont un timestamp
    const messagesWithTimestamps = messages.map(msg => {
        return {
            ...msg,
            timestamp: msg.timestamp || Date.now()
        };
    });
    
    const result = messagesWithTimestamps.slice(-Math.abs(max_messages)); // Prend les N derniers

    callback(null, { messages: result });
}

function main() {
    const server = new grpc.Server();
    server.addService(chatProto.ChatService.service, {
        GetUser: getUser,
        Chat: chat,
        GetChatHistory: getChatHistory,
    });
    const port = process.env.GRPC_SERVER_PORT || '50051';
    const address = `0.0.0.0:${port}`;
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (error, bindPort) => {
        if (error) {
            console.error("Erreur lors du binding du serveur :", error);
            return;
        }
        console.log(`Serveur gRPC en écoute sur ${address}`);
        server.start();
    });
}

main();