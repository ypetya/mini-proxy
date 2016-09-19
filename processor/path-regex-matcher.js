module.exports = PathRegexMatcher;

function PathRegexMatcher(regex) {
    this.regex = regex;
}

PathRegexMatcher.prototype.matches = function regexMatcher(request) {
    return !!request.url.path.match(this.regex);
};