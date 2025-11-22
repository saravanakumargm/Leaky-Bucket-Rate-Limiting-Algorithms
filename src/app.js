import express from 'express';
import quoteRoutes from './routes/quote.routes.js';

const app = express();

app.use(express.json());
app.use('/', quoteRoutes);

export default app;