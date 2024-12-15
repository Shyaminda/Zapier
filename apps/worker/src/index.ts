import { PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import { Kafka } from 'kafkajs';
import { parse } from './parser';
import dotenv from 'dotenv';
import { sendEmail } from './email';
import { sendSol } from './solana';
dotenv.config();

const prisma = new PrismaClient();
const TOPIC_NAME = 'zap-events';

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});

async function process() {
    const consumer = kafka.consumer({groupId: "main-worker"});
    await consumer.connect();

    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({topic: TOPIC_NAME, fromBeginning: true});

    await consumer.run({
        autoCommit: false,  
        eachMessage: async ({topic, partition, message}) => {
            // console.log({
            //     partition,
            //     offset: message.offset,
            //     value: message.value?.toString()
            // });

            if(!message.value?.toString()){
                return;
            }

            const parsedValue = JSON.parse(message.value?.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;    // The current stage

            const zapRunDetails = await prisma.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {        //for the zapRun find the associated zap
                        include: {
                            actions: {   //for that zap find the associated actions
                                include: {
                                    type: true    //for that action find the associated type
                                }
                            }
                        }
                    }
                }
            })

            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

            if(!currentAction){
                console.log("No action found for the given stage");
                return;
            }

            //console.log(currentAction);

            const zapRunMetadata = zapRunDetails?.metadata;            //{comment: {email: "god@gmail.com"}

            if(currentAction.type.id === "email"){
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata)  //you have received {comment.amount}
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata)  //{comment.email}
                console.log(`sending out email to ${to} with body ${body}`);
                await sendEmail(to, body);
            }

            if(currentAction.type.id === "send-sol"){
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata)  //you have received {comment.amount}
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata)  //{comment.email}
                console.log(`sending out solana to ${address} of amount ${amount}`);
                //await sendSol(address, amount);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            const zapId = message.value?.toString();   
            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1; //1
            if(lastStage !== stage) {    //here stage starts from 0
                //console.log("pushing back to the queue");
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,    // Incremented stage
                            zapRunId, 
                        })
                    }]
                });
            }
            console.log("processing done");
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()    //5
            }]) 
        }
    })
}

process();