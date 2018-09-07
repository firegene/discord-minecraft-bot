let BrowserExtensionAPI = require('../lib/browser-extension');
const snekfetch = require('snekfetch');

async function getMCPlayerHistory(msg, args, command, client){
  if (args[0] === undefined) {
    msg.channel.send("Please enter a user to view the name history for.")
    return
  }
  console.log("phistory called with args",msg,args,command)
  const res = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
  let id = res.body.id
  const his = await snekfetch.get(`https://api.mojang.com/user/profiles/${id}/names`);
  let map = his.body.reverse().map(o => o.name + ' : [' + (o.changedToAt === undefined ? 'ORIGINAL NAME' : new Date(o.changedToAt).toDateString()) + ']')
  let newmap = map.join('\n')
  msg.channel.send({
    "embed": {
      "color": 1234643,
      "fields": [
        {
          "name": `${args[0]}'s name history`,
          "value": newmap 
        }
      ]
    }
  });
}

module.exports = getMCPlayerHistory;