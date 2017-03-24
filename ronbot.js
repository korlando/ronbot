var moment = require('moment');
var WebClient = require('@slack/client').WebClient;
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_CLIENT_EVENTS = CLIENT_EVENTS.RTM;

const API_TOKEN = process.env.MIT6813_SLACK_API_TOKEN || '';
const BOT_TOKEN = process.env.RONBOT_API_TOKEN || '';

var web = new WebClient(API_TOKEN);
var rtm = new RtmClient(BOT_TOKEN);

const MESSAGE = 'message';
let GENERAL; // general channel id

var users = {}; // maps user ID to info
var lastMessages = []; // stores message text in sequence

web.users.list(function(err, info) {
  if(err) return console.log('Error fetching users:', err);

  info.members.forEach(function(member) {
    users[member.id] = member;
  });
});

web.channels.list((err, info) => {
  info.channels.forEach((channel) => {
    if(channel.name === 'general') {
      GENERAL = channel.id;
    }
  });
});

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.start();

rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function() {
  //rtm.sendMessage("Testing, 123", GENERAL);
});

rtm.on(RTM_CLIENT_EVENTS.RAW_MESSAGE, function handleRtmMessage(message) {
  message = JSON.parse(message);
  
  if(!shouldRespond(message)) {
    return;
  }
  var text = message.text;
  lastMessages.push(message.text);

  if(message.channel == GENERAL) {

  }
  
  if(text.match(/(hello|hi) ronbot/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`hello ${users[message.user].name}`, message.channel);
  }
});

/**
 * Determine if bot should respond to the message.
 * @param message message to potentially respond to
 * @return true if should respond, false otherwise
 */
function shouldRespond(message) {
  return message.type === MESSAGE && message.text;
}