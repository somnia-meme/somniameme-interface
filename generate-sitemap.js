import { createWriteStream } from 'fs';
import { SitemapStream } from 'sitemap';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WEBSITE_URL = 'https://somnia.meme';

const sitemap = new SitemapStream({ hostname: WEBSITE_URL });
const writeStream = createWriteStream(`${__dirname}/public/sitemap.xml`);

sitemap.pipe(writeStream);

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/leaderboard', changefreq: 'daily', priority: 0.8 });
sitemap.write({ url: '/profile', changefreq: 'weekly', priority: 0.7 });
sitemap.write({ url: '/launch', changefreq: 'monthly', priority: 0.9 });
sitemap.write({ url: '/roadmap', changefreq: 'monthly', priority: 0.8 });
sitemap.write({ url: '/challenges', changefreq: 'weekly', priority: 0.8 });

sitemap.end();

console.log('Sitemap generated successfully!'); 