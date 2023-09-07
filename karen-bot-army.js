const fs = require("fs");
const spawn = require("child_process").spawn;

const config = JSON.parse(fs.readFileSync('./karen-bot.config.json', 'utf-8'));

function spawnKarenBot(twitterAccount) {
	return new Promise((resolve) => {
		const time = new Date();

		const karenLogFile = `./logs/karen_bot_${twitterAccount.toLowerCase()}.log`;
		
		try {
		    fs.utimesSync(karenLogFile, time, time);
		} catch (e) {
		    let fd = fs.openSync(karenLogFile, 'a');
		    fs.closeSync(fd);
		}

		const child = spawn('node', ['karen-bot.js', twitterAccount, '>', karenLogFile]);
		
		child.stderr.on('data', (data) => {
			console.log(data+"");
		});

		child.on('close', (code) => {
		    // read the file
		    console.log("process closing")
		    const karenLogs = fs.readFileSync(karenLogFile, 'utf-8');
		   	// read the log for the output information about the deal
		   	const madeDeal = true;
		   	resolve({
		   		madeDeal
		   	})	
		});
	})
	
}

async function KarenBotArmy() {
	return await Promise.all(config.company_accounts.map((company) => {
		return spawnKarenBot(company)
	}));
}


KarenBotArmy()