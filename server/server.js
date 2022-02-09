var http = require('http');
var url = require("url");
var queryString = require("querystring");
var db_opt = require('./db.js');
var port = 8855;

function parsePost(req, res, next) {
    var arr = [];
    req.addListener("data", function (data) {
        arr.push(data);
    });
    req.addListener("end", function () {
        var data = Buffer.concat(arr).toString(), ret;
        try {
            var ret = JSON.parse(data);
        } catch (err) { }
        req.body = ret;
        next();
    })
}

function process(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var result = {
        "success": true
    };
    var reqUrl = url.parse(req.url, true);
    switch (reqUrl.pathname) {
        case '/getRemark':
            // console.log(reqUrl.query);
            db_opt.getRemark(reqUrl.query.token, reqUrl.query.username, function (doc) {
                result.data = doc ? doc.remark : 'no remark';
                res.writeHeader(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            });
            break;
        case '/updateRemark':
            // console.log(req.body);
            db_opt.updateRemark(req.body.token, req.body.username, req.body.remark, function (doc) {
                res.writeHeader(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            });
            break;
    }
}

var server = http.createServer(function (req, res) {
    if (req.method.toUpperCase() == 'POST') {
        parsePost(req, res, function () {
            process(req, res)
        })
    } else if (req.method.toUpperCase() == 'GET') {
        process(req, res)
    } else if (req.method.toUpperCase() == 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credential': 'true',
            "Access-Control-Allow-Headers": '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        });
        res.end();
    }
});
server.listen(port);
console.log("http server running on port " + port + " ...");