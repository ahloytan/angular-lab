'use strict';

import express from 'express';
import supabase from '../util/create-supabase.js';

const router = express.Router();


router.post('/', async (req, res) => {
    try {
      const { senderUserId, receiverUserId, message }  = req.body;
  
      const { data, error } = await supabase
        .from('reminders')
        .insert([{ 
          message, 
          sender_user_id: senderUserId,
          receiver_user_id: receiverUserId
        }])
        .select();
  
      if (error) throw error;
        
      console.info(`Reminder successfully stored in DB. Sender: ${senderUserId}. Receiver: ${receiverUserId}. Message: ${message}`);
      res.json({ success: true, data });
  
    } catch (error) {
      console.error('Error storing reminder in DB:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  })
  
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      const { data, error } = await supabase
          .from('reminders')
          .select('id, message, sender_user_id, created_at')
          .eq('receiver_user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

      if (error) {
          return res.status(400).json({ message: 'Error fetching reminders', error });
      }

      if (!data || data.length === 0) {
          return res.status(200).json({ message: 'No reminders found for this user' });
      }

      res.json(data);

    } catch (error) {
      console.error('Error getting reminders for user:',error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;