function ping(msg, args, command, client) {
  msg.channel.send('Pinging...')
    .then(sent => {
      sent.edit(`:ping_pong: Pong! Took ${sent.createdTimestamp - msg.createdTimestamp}ms`);
    });
}

function leave(msg, args, command, client) {
  let callerHasKickPerms = msg.member.hasPermission('KICK_MEMBERS');
  if (!callerHasKickPerms) {
    msg.channel.send("You can't tell me what to do");
    return;
  }
  let mention = msg.mentions.users.first();
  if (mention === undefined) {
    let botCount = msg.guild.members.filter(user => user.bot).length;
    if (botCount > 1) {
      msg.channel.send("You gotta mention a bot so i know which one uf us has to go");
      return;
    }
    msg.channel.send("Welp, i'm the only bot here so i'm guessing you meant me - see ya later <3");
    msg.channel.guild.leave();
    return;
  }

  let bot_is_mentioned = client.user.id === mention.id;
  if (bot_is_mentioned) {
    msg.channel.send("See ya later <3");
    msg.channel.guild.leave();
    return;
  }
  if (mention.bot) {
    msg.channel.send(`Bye bye ${mention}`);
    return;
  }
  msg.channel.send("That's a regular user - they don't tend to react to commands")


}

module.exports.ping = ping;
module.exports.leave = leave;