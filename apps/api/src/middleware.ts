import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from './config';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as unknown as string;
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        // @ts-ignore
        req.id = payload.id
        next();
    } catch (error) {
        res.status(403).json({ 
            message: "unauthorized" 
        });
    }
}