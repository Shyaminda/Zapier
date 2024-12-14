import { PrismaClient } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import { Kafka } from 'kafkajs';

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
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString()
            });

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

            console.log(currentAction);
            if(currentAction.type.id === "email"){
                const body =(currentAction.metadata as JsonObject)?.body;  //you have received {comment.amount}
                const to = (currentAction.metadata as JsonObject)?.email;  //{comment.email}
                const zapRunMetadata = zapRunDetails?.metadata;            //{comment: {email: "god@gmail.com"}
            }
            

            if(currentAction.type.id === "email"){
                console.log("Sending email");
            }

            if(currentAction.type.id === "send-sol"){
                console.log("Sending sol");
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            const zapId = message.value?.toString();   
            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1; //1
            if(lastStage !== stage) {    //here stage starts from 0
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