const WebClient = require('@slack/client').WebClient;
const commandLineArgs = require('command-line-args');
const colors = require('colors');
const fs = require('fs');

const optionDefinitions = [
  { name: 'apiKey', alias: 'a', type: String },
  { name: 'interval', alias: 'i', type: Number }
];

const {apiKey, interval} = commandLineArgs(optionDefinitions);

if(!apiKey) {
  throw 'This script needs a slack api key with the following rights: users:read, reminders:read, reminders.write';
}

if(!interval) {
  console.log(colors.yellow('This script will only run once!'));
} else {
  console.log(colors.yellow(`This script will run every ${interval} seconds`));
}

const web = new WebClient(apiKey);

const saveDeleted = reminder => {
  const deletedJson = require('./logs/deleted.json');
  deletedJson.reminders[reminder.id] = reminder;
  fs.writeFileSync('./logs/deleted.json', JSON.stringify(deletedJson));
};

const saveFailed = reminder => {
  const failedJson = require('./logs/failed.json');
  failedJson.reminders[reminder.id] = reminder;
  fs.writeFileSync('./logs/failed.json', JSON.stringify(failedJson));
};

const saveScammer = user => {
  const scammersJson = require('./logs/scammers.json');
  scammersJson.users[user.id] = user;
  fs.writeFileSync('./logs/scammers.json', JSON.stringify(scammersJson));
};

const deleteAllReminders = function() {
  colors.bold.black('Getting reminders');
  web.reminders.list((err, res) => {
    console.log(colors.green(`Found ${res.reminders.length} reminders`));
    if(res.ok) {
      console.log('---------------');
      res.reminders.forEach(reminder => {
        web.users.info(reminder.creator, (err, res) => {
          if(err) {
            console.log(colors.red('Error fetching user info'), res);
          } else {
            console.log(colors.green(`User with id ${reminder.user} found`));
            // Someone set a reminder for someone else, red flag!
            if (reminder.user !== reminder.creator) {
              console.log(colors.red('Possible scammer found'));
              // Make sure the creator isn't an admin or owner
              if (!(res.user.is_admin || res.user.is_owner)) {
                console.log(colors.red('Scammer found, will now save it and take measures'));
                // Save the scammer's user data
                saveScammer(res.user);
      
                // Log to console
                console.log(colors.underline.red('WARNING USER: [' + res.user.name + '] is a potential scammer!'));
      
                // Call delete api
                web.reminders.delete(reminder.id, function (err, res) {
                  if (res.ok) {
          
                    // delete reminder
                    saveDeleted(reminder);
                    console.log(colors.red('Deleted reminder ' + reminder.id + '\n'));
                  } else {
          
                    // failed deletion
                    saveFailed(reminder);
                    console.log(colors.yellow('Failed to delete reminder ' + reminder.id + '\n'));
                  }
                })
              } else {
                console.log(colors.green('User was an admin/owner\n'));
              }
            } else {
              console.log(colors.green('User was the creator and owner\n'));
            }
          }
        });
      })
    } else {
      console.log(colors.red('Error fetching the list'));
    }
  })
};

if(!interval) deleteAllReminders();
else setInterval(function() { deleteAllReminders() }, interval * 1000);