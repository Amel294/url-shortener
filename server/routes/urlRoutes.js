import express from 'express';
import urlModel from '../models/urlModel.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Shorten URL
router.post('/shortenUrl', async (req, res) => {
    try {
        console.log(req.body)
        const { originalUrl } = req.body;
        if (!originalUrl) return res.status(400).json({ message: 'Please provide an original URL' });

        // Generate short URL
        const shortUrl = nanoid(6);
        console.log(shortUrl);

        const newUrl = new urlModel({
            originalUrl,
            shortUrl
        });

        await newUrl.save();
        res.status(201).json({ shortUrl });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
});

// Redirect Short URL
router.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlData = await urlModel.findOne({ shortUrl });

        if (!urlData) {
            return res.status(404).json({ message: 'URL not found' });
        }

        urlData.clicks += 1;
        await urlData.save();

        res.redirect(urlData.originalUrl);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
});

export default router;
