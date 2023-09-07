const fs = require('fs');
const puppeteer = require('puppeteer');

const { setupBrowser, twitterLogin, gotoTwitterDM, sendTwitterDM, getRandBotAccount } = require('./utils')

async function KarenResponder(apiUrl, twitterAccount, initialDM, cb) {
	const account = getRandBotAccount()

	const [browser, page] = await setupBrowser()
	
	await twitterLogin(page, account)
	
	await page.goto(`https://twitter.com/${twitterAccount}`);

	await gotoTwitterDM(page)
	// read the latest dms and see if the customer support agent has been responded to

	const previousMessages = await page.evaluate(() => {
		const allMessages = Array.from(document.querySelectorAll("[data-testid=\"messageEntry\"]"))
		const previousMessages = []
		for (let i = allMessages.length - 1; i >= 0; i--) {
			const message = allMessages[i];
			console.log(message.getAttribute('role'))
			if (message.getAttribute('role') === "button") {
				break;
			}

			previousMessages.unshift(message.innerText)
		}
		return previousMessages
	})

	console.log("previousMessages", previousMessages)
	let finished = false;
	if (previousMessages.length > 0) {
		// First see if there's an offer
		let response = await fetch(apiUrl + "/accept-offer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"customer_support_message": previousMessages.join("\n\n")
			})
		});
		let result = await response.json()
		if (result['accept'] === "Yes") {
			await browser.close()
			return cb({ finished: true })
		}

		// make request to get initial DM using company
		response = await fetch(apiUrl + "/responder-message", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				"complaint": initialDM,
				"customer_support_message": previousMessages.join("\n\n")
			})
		});
		result = await response.json()
		console.log("response", result['response'])
		await sendTwitterDM(page, result['response'])
	}

	await browser.close()

	cb({ finished });
}

module.exports = KarenResponder