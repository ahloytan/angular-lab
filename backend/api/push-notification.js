'use strict';

import express from 'express';
import supabase from '../util/create-supabase.js';
import dotenv from 'dotenv';
import webpush from 'web-push';
dotenv.config();

const router = express.Router();

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
const vapidKeys = {
    "publicKey": VAPID_PUBLIC_KEY,
    "privateKey": VAPID_PRIVATE_KEY
  };
  
router.post('/', async (req, res) => {
  try {
    const subscriber  = req.body;
    const { data, error } = await supabase
      .from('notification')
      .insert({
        uid: subscriber.keys.p256dh,
        subscription: JSON.stringify(subscriber)
      })
      .select();

    if (error) throw error;
      
    console.info(`Subscription successfully stored in DB. Data: ${JSON.stringify(data)}`);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Error storing subscriber into DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.post('/delete-subscriber', async (req, res) => {
  try {
    const { userId } = req.body;
    let data = deleteSubscriber(userId);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Error deleting subscriber from DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.post('/broadcast', async(req, res) => {
    try {
      const { userId } = req.body;
      webpush.setVapidDetails(
        'mailto:aloysius.dmit@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
  
      const notificationPayload = {
        "notification": {
          "title": "来财 来, 来财 来, 财从八方来, 来财 来",
          "body": "Everyone, get in here!",
          "badgeCount": 50,
          "icon": "assets/main-page-logo-small-hat.png",
          "vibrate": [100, 50, 100],
          "data": {
              "dateOfArrival": Date.now(),
              "primaryKey": 1,
              "onActionClick": {
                "default": {"operation": "openWindow", "url": "https://ng-obs.vercel.app/push-notification"}              
              }
          },
          "actions": [{
              "action": "explore",
              "title": "Go to the site"
          }]
        }
      };
  
      const { data, error } = await supabase
      .from('notification')
      .select()
      // .neq('uid', userId);

      if (error) throw error;
      const allSubscriptions = data?.map((subscription) => JSON.parse(subscription.subscription));
  
      Promise.allSettled(allSubscriptions?.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload))))
        .then((results) => {
          const failed = results.filter(result => result.status === 'rejected');
          const succeeded = results.filter(result => result.status === 'fulfilled');
      
          if (failed.length > 0) {
            console.warn(`${failed.length} notifications failed.`);
            failed.forEach((fail, index) => console.error(`Failure ${index + 1}:`, fail.reason));
          }

          res.json({ success: true, key: allSubscriptions, succeeded: succeeded.length, failed: failed.length })
        })
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
        }
      );
  
    } catch (error) {
      console.error('Error subscribing user to push notification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
})

async function deleteSubscriber(userId) {
  const { data, error } = await supabase
    .from('notification')
    .delete()
    .eq('uid', userId)
    .select();

  if (error) throw error;
    
  console.info(`Subscription successfully deleted in DB. Data: ${JSON.stringify(data)}`);

  return data;
}

export default router;