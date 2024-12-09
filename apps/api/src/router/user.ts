import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { SignupSchema, LoginSchema } from '@repo/types';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res): Promise<any> => {
    const username = req.body.userName;
    const parsedData = LoginSchema.safeParse(username);

    if (!parsedData.success) {
        return res.status(411).json({ 
            message: "please provide valid data", 
        });
    }

    const user = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password,
        },
    });

    if (!user) {
        return res.status(401).json({ 
            error: "invalid credentials", 
        });
    }

    const token = jwt.sign({
        id: user.id,
        //email: user.email,
        //userName: user.userName
    }, JWT_SECRET);

    res.json({
        token: token,
    });

});

router.post('/signUp', async (req, res): Promise<any> => {
    const username = req.body.userName;
    const parsedData = SignupSchema.safeParse(username);

    if (!parsedData.success) {
        return res.status(411).json({ 
            message: "please provide valid data", 
        });
    }

    const userExists = await prisma.user.findFirst({
        where: {
            email: parsedData.data.email,
        },
    });

    if (userExists) {
        return res.status(409).json({ 
            error: "user already exists", 
        });
    }

    await prisma.user.create({
        data: {
            email: parsedData.data.email,
            password: parsedData.data.password,
            userName: parsedData.data.userName,
        },
    });

    //await sendEmail
    return res.json({
        message: "Please verify your account"
    })
});

router.get('/user', authMiddleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id,
        },
    });

    return res.json({
        user,
    })

});

export const userRouter = router;