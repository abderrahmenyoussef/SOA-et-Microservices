require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const WebSocket = require('ws');
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

function createGrpcClient() {
    const host = process.env.GRPC_SERVER_HOST || 'localhost';
    const port = process.env.GRPC_SERVER_PORT || '50051';
    return new chatProto.ChatService(
        `${host}:${port}`,
        grpc.credentials.createInsecure()
    );
}

const wsPort = parseInt(process.env.WS_PROXY_PORT || '8080');
const wss = new WebSocket.Server({ port: wsPort });
console.log(`Reverse proxy WebSocket en écoute sur ws://localhost:${wsPort}`);
const http = require('http');
const url = require('url');

// Créer un serveur HTTP pour les requêtes d'historique
const httpServer = http.createServer(async (req, res) => {
    // Enhanced CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // Log all incoming requests for debugging
    console.log(`HTTP Request received: ${req.method} ${req.url}`);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url.startsWith('/history')) {
        const query = url.parse(req.url, true).query;
        const roomId = query.room_id;
        const maxMessages = parseInt(query.max_messages) || 10;
        
        console.log(`Requête d'historique reçue pour room: ${roomId}, max: ${maxMessages}`);
        
        try {
            const grpcClient = createGrpcClient();
            
            grpcClient.getChatHistory({
                room_id: roomId,
                max_messages: maxMessages
            }, (err, response) => {
                if (err) {
                    console.error('Erreur gRPC:', err);
                    res.writeHead(500, { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ error: err.message }));
                    return;
                }
                
                // Log response for debugging
                console.log(`Historique récupéré: ${(response.messages || []).length} messages`);
                
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' 
                });
                
                const messages = response.messages || [];
                // Ensure all messages have timestamps
                const messagesWithTimestamps = messages.map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp || Date.now()
                }));
                
                res.end(JSON.stringify({ messages: messagesWithTimestamps }));
            });
        } catch (error) {
            console.error('Exception in HTTP handler:', error);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }));
        }
    } else {
        // Add a simple status endpoint for testing connectivity
        if (req.url === '/status') {
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ status: 'ok', message: 'Proxy server is running' }));
            return;
        }
        
        res.writeHead(404, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

// Add proper error handling to the HTTP server
httpServer.on('error', (error) => {
    console.error('HTTP Server Error:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${httpPort} is already in use. Try using a different port.`);
    }
});

const httpPort = parseInt(process.env.HTTP_PROXY_PORT || '8081');
httpServer.listen(httpPort, () => {
    console.log(`Serveur HTTP pour historique en écoute sur http://localhost:${httpPort}`);
});
wss.on('connection', (ws) => {
    console.log('Nouveau client WebSocket connecté.');

    const grpcClient = createGrpcClient();
    const grpcStream = grpcClient.Chat();

    grpcStream.on('data', (chatStreamMessage) => {
        console.log('Message reçu du serveur gRPC:', chatStreamMessage);
        ws.send(JSON.stringify(chatStreamMessage));
    });

    grpcStream.on('error', (err) => {
        console.error('Erreur dans le stream gRPC:', err);
        ws.send(JSON.stringify({ error: err.message }));
    });

    grpcStream.on('end', () => {
        console.log('Stream gRPC terminé.');
        ws.close();
    });

    ws.on('message', (message) => {
        console.log('Message reçu du client WebSocket:', message);
        try {
            const parsed = JSON.parse(message);
            grpcStream.write(parsed);
        } catch (err) {
            console.error('Erreur lors de la conversion du message JSON:', err);
            ws.send(JSON.stringify({ error: 'Format JSON invalide' }));
        }
    });

    ws.on('close', () => {
        console.log('Client WebSocket déconnecté, fermeture du stream gRPC.');
        grpcStream.end();
    });
});