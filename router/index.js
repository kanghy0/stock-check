const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const bodyParser = require('body-parser'); 
const cors = require('cors');

const router = express.Router();

let corsOptions = {
  origin: 'https://grayshop.co.kr',
  credentials: true
}

router.use(cors(corsOptions));

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  console.log('/post call')
  res.send('테스트입니다.')
})

router.post('/nelson', (req, res) => { // post
  console.log('/post/data call')
  const scm = req.body.scm; // body
  if(scm == 'nelson') {
    const goodsNo = req.body.goodsNo; // body
    const optionNo = req.body.optionNo; // body
    const size = req.body.size; // body
    if(!goodsNo || !optionNo || !size) {
      res.json(scm);
    } else {
      try {
        axios.get('http://www.nelsonsports.co.kr/shop/goods/goods_view.php', {
          params: {
            goodsno: goodsNo,
          }
        })
        .then(html => {
          var $ = cheerio.load(html.data);
          var content = $('div#content').children('script');
          var script = '';
          content.each(function(i, el) {
            if(i == 5) {
              script = $(this).html();
            }
          })
          script = script.split('console.log(opt);');
          script = script[0].split("opt['" + optionNo + "']");
          script = script[script.length - 1].split("opt['");
          var isSoldout = script[0].includes("'" + size + "',''");
          if(isSoldout == false) {
            isSoldout = 0;
          } else if(isSoldout == true) {
            isSoldout = 1;
          } else {
            isSoldout = -1;
          }
          res.json({
            isSoldout: isSoldout,
          });
        })
        .catch(err => {
          console.log(err);
        })
      }
      catch (err) {
        console.log(err)
      }     
    }
  } else {
    res.json(req.body);
  }
});

module.exports = router;