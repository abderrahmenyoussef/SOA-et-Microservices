require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    setInterval(async () => {
        try {
            await producer.send({
                topic: process.env.KAFKA_TOPIC,
                messages: [
                    { value: 'FRONTEND !' },
                ],
            });
            console.log('Message produit avec succès');
        } catch (err) {
            console.error("Erreur lors de la production de message", err);
        }
    }, 1000);
};

run().catch(console.error);
