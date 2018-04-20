var express = require('express')
var app1 = express()
var bodyParser = require('body-parser')
app1.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app1.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '50mb'
}));
app1.use(express.json());       // to support JSON-encoded bodies
app1.use(express.urlencoded()); // to support URL-encoded bodies
app1.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var imgs = [];
app1.post('/image', (req, res) => {
    imgs.push(req.body.data.replace('data:image/png;base64,', ''))
    res.end((imgs.length - 1).toString())
})
app1.get('/image/:id', (req, res) => {
    var img = new Buffer(imgs[parseInt(req.params.id)], 'base64');

    res.writeHead(200, {
     'Content-Type': 'image/png',
     'Content-Length': img.length
    });
    res.end(img); 
    // res.send('Hello World!')

})
app1.get('/images', (req, res) => {
    res.end(JSON.stringify(imgs));
})
app1.listen(3000, () => console.log('Example app listening on port 3000!'))