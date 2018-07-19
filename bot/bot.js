const Discord = require("discord.js");
const client = new Discord.Client();
let prefix = "."

client.on("ready", () => {
  console.log("Logged in as ${client.user.tag}");
});

client.on("message", (message) => {

 const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
 const command = args.shift().toLowerCase();
 
  if (command === "server") {
    
  }
});

client.login("token");
