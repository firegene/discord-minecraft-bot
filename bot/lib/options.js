var namespaces = {};

var filters = {
    'boolean': (val) => {if(typeof val !== 'boolean') throw 'Value must be boolean'; return val},
    'number':  (val) => {if(typeof val !== 'number') throw 'Value must be a number'; return val},
    'string':  (val) => {if(typeof val !== 'string') throw 'Value must be a string'; return val},
};

function getOptionsManager(namespace){
    if(namespaces[namespace] !== undefined){
        return namespaces[namespace];
    }
    var options = {};
    let closure = {
        define: (name, type, value) => {
            let filter = filters[type];
            filter(value); // Test if valid
            options[name.toLowerCase()] = {type: type, val:value, filters:[]};
        },

        addFilter: (name, check, errorMessage) => options[name].filters.push((val) => {
            if(!check){
                throw errorMessage;
            }
        }),

        set: (name, val) => {
            name = name.toLowerCase();
            if(options[name] === undefined){
                throw "Option must be defined first";
            }
            filters[options[name].type](val); // Check type
            for(let check of options[name].filters){
                check(val); // Check custom filters
            }
            options[name].val = val;
        },

        get: (name) => options[name.toLowerCase()].val,
        type: (name) => options[name.toLowerCase()].type,

        list: () => Object.keys(options)
    };
    namespaces[namespace] = closure;
    return closure
}

module.exports = getOptionsManager;
module.exports.all = () => Object.keys(namespaces);

// Create an express app if express is installed
try {
    const express = require('express');
    let app = new express();
    app.use(express.json());

    function sendError(error, response){
        response.status(500);
        response.contentType("text/plain");
        response.send(error.toString());
        response.end();
        return true;
    }
    app.put('/:namespace/:option', (req, res) => {
        let newval = req.body.value;
        let optionName = req.params.option;
        let options = getOptionsManager(req.params.namespace);
        try{
            options.set(optionName, newval);
        } catch (e) {
            return sendError(e, res);
        }
        res.contentType("application/json");
        res.send(200, options.get(optionName));
    });
    app.get('/:namespace/:option', (req, res) => {
        res.contentType("application/json");
        res.send(getOptionsManager(req.params.namespace).get(req.params.option));
    });
    app.get('/', (req, res) => {
        let object = {};
        for(let ns of module.exports.all()){
            object[ns] = {};
            for(let cmd of getOptionsManager(ns).list()){
                object[ns][cmd] = {value: getOptionsManager(ns).get(cmd), type: getOptionsManager(ns).type(cmd)};
            }
        }
        res.contentType("application/json");
        res.send(object);
    });
    module.exports.express = app;
} catch(e) {
    module.exports.express = "express is not installed";
}
