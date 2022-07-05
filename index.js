const http = require('http')
const fs = require('fs').promises

const host = 'localhost'
const port = 8000

const requestListener = function (req, res) {
    const url = req.url
    switch (url) {
        case '/':
            fs.readFile(__dirname + '/src/index.html')
                .then(contents => {
                    res.setHeader('Content-Type', 'text/html')
                    res.writeHead(200)
                    res.end(contents)
                })
                .catch(err => {
                    res.writeHead(500)
                    res.end(err)
                    return
                })
            break
        case '/value_bets':
            fs.readFile(__dirname + '/cron-workers/res.json')
                .then(contents => {
                    res.setHeader('Content-Type', 'application/json')
                    res.writeHead(200)
                    res.end(contents)
                })
                .catch(err => {
                    res.writeHead(500)
                    res.end(err)
                    return
                })
            break
        default:
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Resource not found' }))
    }
}


const server = http.createServer(requestListener)
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})
