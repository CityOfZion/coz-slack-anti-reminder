const WebClient = require('@slack/client').WebClient;
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const commandLineArgs = require('command-line-args');
const colors = require('colors');
const fs = require('fs');

const optionDefinitions = [
  { name: 'apiKey', alias: 'a', type: String },
  { name: 'botToken', alias: 't', type: String }
];

const {apiKey, interval, botToken} = commandLineArgs(optionDefinitions);

const rtm = new RtmClient(botToken);
const web = new WebClient(apiKey);

const saveDeleted = reminder => {
  const deletedJson = JSON.parse(fs.readFileSync('./logs/deleted.json'));
  deletedJson.reminders.push(reminder);
  fs.writeFileSync('./logs/deleted.json', JSON.stringify(deletedJson));
};

const saveFailed = reminder => {
  const failedJson = JSON.parse(fs.readFileSync('./logs/failed.json'));
  failedJson.reminders.push(reminder)
  fs.writeFileSync('./logs/failed.json', JSON.stringify(failedJson));
};

const saveScammer = user => {
  const scammersJson = JSON.parse(fs.readFileSync('./logs/scammers.json'));
  scammersJson.users.push(user);
  fs.writeFileSync('./logs/scammers.json', JSON.stringify(scammersJson));
};

const deleteMessage = (msg, knownScammer) => {
  console.log(colors.red(`Found a ${knownScammer ? 'scammer' : 'reminder'}, removing message from user ${msg.user}`));
  
  web.chat.delete(msg.ts, msg.channel, function (err) {
    if (err) {
      console.log(colors.red(`Failed to delete message ${msg.ts}`));
      saveFailed(msg);
    } else {
      console.log(colors.green(`Deleted message ${msg.ts}`));
      saveDeleted(msg);
    }
  });
};

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  console.log(colors.green('Started the bot'));
});

rtm.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, function(message) {
  const msg = JSON.parse(message);
  
  const scammersJson = JSON.parse(fs.readFileSync('./logs/scammers.json'));
  const knownScammer = scammersJson.users.includes(msg.user);

  if(msg.type === 'message' && (msg.subtype === 'reminder_add' || (/Reminder:/i.test(msg.text) && /eth/i.test(msg.text)) || knownScammer)) {
    if(!knownScammer) {
      console.log(colors.yellow('Found a user not known as a scammer trying to set a reminder'));

      // Check user info
      web.users.info(msg.user, function (err, res) {
        if (!(res.user.is_owner || res.user.is_admin)) {
          console.log(colors.yellow(`User is an unknown scammer, adding to the list`));
          saveScammer(msg.user);
          deleteMessage(msg, knownScammer)
        } else {
          console.log(colors.green('User was an admin, no worries!'))
        }
      });
    } else {
      deleteMessage(msg, knownScammer)
    }
  }
});

rtm.start();