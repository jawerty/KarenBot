const puppeteer = require('puppeteer-extra');
const fs = require('fs');

function timeout(miliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {resolve()}, miliseconds)
  })
}

async function setupBrowser() {
  const viewportHeight = 800;
  const viewportWidth = 1080;
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 
  await page.setViewport({width: viewportWidth, height: viewportHeight});
  
  page.on('console', async (msg) => {
	const msgArgs = msg.args();
	for (let i = 0; i < msgArgs.length; ++i) {
	  try {
		console.log(await msgArgs[i].jsonValue());
	  } catch(e) {
	  	console.log(e);
	  }
    }
  });

  return [browser, page]
}

async function twitterLogin(page, config) {
  await page.goto('https://twitter.com/i/flow/login')

  if (fs.existsSync('./cookies.json')) {
    return await loadCookies(page);
  } 

  await page.waitForSelector("[autocomplete=\"username\"]");
  await page.focus("[autocomplete=\"username\"]")

  await timeout(1000)
  await page.keyboard.type(config.username)
  const buttons = await page.$$("[role=\"button\"]");
  let nextButton;
  for (let button of buttons) {
    const buttonText = await page.evaluate((el) => el.innerText, button)
    if (buttonText.indexOf("Next") > -1) {
      nextButton = button
      break;
    }
  }

  nextButton.click()

  await timeout(2000)

  // press enter
  await page.waitForSelector("[autocomplete=\"current-password\"]");
  await page.keyboard.type(config.password)
  await page.keyboard.press('Enter');
  await timeout(5000)
  
  await page.goto('https://twitter.com')

  const cookies = await page.cookies();
  fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));
  console.log("Logged in and saved cookies");
}

async function loadCookies(page) {
  const cookiesString = fs.readFileSync('./cookies.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);
}

async function gotoTwitterDM(page) {
  await page.waitForSelector('[data-testid="sendDMFromProfile"]')
  const dmButton = await page.$('[data-testid="sendDMFromProfile"]')
  await dmButton.click();
  await timeout(1000);
  await page.waitForSelector('[data-testid="dmComposerTextInput"]')
}

async function sendTwitterDM(page, message) {
  const messageInput = await page.$("[data-testid=\"dmComposerTextInput\"]")
  await messageInput.click()
  await timeout(1000)
  await page.keyboard.type(message, {delay: 50});
  await page.keyboard.press('Enter');
  await timeout(1000)
}

async function getRandBotAccount() {
  const config = JSON.parse(fs.readFileSync('./karen-bot.config.json'))
  return config.company_accounts[Math.floor(Math.random() * config.company_accounts.length)]
}

module.exports = {
  setupBrowser,
  twitterLogin,
  timeout,
  gotoTwitterDM,
  sendTwitterDM,
  getRandBotAccount
}