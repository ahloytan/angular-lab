'use strict';
import express from 'express';
import news from './news.js';
import pushNotification from './push-notification.js';
import reminders from './reminders.js';
import stream from './stream.js';

const router = express.Router();

router.use('/push-notification', pushNotification);
router.use('/reminders', reminders);
router.use('/news', news);
router.use('/open-stream', stream);

export default router;