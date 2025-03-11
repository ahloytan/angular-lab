'use strict';

const express = require('express');
const router = express.Router();

const reminders = require('./reminders');
const stream = require('./stream');

router.use('/reminders', reminders);
router.use('/open-stream', stream);

module.exports = router;