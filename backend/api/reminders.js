'use strict';

const express = require('express');
const router = express.Router();

const { supabase } = require('../util/create-supabase');

router.post('/', async (req, res) => {
    try {
      const { senderUserId, receiverUserId, message }  = req.body;
  
      const { data, error } = await supabase
        .from('reminders')
        .insert([{ 
          message, 
          sender_user_id: senderUserId,
          receiver_user_id: receiverUserId,
          created_at: new Date()
        }]);
  
      if (error) throw error;
  
      res.json({ success: true, data });
  
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  })
  
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const { data, error } = await supabase
            .from('reminders')
            .select('id, message, sender_user_id, created_at')
            .eq('receiver_user_id', userId);

        if (error) {
            return res.status(400).json({ message: 'Error fetching reminders', error });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({ message: 'No reminders found for this user' });
        }

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;