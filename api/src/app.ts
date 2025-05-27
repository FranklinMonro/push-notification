
import express, { Request, Response } from 'express';
import { 
  generateVAPIDKeys,
  setGCMAPIKey,
} from 'web-push';

const vapidKeys = generateVAPIDKeys();

setGCMAPIKey(vapidKeys.publicKey);
const app = express();

const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Node.js Express API!');
});


app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});


app.get('/api/greet/:name', (req: Request, res: Response) => {
  const name = req.params.name;
  res.json({ message: `Greetings, ${name}!` });
});

app.post('/api/submit', (req: Request, res: Response) => {

  const receivedData = req.body;
  console.log('Received data:', receivedData);
  res.json({ message: 'Data received successfully!', data: receivedData });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server.');
});