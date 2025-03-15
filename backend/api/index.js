'use strict';
import express from 'express';
import reminders from './reminders.js';
import stream from './stream.js';

const router = express.Router();

router.use('/reminders', reminders);
router.use('/open-stream', stream);

export default router;