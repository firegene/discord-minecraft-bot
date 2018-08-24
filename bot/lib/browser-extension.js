const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const tableSource = new EnmapLevel({name: "News"});
const myTable = new Enmap({provider: tableSource});

const express = require('express');
var app = express();

var apiKeys = [];

app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.get("/heartbeat", function(request, response){
    response.send(JSON.stringify({
        "APIversion": 1
    }));
});

app.post("/submitPosts", function(request, response){
    console.log("Request came in");
    if(request.body.API_KEY === undefined){
        response.status(401).json({
            code:"MISSING_API_KEY",
            message:"Request does not specify an API_KEY, will not accept data without one"
        });
        return;
    }
    if(request.body.posts === undefined){
        response.status(401).json({
            code:"MISSING_POSTS",
            message:"Request does not contain a list on posts under 'posts'"
        });
        return;
    }

    // TODO: More precise checks
    let key = request.body.API_KEY;
    let valid = apiKeys.includes(key);
    if(!valid){
        response.status(401).json({
            code:"BAD_API_TOKEN",
            message:"The API key provided is invalid or has been revoked"
        });
        return;
    }

    
    let posts = request.body.posts;

    // Important note: enmap-level saves as string, and will only automatically parse arrays and objects
    myTable.set("lastVolunteerKey", key); // string
    myTable.set("posts", posts); // array
    myTable.set("date", new Date().getTime()); // Number, becomes a string

    response.status(200).json(posts);
});

/**
 * Adds an API key, allowing anyone with the key to send in news updates
 * @param val The API key to add
 */
module.exports.addApiKey = (val) => apiKeys.push(val);

/**
 * Revokes a previously added API key, preventing its' user from sending in any news updates
 * @param val The API key to revoke
 */
module.exports.revokeApiKey = (val) => apiKeys = apiKeys.filter(i => i !== val);

/**
 * An express app - if you're not using express, call .listen on this
 * If you're already using express, mount it on a path using yourapp.use('/some/path',thisapp)
 */
module.exports.app = app;

module.exports.getPosts = function(){
    return myTable.get("posts");
};

module.exports.getBlame = function(){
    return myTable.get("lastVolunteerKey");
};
module.exports.getBlameDate = function(){
    // Stored as a number converted to a string
    let value = myTable.get("date");
    let date = new Date(Number(value));
    return date;
};