require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'hello.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

function sayHello(call, callback) {
    const { name } = call.request;
    const reply = { message: `Bonjour, ${name} !` };
    callback(null, reply);
}

function main() {
    if (!process.env.PORT) {
        console.error('Le port n\'est pas défini dans le fichier .env');
        process.exit(1);
    }

    const server = new grpc.Server();
    server.addService(helloProto.Greeter.service, {
        SayHello: sayHello
    });
    const port = `0.0.0.0:${process.env.PORT}`;
    server.bindAsync(port, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Serveur gRPC démarré sur ${port}`);
    });
}

main();