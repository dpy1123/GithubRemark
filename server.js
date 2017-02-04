var http = require('http');
var url = require("url");
var queryString  = require("querystring");

function parsePost(req,res, next){
    var arr = [];
    req.addListener("data",function(data){
        arr.push(data);
    });
    req.addListener("end",function(){
        var data= Buffer.concat(arr).toString(),ret;
        try{
            var ret = JSON.parse(data);
        }catch(err){}
        req.body = ret;
        next();
    })
}

function process(req, res){
    var result = {
        "success": true,
        "data": "no remark"
    };
    var reqUrl = url.parse(req.url, true);
    switch (reqUrl.pathname) {
        case '/getRemark':
            // console.log(reqUrl.query);
            result.data = "bbbb";
            break;
        case '/updateRemark':
            console.log(req.body);
            break;
    }
        
    res.writeHeader(200, { 'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
}

var server = http.createServer(function (req, res) {
    if (req.method.toUpperCase() == 'POST') {
        parsePost(req, res, function(){
            process(req, res)
        })
    }else if(req.method.toUpperCase() == 'GET') {
        process(req, res)
    }
});
server.listen(8888);
console.log("http server running on port 8888 ...");