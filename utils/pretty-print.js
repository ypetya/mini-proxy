var console = require('console');

module.exports = {
    stringBuilder: Builder,
    logImportantOptions: logImportantOptions,
    logJson: logJson
};

function Builder(options) {
    var str = '';

    this.add = function add(o) {
        if (str) {
            str += ' ';
        }
        str += o + ': ';
        var val = options[o],
            ret = this;
        if (typeof(val) == 'object') {
            ret = this.addJson(val);
        } else {
            str += String(options[o]);
        }
        return ret;
    };

    this.addJson = function (o) {
        if (str) {
            str += '\n';
        }
        str += JSON.stringify(o, null, 3);
        return this;
    };

    this.build = function build() {
        return str;
    }
}


function logImportantOptions(options, propertyArray) {
    var formatted = new Builder(options);

    propertyArray.forEach(function(propertyName){
       formatted.add(propertyName);
    });

    console.log('FWD TO ' + formatted.build());
}

function logJson(obj) {
    var formatted = new Builder();
    formatted.addJson(obj);
    console.log(formatted.build());
}