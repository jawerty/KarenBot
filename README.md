# KarenBot
A bot that direct messages Twitter customer support accounts with public DMs (i.e. Wendys) and negotiates deals

This was coded on my [Youtube live stream](https://www.youtube.com/watch?v=bcMPlV2g_hA) in sub 5 hours. I tried chaptering it so you can follow 

The bot army part 2 stream is [here](https://www.youtube.com/watch?v=svOgIXxsRj4)

# How it works
The bot runs off of an API coded in [colab](https://colab.research.google.com/drive/1Bh0eZGPMTkZdY8tWSg6vaZmYZyaqJeRM?usp=sharing) that's running flask/ngrok. The API is in front of LLama 2 currently. You can run the colab here. *Remember you have to copy the ngrok url to the karen-bot.js file*

Update this url with the new ngrok url from flask
```
	const apiUrl = "http://6bf4-34-143-150-41.ngrok.io"; // change this line
```
Use the *.ngrok.io link as it shows here
![Screen Shot 2023-09-06 at 10 15 14 PM](https://github.com/jawerty/KarenBot/assets/1999719/6cfed42a-8eba-489f-ad66-cfa467424f5d)

### The Bot
Tbe bot will first initiate a complaint utilizing the company name. Then it will keep rerunning in a time series (1 minute) and checking for any new DMs from the company. Upon seeing a new DM the bot will generate a response to negotiate with the company.

# How to run

### Running the bot
First create a config with your bot info and the company accounts you want to Karen out on
```
{
	"bot_accounts": [
		{ "username": "everydaytechbro" , "password": "********" }
	],
	"company_accounts": ["Wendys", "Walmart"],
	"notification_email": "email@domain.com",
	"proxies": []
}
```

You can run the karen bot army script or the simple karen bot script. The army will simply run the many company accounts in parallel.

Running karen-bot.js directly for one account
```
$ node karen-bot.js <company twitter account>
```


Running karen-bot-army.js to run many in parallel
```
$ node karen-bot-army.js
```

# Running the API (from colab)
You can choose to run the API from the [colab](https://colab.research.google.com/drive/1Bh0eZGPMTkZdY8tWSg6vaZmYZyaqJeRM?usp=sharing) I have available which is a simple Flask app *or* simply download the code from the colab and run it locally if you'd prefer (if you have a quality GPU)

[The Colab Link](https://colab.research.google.com/drive/1Bh0eZGPMTkZdY8tWSg6vaZmYZyaqJeRM?usp=sharing)
