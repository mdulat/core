const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-switch', () => {

	const visualDiff = new VisualDiff('switch', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	beforeEach(async() => await visualDiff.resetFocus(page));

	after(async() => await browser.close());

	describe('ltr', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'off', selector: '#off' },
			{ name: 'off-focus', selector: '#off', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
			{ name: 'off-disabled', selector: '#off-disabled' },
			{ name: 'on', selector: '#on' },
			{ name: 'on-focus', selector: '#on', action: (selector) => page.$eval(selector, (elem) => elem.focus()) },
			{ name: 'on-disabled', selector: '#on-disabled' },
			{ name: 'text-hidden', selector: '#text-hidden' },
			{ name: 'text-start', selector: '#text-start' },
			{ name: 'text-end', selector: '#text-end' },
			{ name: 'toggle on', selector: '#off', action: (selector) => page.$eval(selector, (elem) => elem.on = true) },
			{ name: 'toggle off', selector: '#on', action: (selector) => page.$eval(selector, (elem) => elem.on = false) },
			{ name: 'tooltip', selector: '#tooltip' },
			{ name: 'tooltip-focus', selector: '#tooltip', action: () => page.$eval('#tooltip > d2l-switch', (elem) => elem.focus()) }
		].forEach((info) => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'off', selector: '#off' },
			{ name: 'on', selector: '#on' }
		].forEach(info => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

	});

});
