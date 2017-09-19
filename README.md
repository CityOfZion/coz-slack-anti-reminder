<p align="center">
  <img 
    src="http://res.cloudinary.com/vidsy/image/upload/v1503160820/CoZ_Icon_DARKBLUE_200x178px_oq0gxm.png" 
    width="125px"
  >
</p>

<h1 align="center">CoZ Slack Anti Reminder</h1>

<p align="center">
  Helps get rid of any reminders in public channels!
</p>

## Description
As many of you know, Slack is one of the major platforms used by ICO to stay in touch with their community.
However the free version of Slack has limited options and can be a danger to users new to the Crypto scene.
Users get scammed every day and 1 such way is through Slack reminders. These will show up looking like an original message and lure users to send their coins.

This scripts helps to prevent that by deleting reminders from the chat in public channels and banning the user.

## Requirements
- NodeJS 7+ https://nodejs.org
- A git command line terminal
- A computer/server to run the script on
- An API key generated on https://api.slack.com/apps
- A bot user, and the Bot Api Token

**Use the following permissions**
<p align="center">
  <img src="https://github.com/CityOfZion/coz-slack-anti-reminder/blob/master/permissions.png">
</p>

## How to install
- Open a terminal/command
- First clone this repo into a directory with `git clone https://github.com/CityOfZion/coz-slack-anti-reminder.git`
- Enter the directory `cd coz-slack-anti-reminder`
- Install packages with `npm install`

## How to use
To run the script you have to be in the directory where it is located.

The script accepts the following parameters:
- `--apiKey` or `-a` for the Slack API
- `--botToken` or `-t` for bot API Token

Example:
`node index --apiKey xoxp-244983222967-240243914928-241034170773-f1fe3b5bd448e86b9914332fe10171b6 --botToken xoxb-241985022151-oxax9EdKmz4BY9xHAkhO1C2R`

<strong>Make sure to invite the bot into your public channels!</strong>

<p align="center">
  <img src="https://github.com/CityOfZion/coz-slack-anti-reminder/blob/master/example-output.png">
</p>
