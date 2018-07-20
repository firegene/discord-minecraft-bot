const Discord = require("discord.js");
const client = new Discord.Client();
let ms = require("./minestat");
const snekfetch= require('snekfetch'); 
let prefix = ".";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (msg) => {

 const args = msg.content.slice(prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
 
  if (command === "server") {
    ms.init('ip', port, function(result)
{
  console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
  if(ms.online)
  {
    msg.channel.send(`**Server status:** online\n**Server version:** ${ms.version}\n**Players:** ${ms.current_players}/${ms.max_players}\n**Server icon:**`, new Discord.Attachment('https://api.minetools.eu/favicon/198.50.141.83/25565', 'file.jpg'));
  }
  else
  {
    msg.channel.send("Server is offline!");
  }
});
  };

if(command === "phistory") {
  const res = await snekfetch.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
  let id = res.body.id
  const his = await snekfetch.get(`https://api.mojang.com/user/profiles/${id}/names`);
  let map = his.body.map(o => o.name + ' : [' + (o.changedToAt === undefined ? 'CURRENT NAME' : new Date(o.changedToAt).toDateString()) + ']')
  msg.channel.send(map)
    .catch(error => {
    msg.channel.send("The username provided is incorrect.")
  });
};
});

client.login('token');
