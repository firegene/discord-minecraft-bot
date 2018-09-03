const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const tableSource = new EnmapLevel({name: "Warns"});
const myTable = new Enmap({provider: tableSource});

async function banPlayer(msg, args, command, client) {
  let subject;
  try {
    subject = await msg.guild.fetchMember(args[0])
  } catch (err) {
    msg.channel.send("That user can not be found");
    return;
  }


  let callerHasBanPerms = msg.member.hasPermission('BAN_MEMBERS');
  let subjectIsBannable = subject.bannable;
  let callerHasHigherRank = msg.member.highestRole.comparePositionTo(subject.highestRole) > 0;

  if (!(callerHasBanPerms && subjectIsBannable && callerHasHigherRank)) {
    msg.channel.send("Someone doesn't have enough permissions. :thinking:");
    return
  }
  msg.guild.ban(subject);
  msg.channel.send(`I have banned ${subject.displayName}.`);
}

async function kickPlayer(msg, args, command, client) {
  let subject;
  try {
    subject = await msg.guild.fetchMember(args[0])
  } catch (err) {
    msg.channel.send("That user can not be found.");
    return;
  }

  let callerIsHigherRank = msg.member.highestRole.comparePositionTo(subject.highestRole) > 0;
  let callerHasKickPerms = msg.member.hasPermission('KICK_MEMBERS');
  let subjectIsKickable = subject.kickable;
  if (callerHasKickPerms && callerIsHigherRank && subjectIsKickable) {
    subject.kick();
    msg.channel.send(`I have kicked ${subject.displayName}.`);
  } else {
    msg.channel.send("Someone doesn't have enough permissions .:thinking:");
  }
}

async function warnPlayer(msg, args, command, client) {
  if (msg.mentions.users.first() === undefined) {
    msg.channel.send("Please mention a user to warn them.");
    return;
  }

  let subject = await msg.guild.fetchMember(msg.mentions.users.first());
  let warnContent = args.slice(1).join(" ");
  if (warnContent.length === 0) {
    msg.channel.send("Please insert a reason for the warn.");
    return;
  }

  let callerHasKickPerms = msg.member.hasPermission('KICK_MEMBERS');
  let callerIsHigherRank = msg.member.highestRole.comparePositionTo(subject.highestRole) > 0;
  if (!(callerHasKickPerms && callerIsHigherRank)) {
    msg.channel.send("Someone doesn't have enough permissions. :thinking:");
    return;
  }

  let subjectId = msg.mentions.users.first().id;
  if (!myTable.has(subjectId)) {
    myTable.set(subjectId, [warnContent]);
    msg.channel.send(`<@${subjectId}> has been warned for \`${warnContent}\``)
  } else if (myTable.has(subjectId)) {
    myTable.push(subjectId, warnContent, true);
    msg.channel.send(`<@${subjectId}> has been warned for \`${warnContent}\``)
  }
}

async function showWarns(msg, args, command, client) {
  if (msg.mentions.users.first() === undefined) {
    msg.channel.send("Please mention a user to view their warnings.");
    return;
  }

  if (!msg.member.hasPermission('KICK_MEMBERS')) {
    msg.channel.send("Someone doesn't have enough permissions. :thinking:");
    return;
  }
  let subjectId = msg.mentions.users.first().id;
  if (!myTable.has(subjectId)) {
    msg.channel.send(`<@${subjectId}> doesn't have any warnings. Good job!`);
    return;
  }

  let listWarns = myTable.get(subjectId).reduce((str, el, i) => `${str}**[${i + 1}]** ${el}\n`, '\n');
  msg.channel.send({
    "embed": {
      "description": `<@${subjectId}>'s warnings`,
      "color": 1234643,
      "fields": [
        {
          "name": `${myTable.get(subjectId).length} warnings`,
          "value": listWarns
        }
      ]
    }
  })
}

function removeWarn(msg, args, command, client) {
  let subject = msg.mentions.users.first();
  if (subject === undefined) {
    msg.channel.send("Please mention a user to delete a warning for.");
    return;
  }
  if (!msg.member.hasPermission('KICK_MEMBERS')) {
    msg.channel.send("Someone doesn't have enough permissions. :thinking:");
    return;
  }
  if (!myTable.has(subject.id)) {
    msg.channel.send(`<@${subject.id}> doesn't have any warnings that I can delete. Good job!`);
    return;
  }

  let delWarnArray = myTable.get(subject.id);
  let warnNr;
  for (let arg of args) {
    try {
      let attempt = Number(arg);
      if (!isNaN(attempt)) {
        warnNr = attempt;
        break;
      }
    } catch (e) {
      // Ignore arguments that aren't numbers
    }
  }

  if (warnNr === undefined || warnNr <= 0 || delWarnArray.length < warnNr) {
    msg.channel.send("Please enter a valid warning to delete.");
    return;
  }


  let warnIndex = warnNr - 1;
  let warns = myTable.get(subject.id);
  warns.splice(warnIndex, 1);
  if (0 < warns.length) {
    myTable.set(subject.id, warns, true);

  } else {
    myTable.delete(subject.id)

  }

  msg.channel.send(`I have successfully deleted warning ${warnNr} from <@${subject.id}>`)
}

function removeAllWarns(msg, args, command, client) {
  let subject = msg.mentions.users.first();

  if (subject === undefined) {
    msg.channel.send("Please mention a user to delete all warnings for.");
    return;
  }
  if (!msg.member.hasPermission('KICK_MEMBERS')) {
    msg.channel.send("Someone doesn't have enough permissions. :thinking:");
    return;
  }
  let id = subject.id;
  if (!myTable.has(id)) {
    msg.channel.send(`<@${id}> doesn't have any warnings that I can delete. Good job!`);
    return;
  }

  let warns = myTable.get(id);
  msg.channel.send(`I have successfully deleted all ${warns.length} of <@${id}>'s warnings.`);
  myTable.delete(id)

}

module.exports.kickPlayer = kickPlayer;
module.exports.warnPlayer = warnPlayer;
module.exports.removeWarn = removeWarn;
module.exports.removeAllWarns = removeAllWarns;
module.exports.banPlayer = banPlayer;
module.exports.showWarns = showWarns;