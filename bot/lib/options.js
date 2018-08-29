var namespaces = {};


function getOptionsManager(namespace){
    if(namespaces[namespace] !== undefined){
        return namespaces[namespace];
    }
    var options = {};
    let closure = {
        set: (name, val) => { options[name] = val;},
        get: (name) => options[name],
        list: () => Object.keys(options)
    };
    namespaces[namespace] = closure;
    return closure
}

module.exports = getOptionsManager;
module.exports.all = namespaces;