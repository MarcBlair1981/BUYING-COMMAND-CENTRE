import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let browserInstance = null;

// Ensure browser is open
const getBrowser = async () => {
    if (browserInstance) {
        // Check if it's still connected
        if (browserInstance.isConnected()) {
            return browserInstance;
        }
    }

    console.log('Launching new browser instance...');
    browserInstance = await puppeteer.launch({
        headless: false, // Show the browser UI
        defaultViewport: null, // Utilize full screen
        args: ['--start-maximized'],
        userDataDir: path.join(__dirname, 'user_data') // Save cookies/login sessions
    });

    // Handle closing
    browserInstance.on('disconnected', () => {
        console.log('Browser disconnected.');
        browserInstance = null;
    });

    return browserInstance;
};

app.post('/api/check', async (req, res) => {
    const { url, nickname } = req.body;
    console.log(`[Action] Checking: ${nickname} -> ${url}`);

    try {
        const browser = await getBrowser();
        const pages = await browser.pages();
        // Use existing empty page if available, otherwise new
        const page = pages.length > 0 && pages[0].url() === 'about:blank' ? pages[0] : await browser.newPage();

        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.bringToFront();

        res.json({ success: true, message: `Opened ${nickname}` });
    } catch (error) {
        console.error('Error running check:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Agent Server running at http://localhost:${PORT}`);
    console.log(`   - Ready to handle Active Monitor requests`);
    console.log(`   - Browser session data stored in ./user_data\n`);
});
