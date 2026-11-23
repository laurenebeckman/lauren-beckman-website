import Parser from 'rss-parser';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

const parser = new Parser();

function esc(value = '') {
	return String(value)
		.replace(/&/g, '&')
		.replace(/</g, '<')
		.replace(/>/g, '>')
		.replace(/"/g, '"');
}

export async function GET() {
	const [essays, recipes] = await Promise.all([
		parser.parseURL('https://essayswritten.substack.com/feed'),
		parser.parseURL('https://recipeswritten.substack.com/feed'),
	]);

	const items = [...essays.items, ...recipes.items]
		.filter((item) => item.link && item.title)
		.sort(
			(a, b) =>
				new Date(b.isoDate || b.pubDate || 0).getTime() -
				new Date(a.isoDate || a.pubDate || 0).getTime(),
		);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(SITE_TITLE)}</title>
<description>${esc(SITE_DESCRIPTION)}</description>
<link>https://laurenebeckman.com/</link>
${items
	.map(
		(item) => `<item>
<title>${esc(item.title)}</title>
<link>${esc(item.link)}</link>
<guid>${esc(item.guid || item.link)}</guid>
${item.pubDate ? `<pubDate>${esc(new Date(item.pubDate).toUTCString())}</pubDate>` : ''}
<description>${esc(item.contentSnippet || '')}</description>
</item>`,
	)
	.join('\n')}
</channel>
</rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
	});
}
