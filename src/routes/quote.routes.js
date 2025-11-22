import express from 'express';
import rateLimit from '../middlewares/rateLimiter.js';
import QUOTES from '../data/quotes.js';

const router = express.Router();

router.get('/', rateLimit, (req, res) => {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    res.json({
        success: true,
        message: 'Quote fetched succuessfully',
        data: quote
    });
})

export default router;