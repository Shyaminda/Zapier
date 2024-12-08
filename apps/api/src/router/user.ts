import { Router } from 'express';
import { authMiddleeware } from '../middleware';

const router = Router();

router.post('/login', (req, res) => {
    console.log("login handler");
});

router.post('/signUp', (req, res) => {
    console.log("signUp handler");
});

router.get('/user', authMiddleeware, (req, res) => {
    console.log("user handler");
});

export const userRouter = router;