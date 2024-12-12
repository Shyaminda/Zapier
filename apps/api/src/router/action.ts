import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

router.get("/available", async (req, res) => {
    const availableActions = await prisma.availableActions.findMany({});
    res.json({
        availableActions
    });
});

export const actionRouter = router;