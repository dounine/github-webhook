var http = require('http')
var createHandler = require('github-webhook-handler')
var secretPassword = 'abc123' //github secret安全密码
var handler = createHandler({path: '/webhook', secret: secretPassword})
var cmd = require('node-cmd')
var port = 7777

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.writeHead(200, {'content-type': 'application/json'})
        var msg = '{"code":404,"msg":"没有这个地扯"}'
        res.end(msg)
        console.log(msg)
    })
}).listen(port, function () {
    console.log("Github Hook Server running at http://0.0.0.0:" + port + "/webhook");
});

handler.on('error', function (err) {
    console.error('错误:', err.message)
})

handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref)
    cmd.get('/root/xxx/test.sh', function (err, data, stderr) {
        console.log(data)
        if (stderr) {
            console.log("脚本错误:" + stderr)
        }
    })
})

handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
})