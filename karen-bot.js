const fs = require('fs');

const { program } = require('commander');
const KarenInitiator = require('./karen-initiator');
const KarenResponder = require('./karen-responder');

program
  .argument('<twitter_account>', 'Customer Support Twitter Account');

program.parse(process.argv);

const options = program.args

const twitterAccount = options[0]

async function KarenBot(twitterAccount) {
	const apiUrl = "http://6bf4-34-143-150-41.ngrok.io";

	const initialDM = await KarenInitiator(apiUrl, twitterAccount)
	if (initialDM) {
		const responderCallback = (result) => {
			if (result.finished) {
				if (interval) {
					clearInterval(interval)					
				}

				console.log("Karen has got you a deal [INSERT NOTIFIER HERE]")
				
				process.exit(0)
			}
		}
		const timeSeries = 1000 * 60;
		KarenResponder(apiUrl, twitterAccount, initialDM, responderCallback)
		const interval = setInterval(() => {
			KarenResponder(apiUrl, twitterAccount, initialDM, responderCallback)
		}, timeSeries);
	}
}

KarenBot(twitterAccount);