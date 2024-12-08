import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = 'zap-events';

const client = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function process() {
    const producer = kafka.producer();
    await producer.connect();

    while (1) {
        const pendingRecords = await client.zapRunOutBox.findMany({
            where:{},
            take: 10
        });

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRecords.map(record => {     //sending bulk messages to kafka
                return {
                    value: JSON.stringify(record.zapRunId)
                }
            })
        });


        await client.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: pendingRecords.map(record => record.id)
                }
            }
        });
    }
}

process();