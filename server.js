const express = require('express')
const index = require('./router/index.js')

const app = express()

let corsOptions = {
  origin: 'https://www.grayshop.co.kr',
  credentials: true
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('안녕하세요!')
})
app.use('/posts', index);

app.listen(80, (req, res) => {
  console.log("서버 실행");
});