'use strict';

const express = require('express');
const router = express.Router();

const { supabase } = require('../util/create-supabase');

router.get("/user/:connectorUserId", (req, res) => {
    const connectorUserId = parseInt(req.params.connectorUserId);
    if (!connectorUserId) {
      console.error("Invalid connector user id!");
      res.end();
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Content-Encoding', 'none')
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // res.write(`event: open\n`);

  const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'reminders'
    }, (payload) => {

      const eventData = {
        type: 'db-change',
        table: 'reminders',
        operation: payload.eventType,
        data: payload.new
      };
      
      if (connectorUserId === payload.new.receiver_user_id) {
        res.write(`id: ${connectorUserId}\n`);
        res.write(`event: newMessageEvent\n`);
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

    res.on('close', () => {
      console.log(`Client disconnected: ${connectorUserId}`);
      channel.unsubscribe();
      clearInterval(countdown);
    });
});

module.exports = router;