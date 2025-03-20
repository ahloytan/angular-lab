'use strict';

import express from 'express';
import supabase from '../util/create-supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select()

        if (error) {
            return res.status(400).json({ message: 'Error fetching news', error });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({ message: 'No news found for this user' });
        }

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/news-cached', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news_duplicate')
            .select()

        if (error) {
            return res.status(400).json({ message: 'Error fetching news', error });
        }

        if (!data || data.length === 0) {
            return res.status(200).json({ message: 'No news found for this user' });
        }

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;