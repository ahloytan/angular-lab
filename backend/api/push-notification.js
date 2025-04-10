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
        subscription: JSON.stringify(subscriber)
      })
      .select();

    if (error) throw error;
      
    console.info(`Subscription successfully stored in DB. Data: ${data}`);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Error storing subscriber into DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.delete('/delete-subscriber', async (req, res) => {
  try {
    const subscriber  = req.body;

    const { data, error } = await supabase
      .from('notification')
      .delete()
      .eq('id', 1)
      .select();

    if (error) throw error;
      
    console.info(`Subscription successfully deleted in DB. Data: ${data}`);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Error deleting subscriber from DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
})

router.get('/broadcast', async(req, res) => {
    try {
      webpush.setVapidDetails(
        'mailto:aloysius.dmit@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
  
      const notificationPayload = {
        "notification": {
          "title": "Angular News",
          "body": "Newsletter Available!",
          "icon": "assets/main-page-logo-small-hat.png",
          "vibrate": [100, 50, 100],
          "data": {
              "dateOfArrival": Date.now(),
              "primaryKey": 1
          },
          "actions": [{
              "action": "explore",
              "title": "Go to the site"
          }]
        }
      };
  
      const { data, error } = await supabase
      .from('notification')
      .select();

      if (error) throw error;
      const allSubscriptions = data;
  
      Promise.all(allSubscriptions?.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.json({ success: true, key: allSubscriptions.keys.p256dh }))
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

export default router;