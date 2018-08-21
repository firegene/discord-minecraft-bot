const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const tableSource = new EnmapLevel({name: "Names"});
const myTable = new Enmap({provider: tableSource});

function setName(msg, args, command, client){
    let id = msg.author.id;
    let nickName = args[0];
    if (nickName === null) {
        msg.channel.send("Please enter the name you want to set.");
        return;
    }
    myTable.set(id, nickName);
    msg.channel.send(`I have set your name to ${nickName}`)
}

function getName(msg, args, command, client) {
    let subject = msg.mentions.users.first();

    let id = msg.author.id;

    if (myTable.get(id) === null) {
        if (subject === undefined) {
            msg.channel.send("You haven't set your name yet");
        } else {
            msg.channel.send("This user hasn't set their name yet");
        }
        return;
    }

    let name = myTable.get(id);
    let nick = msg.author.username;
    msg.channel.send(`${nick}'s name is ${name}`);
}

module.exports.setName = setName;
module.exports.getName = getName;