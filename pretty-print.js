module.exports = Builder;

function Builder(options) {
    var str='';

    this.add=function add(o) {
        if(str){
            str += ' ';
        }
        str += o + ': ';
        str += String(options[o]);
        return this;
    };

    this.build=function build(){
        return str;
    }
}