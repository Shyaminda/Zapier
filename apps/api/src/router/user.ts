import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { SignupSchema, LoginSchema } from '@repo/types';

const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res): Promise<any> => {
    const body = req.body;
    const parsedData = LoginSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(400).json({ 
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

    res.status(200).json({
        message: "Login successful",
        token: token,
    });

});

router.post('/signUp', async (req, res): Promise<any> => {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.status(400).json({ 
            message: "please provide valid data", 
        });
    }

    // if (!parsedData.success) {
    //     return res.status(400).json({
    //         errors: parsedData.error.errors.map(error => ({
    //             message: error.message
    //         })),
    //     });
    // }

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

router.get('/', authMiddleware, async (req, res): Promise<any> => {
    //@ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id,
        },
    });

    return res.status(200).json({
        user,
    });

});

export const userRouter = router;