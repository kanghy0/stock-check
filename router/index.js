const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const router = express.Router();

router.get('/', (req, res) => {
  console.log('/get call')
  res.send('테스트입니다.')
})

router.get('/nelson', (req, res) => {
  console.log('/get/data call')
  // const scm = req.scm;
  // if(scm == 'nelson') {
    const goodsNo = req.query.goodsNo;
    const optionNo = req.query.optionNo;
    const size = req.query.size;

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
        var isSoldout = script[0].search("'" + size + "','soldout'");
        if(isSoldout == -1) {
          isSoldout = 1;
        } else if(1) {
          isSoldout = 0;
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
  // }
  // return false;
});

module.exports = router;