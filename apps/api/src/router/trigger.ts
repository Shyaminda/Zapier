import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

router.get("/available", async (req, res) => {
    const availableTriggers = await prisma.availableTriggers.findMany({});
    res.json({
        availableTriggers
    });
});

export const triggerRouter = router;