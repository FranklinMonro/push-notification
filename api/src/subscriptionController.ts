import { Request, Response } from 'express';
import { sendNotification } from './subscriptionService';

export const pushNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, image } = req.body;
    await sendNotification(title, body, image);
    res.status(200).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send notification.' });
  }
};