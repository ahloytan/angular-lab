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
    res.write(`event: OPEN_STREAM_EVENT\n`);
    res.write(`data: success\n\n`);
    res.write(`: this is a comment!!!\n\n`);

  const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'reminders'
    }, (payload) => {

      // const eventData = {
      //   type: 'db-change',
      //   table: 'reminders',
      //   operation: payload.eventType,
      //   data: payload.new
      // };
      
      console.log(payload.new);
      if (connectorUserId === payload.new.receiver_user_id) {
        res.write(`id: ${connectorUserId}\n`);
        res.write(`event: NEW_MESSAGE_EVENT\n`);
        res.write(`data: ${JSON.stringify(payload.new)}\n\n`);
        res.write(`data: you have received a message successfully! good\n\n`);
        // res.write(`data: ${payload.new.message}`);
      }
    })
    .subscribe((status) => {
      console.log(`Supabase realtime status for client ${connectorUserId}: ${status}`);
      
      if (status === 'CHANNEL_ERROR') res.write(`data: ${JSON.stringify({ type: 'error', message: 'Channel error' })}\n\n`);
    });

    //Timeout set to 29s because vercel api timeout limit is at 30s. Ending the request gracefully/prematurely will provide a positive visual feedback
    const countdown = setTimeout(() => {
      res.end();
    }, 29000);

    res.on('close', () => {
      console.log(`Client disconnected: ${connectorUserId}`);
      channel.unsubscribe();
      clearInterval(countdown);
    });
});

module.exports = router;