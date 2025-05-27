import { send } from 'process';
import webPush from 'web-push';

const generateVAPIDKeys = webPush.generateVAPIDKeys();

const vapidKeys = {
  publicKey: generateVAPIDKeys.publicKey,
  privateKey: generateVAPIDKeys.privateKey,
};

webPush.setVapidDetails(
  'mailto:fbg2468@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendNotification = async (title: string, body: string, image: string): Promise<void> => {

  const subscription = {
    endpoint: '',
    expirationTime: null,
    keys: {
        auth: '',
        p256dh: '',
    },
  };

  const payload = {
    notification: {
        title: 'Title',
        body: 'This is my body',
        icon: 'assets/icons/icon-384x384.png',
        actions: [
            { action: 'bar', title: 'Focus last' },
            { action: 'baz', title: 'Navigate last' },
        ],
        data: {
            onActionClick: {
                default: { operation: 'openWindow' },
                bar: {
                    operation: 'focusLastFocusedOrOpen',
                    url: '/signin',
                },
                baz: {
                    operation: 'navigateLastFocusedOrOpen',
                    url: '/signin',
                },
            },
        },
    },
  };

  const options = {
    vapidDetails: {
        subject: 'mailto:fbg2468@gmail.com',
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey,
    },
    TTL: 60,
  };

  webPush.sendNotification(subscription, JSON.stringify(payload))
  .then((sendResponse) => {
    console.log('Notification sent successfully:', sendResponse);
  })
  .catch(error => {
    console.error('Error sending notification:', error);
  });
};

export { sendNotification };