const ms = require("../lib/minestat");

function serverStatus(msg, args, command, client) {
    ms.init('198.50.141.83', 25565, function (result) {
        console.log("Minecraft server status of " + ms.address + " on port " + ms.port + ":");
        if (ms.online) {
            msg.channel.send({
                "embed": {
                    "url": "https://discordapp.com",
                    "color": 1234643,
                    "thumbnail": {
                        "url": "https://api.minetools.eu/favicon/198.50.141.83/25565"
                    },
                    "author": {
                        "name": "SwancraftMC",
                        "url": "https://www.swancraftmc.com/"
                    },
                    "fields": [
                        {
                            "name": "Server status",
                            "value": "Online ✓"
                        },
                        {
                            "name": "Server IP",
                            "value": "play.swancraftmc.com"
                        },
                        {
                            "name": "Server version",
                            "value": ms.version
                        }
                    ]
                }
            });
        }
        else {
            msg.channel.send("Server is offline. Please try again later.");
        }
    });
};

function restartTime(msg, args, command, client){
  const now = new Date();
  // A specific restart's time - we can't compare the hours directly because timezones exist
  let next = new Date(1534809600000); 
  if(args[0] !== undefined){
    next = new Date(args[0]);
  }
  // That same time, but yesterday, there must have been a restart, let's set 'next' to be that restart from yesterday
  next.setYear(now.getYear()+1900) // add 1900 because getYear gives us years since UNIX epoch, while getYear expects a full year
  next.setMonth(now.getMonth())
  next.setDate(now.getDate()-1); // Yesterday to make sure the new moment is in the past
  
  let limit = 10;
  // Keep moving forward by 12 hours until we reach a restart that hasn't occured yet
  while (next < now) {
    next.setTime(next.getTime() + 1000 * 60 * 60 * 12);
    limit -= 1;
    if(limit == 0){
      throw "Something's wrong with the restart time calculation!";
    }
  }
  
  let diff = next.getTime() - now.getTime();
  let seconds = (diff / 1000);
  let minutes = seconds / 60;
  let hours = minutes / 60;
  
  seconds = seconds % 60;
  minutes = minutes % 60;
  
  seconds = Math.floor(seconds);
  minutes = Math.floor(minutes);
  hours = Math.floor(hours);

  if(hours > 0){
    msg.channel.send(`The next restart is in ${hours}:${minutes}:${seconds}`);
    return;
  }
  if(minutes > 0){
    msg.channel.send(`The next restart is in ${minutes}:${seconds}`);
    return;
  }
  if(seconds > 0){
    msg.channel.send(`The next restart is in ${seconds} seconds!!!`);
    return;
  }
  throw "Something's wrong with the restart time calculations";
}
module.exports.serverStatus = serverStatus;
module.exports.restartTime = restartTime;