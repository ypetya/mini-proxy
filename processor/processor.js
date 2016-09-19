module.exports = Processor;

function Processor() {}

Processor.prototype.matches = function ALWAYS() {
    return true;
};

Processor.prototype.requestHandler = function DO_NOTHING(req, response) {

};
