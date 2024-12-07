import { PrismaClient } from '@prisma/client';
import express from 'express';


const client = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    await client.$transaction(async tx =>{
        const run = await client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })

        await client.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            }
        })
    })
    res.json({ message: "webhook received" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});