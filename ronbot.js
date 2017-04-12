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
let RANDOM; // random channel id
let TESTING;

var users = {}; // maps user ID to info
var lastMessages = []; // stores message text in sequence

web.users.list(function(err, info) {
  if(err) return console.log('Error fetching users:', err);

  info.members.forEach(function(member) {
    users[member.id] = member;
  });
});

//console.log(getChannelEntity('#bot-testing'));

web.channels.list((err, info) => {
  info.channels.forEach((channel) => {
    if(channel.name === 'general') {
      GENERAL = channel.id;
    } 
    if (channel.name === 'random') {
      RANDOM = channel.id;
    }
  });
});


rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.start();

rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function() {
  //rtm.sendMessage("Boo-yah! I'm back from the dead!", RANDOM);
});

var responses = {};
responses[/(hello|hi) ronbot/i] = ""



rtm.on(RTM_CLIENT_EVENTS.RAW_MESSAGE, function handleRtmMessage(message) {
  message = JSON.parse(message);
  
  if(!shouldRespond(message)) {
    return;
  }
  var text = message.text;
  lastMessages.push(message.text);

  if(message.channel == GENERAL) {

  }
  
  if(text.match(/(hello|hey|yo|hi) ronbot/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`hey ${users[message.user].name}`, message.channel);
  } 

  if(text.match(/sup ronbot/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`sup ${users[message.user].name}`, message.channel);
  }

  if(text.match(/booyah/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`BOO-YAH!`, message.channel);
  }

  if(text.match(/favorite food/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`The Naco, where Taco meets Nacho`, message.channel);
  }

  if(text.match(/did it/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`Not too shabby, ${users[message.user].name}`, message.channel);
  }

  if(text.match(/monkey(s?)( ninja)?/i) || text.match(/gorilla(s?)/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`AHHHHHHHHHHHHHH`, message.channel);
  }

  if(text.match(/how's shego/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`green, very green`, message.channel);
  }

  if(text.match(/how's drakken/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`a bit blue`, message.channel);
  }

  if(text.match(/who rocks/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`RUFUS`, message.channel);
  }

  if(text.match(/where's K(im)?( P)?/i)) {
    if(!users[message.user]) return;
    return rtm.sendMessage(`im on a solo mish :sunglasses:`, message.channel);
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