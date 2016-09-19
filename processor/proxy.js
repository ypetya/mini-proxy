var PathRegexMatcher = require('./path-regex-matcher'),
    SetupRequestProtocol = require('./setup-request-protocol'),
    ForwardRequest = require('./forward-request');

module.exports = Proxy;

function Proxy(opts) {
    this.setOptions(opts);

    PathRegexMatcher.call(this, this.regex);
    ForwardRequest.call(this);

    SetupRequestProtocol.prototype.setupProtocol.call(this);
}

Proxy.prototype = Object.create(ForwardRequest.prototype);
Proxy.prototype.constructor = Proxy;
Proxy.prototype.matches = PathRegexMatcher.prototype.matches;

Proxy.prototype.setOptions = function setConstructorOptions(opts) {
    Object.keys(opts || {}).forEach(function (key) {
        this[key] = opts[key];
    }.bind(this));
};
