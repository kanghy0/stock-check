const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const router = express.Router();

router.get('/', (req, res) => {
  console.log('/posts call')
  res.send('테스트입니다.')
})

router.get('/data', (req, res) => {
  console.log('/posts/data call')
  const scm = req.scm;
  if(scm == 'nelson') {
    const url = req.url;
    const goodsDir = req.goodsDir;
    const goodsNo = req.goodsNo;
    const optionNo = req.optionNo;
    const size = req.size;
    try {
      axios.get(url + goodsDir, {
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
        var isSoldout = script[1].search("'" + size + "','soldout'");
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
  }
  return false;
});

module.exports = router;