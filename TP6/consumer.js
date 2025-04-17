require('dotenv').config();
const Message = require('./db'); 
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log({ value });
  
      try {
        const newMessage = new Message({ value });
        await newMessage.save();
        console.log("Message enregistré dans MongoDB");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement MongoDB :", error);
      }
    },
  });
}; 

run().catch(console.error);