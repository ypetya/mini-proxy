module.exports=callbackHandlers;

function callbackHandlers(request) {
    var handler,
        rules=reloadRules(),
        rulesSize=Object.keys(rules).length;
    for(var i=0;i< rulesSize;i++) {
        var rule=rules[i];
        if(rule.matches(request)) {
            return rule.requestHandler;
        }
    }
    return null;
}

function reloadRules() {
    delete require.cache[require.resolve('../rules')];
    return require('../rules');
}