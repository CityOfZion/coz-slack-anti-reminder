<p align="center">
  <img 
    src="http://res.cloudinary.com/vidsy/image/upload/v1503160820/CoZ_Icon_DARKBLUE_200x178px_oq0gxm.png" 
    width="125px"
  >
</p>

<h1 align="center">CoZ Slack Anti Reminder</h1>

<p align="center">
  Helps get rid of any reminders!
</p>

## Description
As many of you know, Slack is one of the major platforms used by ICO to stay in touch with their community.
However the free version of Slack has limited options and can be a danger to users new to the Crypto scene.
Users get scammed every day and 1 such way is through Slack reminders. These will show up looking like an original message and lure users to send their coins.

This scripts helps to prevent that by looking through all the reminders and removing those which are suspicious.

## Requirements
- NodeJS 7+ https://nodejs.org
- A git command line terminal
- A computer/server to run the script on
- An API key generated on https://api.slack.com/apps with the following rights: `users:read`, `reminders:read`, `reminders:write`

## How to install
- Open a terminal/command
- First clone this repo into a directory with `git clone https://github.com/CityOfZion/coz-slack-anti-reminder.git`
- Enter the directory `cd coz-slack-anti-reminder`
- Install packages with `npm install`

## How to use
To run the script you have to be in the directory where it is located.

The script accepts the following parameters:
- `--apiKey` or `-a` for the Slack API
- `--interval` or `-i` for the interval at which to run the script in seconds

Example:
- run once: `node index --apiKey Akhds923lkhHdL62139Dhad70Hdakhda`
- 1 hour interval: `node index --apiKey Akhds923lkhHdL62139Dhad70Hdakhda --interval 3600`
- 12 hour interval: `node index --apiKey Akhds923lkhHdL62139Dhad70Hdakhda --interval 43200`

<p align="center">
  <img src="https://github.com/CityOfZion/coz-slack-anti-reminder/blob/master/example-output.png">
</p>
