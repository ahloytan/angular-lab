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
          "title": "Angular News",
          "body": "Newsletter Available!",
          "badgeCount": 50,
          "icon": "assets/main-page-logo-small-hat.png",
          "vibrate": [100, 50, 100],
          "data": {
              "dateOfArrival": Date.now(),
              "primaryKey": 1,
              "onActionClick": {
                "default": {"operation": "openWindow", "url": "https://ahloytan.netlify.app"}
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
  
      Promise.all(allSubscriptions?.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.json({ success: true, key: allSubscriptions }))
        .catch(err => {
            console.log("ERROR LA", sub);
            deleteSubscriber(sub.uid);
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