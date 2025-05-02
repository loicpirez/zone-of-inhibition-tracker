import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

export default app;