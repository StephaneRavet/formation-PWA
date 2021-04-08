const http = require('http')
const fs = require('fs').promises
const host = 'localhost'
const port = 8000
const requestListener = async function (req, res) {
  try {
    const url = req.url === '/' ? '/index.html' : req.url.split('?')[0]
    const fileType = /(?:\.([^.]+))?$/.exec(url)[1]
    console.info(url)
    const contents = await fs.readFile(__dirname + url)
    switch (fileType) {
      case 'json':
        res.setHeader('Content-Type', 'application/json')
        break
      case 'html':
        res.setHeader('Content-Type', 'text/html')
        break
      case 'jpeg':
        res.setHeader('Content-Type', 'image/jpeg')
        break
      case 'jpg':
        res.setHeader('Content-Type', 'image/jpeg')
        break
      case 'p,ng':
        res.setHeader('Content-Type', 'image/png')
        break
      case 'css':
        res.setHeader('Content-Type', 'text/css')
        break
      case 'js':
        res.setHeader('Content-Type', 'text/javascript')
        break
    }
    res.end(contents)
  } catch (err) {
    console.error(err)
  }
}
const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
