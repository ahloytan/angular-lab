const express = require("express");
const app = express();
const PORT = 3000;
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { SUPABASE_URL, SUPABASE_KEY, FE_ENDPOINT_PROD } = process.env;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.json()); 
app.use(
  cors({
    origin: ['http://localhost:4200', FE_ENDPOINT_PROD],
    credentials: true
  })
);

// SSE endpoint
app.get("/events", (req, res) => {
    const connectorUserId = parseInt(req.query.connectorUserId) || 1;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Content-Encoding', 'none')
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

  const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'reminders'
    }, (payload) => {q

      const eventData = {
        type: 'db-change',
        table: 'reminders',
        operation: payload.eventType,
        data: payload.new
      };
      
      if (connectorUserId === payload.new.receiver_user_id) {
        res.write(`id: ${connectorUserId}\n`);
        res.write(`event: newEvent\n`);
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
        res.write(`data: you have received a message successfully! good\n\n`);
      }
      

    })
    .subscribe((status) => {
      console.log(`Supabase realtime status for client ${connectorUserId}: ${status}`);
      
      if (status === 'CHANNEL_ERROR') res.write(`data: ${JSON.stringify({ type: 'error', message: 'Channel error' })}\n\n`);
    });

    const countdown = setTimeout(() => {
      res.end();
    }, 28000)

    req.on('close', () => {
      console.log(`Client disconnected: ${connectorUserId}`);
      channel.unsubscribe();
      clearInterval(countdown);
    });
});

app.post('/reminders', async (req, res) => {
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

app.get('/reminders/user/:userId', async (req, res) => {
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

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
      message: "BOOM"
  });
});

app.get('/', (req, res) => {
  
  res.status(200).send('ok');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;