var http= require('http'),
    console= require('console'),
    Builder= require('./pretty-print');

module.exports=SimpleProxy

// fwdOptions: { hostname: String, port: Number, pathCb: String:function(String)}
function SimpleProxy(regex, fwdOptions) {

  this.matches= function pathMatcher(req) {
    return !!req.url.path.match(regex);
  };

  this.requestHandler= function forward(req,res) {
    var headers=JSON.parse(JSON.stringify(req.headers));
    delete headers.host;
    // make a request to a tunneling proxy
      var options = {
        port: fwdOptions.port,
        hostname: fwdOptions.hostname,
        method: req.method,
        path: transformPath(req.url.path),
        headers: headers
      };

      console.log('FWD TO ' + pretty(options));

      var req2 = http.request(options, function(res2){
        res.writeHead(res2.statusCode, res2.headers);

        res2.pipe(res);

        res2.on('end', function(){
          res.end();
        });
      });
      req2.end();
  };

  function transformPath(path) {
    if(typeof(fwdOptions.pathCb)=="function"){
      path= fwdOptions.pathCb(path);
    }
    return path;
  }
}

function pretty(options) {
  var formatted=new Builder(options);

  formatted.add('method').add('hostname').add('port').add('path');

  return formatted.build();
}