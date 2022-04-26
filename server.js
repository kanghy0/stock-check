const express = require('express')
const http = require('http');
const index = require('./router/index.js')
const cors = require('cors');
const bodyParser = require('body-parser'); 

const app = express()

let corsOptions = {
  origin: 'https://grayshop.co.kr',
  credentials: true
}

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('안녕하세요!')
})
app.use('/post', index);

app.listen(80, (req, res) => {
  console.log("서버 실행");
});