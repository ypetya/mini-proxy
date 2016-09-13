module.exports = Builder;

function Builder(options) {
    var str='';

    this.add=function add(o) {
        if(str){
            str += ' ';
        }
        str += o + ': ';
        var val = options[o],
            ret = this;
        if(typeof(val)=='object') {
            ret = this.addJson(val);
        } else {
            str += String(options[o]);
        }
        return ret;
    };

    this.addJson=function (o) {
        if(str){
            str += '\n';
        }
        str += JSON.stringify(o, null, 3);
        return this;
    };

    this.build=function build(){
        return str;
    }
}