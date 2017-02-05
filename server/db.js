var mongoose = require('/usr/local/lib/node_modules/mongoose'),
    DB_URL = 'mongodb://localhost:27017/github';

mongoose.connect(DB_URL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});



var Schema = mongoose.Schema;
var RemarkSchema = new Schema({
    token: { type: String },
    username: { type: String },
    remark: { type: String },
    update_date: { type: Date, default: Date.now }
});

function handleError(err){
    console.log("db option err:" + err);
}


var Remark = mongoose.model('Remark', RemarkSchema);

var DbOpt = {};
DbOpt.updateRemark = function(token, username, remark, callback) {
    var condition = { token: token, username: username, remark: remark };
    var update = { remark: remark };
    Remark.findOneAndUpdate(condition, update, { upsert: true }, function (err, doc) {
        if (err) return handleError(err);
        callback(doc);
    })
}
DbOpt.getRemark = function(token, username, callback) {
    var query  = Remark.where({ token: token, username: username });
    query.findOne(function (err, doc) {
        if (err) return handleError(err);
        callback(doc);// doc may be null if no document matched
    })
}

module.exports = DbOpt;