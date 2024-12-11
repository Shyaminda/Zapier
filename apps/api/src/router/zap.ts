import { Router } from 'express';
import { authMiddleware } from '../middleware';
import { ZapCreateSchema } from '@repo/types';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authMiddleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);

    if (!parsedData.success) {
        return res.status(400).json({
            message: "Please provide valid data",
        });
    }

        const zapId = await prisma.$transaction(async tx => {
            const zap = await tx.zap.create({
                data: {
                    userId: id,
                    trigger: {
                        create: {
                            triggerId: parsedData.data.availableTriggerId,
                        }
                    },
                    actions: {
                        create: parsedData.data.actions.map((action, index) => ({
                            actionId: action.availableActionId,
                            sortingOrder: index,
                        })),
                    }
                }
            });
            
            // const trigger = await tx.trigger.create({
            //     data: {
            //         triggerId: parsedData.data.availableTriggerId,
            //         zapId: zap.id,
            //     }
            // });
            // await prisma.zap.update({
            //     where: {
            //         id: zap.id,
            //     },
            //     data: {
            //         triggerId: trigger.id,
            //     }
            // })
            return zap.id;
        });  
    return res.status(200).json({
        zapId,
    }); 
});

router.get('/', authMiddleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            trigger: {
                include: {
                    type: true,
                },
            },
            actions: {
                include: {
                    type: true,
                },
            },
        }
    });
    res.json({
        zaps,
    });
});

router.get('/:ZapId', authMiddleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.ZapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id,
        },
        include: {
            trigger: {
                include: {
                    type: true,
                },
            },
            actions: {
                include: {
                    type: true,
                },
            },
        }
    });
    return res.json({
        zap,
    })
});

export const zapRouter = router;
