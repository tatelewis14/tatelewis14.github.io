const http = require('http')
const fs = require('fs')
const port = 8000

const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type' : 'text/html' })
    fs.readFile('data.html', (error, data) => {
        if (error) {
            res.writeHead(404)
            console.log(error)
        } else {
            res.write(data)
        }
        res.end()
    })
})
server.listen(port, error=>{
    if (error) {
        console.log('There was an error')
        console.error(error)
    } else {
        console.log(`Server is running on port ${port}`)
    }
});