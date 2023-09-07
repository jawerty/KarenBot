const fs = require('fs');
const puppeteer = require("puppeteer");

const { setupBrowser, twitterLogin, gotoTwitterDM, sendTwitterDM, getRandBotAccount } = require('./utils')

async function KarenInitiator(apiUrl, twitterAccount) {
	const account = getRandBotAccount()
	const [browser, page] = await setupBrowser()
	
	await twitterLogin(page, account)

	await page.goto(`https://twitter.com/${twitterAccount}`);
	await page.waitForSelector("[data-testid=\"UserName\"]")

	const companyName = await page.evaluate(() => {
		return document.querySelector("[data-testid=\"UserName\"] [dir='ltr']").innerText
	});	

	// make request to get initial DM using company
	const response = await fetch(apiUrl + "/initiator-message", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			"company_name": companyName
		})
	});

	const result = await response.json()
	const initialDM = result['complaint'];
	console.log("complaint", initialDM);

	await gotoTwitterDM(page)
	await sendTwitterDM(page, initialDM)
	await browser.close()

	// return customerIssue
	return initialDM
}

module.exports = KarenInitiator