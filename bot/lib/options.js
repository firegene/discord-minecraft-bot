const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const tableSource = new EnmapLevel({name: "Options"});
const myTable = new Enmap({provider: tableSource});
let isReady = myTable.fetchEverything(); // Extremely important, three hours were wasted on this

var namespaces = {};

var filters = {
  'boolean': (val) => {
    if (typeof val !== 'boolean') throw 'Value must be boolean';
    return val
  },
  'number': (val) => {
    if (typeof val !== 'number') throw 'Value must be a number';
    return val
  },
  'string': (val) => {
    if (typeof val !== 'string') throw 'Value must be a string';
    return val
  },
};

function getOptionsManager(namespace) {
  if (namespaces[namespace] !== undefined) {
    return namespaces[namespace];
  }
  var options = {};
  let closure = {
    define: async (name, type, value) => {
      await isReady; // Extremely important
      name = name.toLowerCase();
      let filter = filters[type];
      filter(value); // Test if valid

      if (!myTable.has(namespace)) {
        myTable.set(namespace, {});
      }

      if (!myTable.hasProp(namespace, name)) {
        myTable.setProp(namespace, name, value);
      }

      options[name] = {type: type, filters: []};
    },

    addFilter: (name, check, errorMessage) => options[name.toLowerCase()].filters.push((val) => {
      if (!check(val)) {
        throw errorMessage;
      }
    }),

    set: (name, val) => {
      name = name.toLowerCase();
      if (options[name] === undefined) {
        throw "Option must be defined first";
      }
      filters[options[name].type](val); // Check type
      for (let check of options[name].filters) {
        check(val); // Check custom filters
      }
      myTable.setProp(namespace, name, val);
    },

    get: (name) => myTable.getProp(namespace, name.toLowerCase()),
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

  function sendError(error, response) {
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
    try {
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
    for (let ns of module.exports.all()) {
      object[ns] = {};
      for (let cmd of getOptionsManager(ns).list()) {
        object[ns][cmd] = {value: getOptionsManager(ns).get(cmd), type: getOptionsManager(ns).type(cmd)};
      }
    }
    res.contentType("application/json");
    res.send(object);
  });
  module.exports.express = app;
} catch (e) {
  module.exports.express = "express is not installed";
}
