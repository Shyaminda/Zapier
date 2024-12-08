import { Router } from 'express';
import { authMiddleeware } from '../middleware';

const router = Router();

router.post('/', authMiddleeware, (req, res) => {
    console.log("create a zap");
});

router.get('/', authMiddleeware, (req, res) => {
    console.log("zap handler");
});

router.get('/:ZapId', authMiddleeware, (req, res) => {
    console.log("zapId handler");
});

export const zapRouter = router;