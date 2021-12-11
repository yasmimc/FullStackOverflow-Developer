import { Router, Request, Response } from 'express';

const route = Router();

route.get('/health', async (req: Request, res: Response) => {
    res.send('Healthy');
});

export default route;
