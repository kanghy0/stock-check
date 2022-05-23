const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const bodyParser = require('body-parser'); 
const cors = require('cors');

const router = express.Router();

let corsOptions = {
  origin: 'https://www.grayshop.co.kr',
  credentials: true
}

router.use(cors(corsOptions));

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  console.log('/post call')
  res.send('테스트입니다.')
})

router.post('/nelson', (req, res) => {
  console.log('/post/nelson call')
  const scm = req.body.scm;
  if(scm == "nelson") {
    const goodsNo = req.body.goodsNo;
    const optionNo = req.body.optionNo;
    let size = req.body.size;
    if(size == '') {
      size = 'Free';
    }
    if(!goodsNo) {
      res.json();
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
        console.log(err);
      }     
    }
  } else {
    res.json();
  }
});

router.post('/cerrotorre', (req, res) => {
  console.log('/post/cerrotorre call')
  const scm = req.body.scm;
  if(scm == "cerrotorre") {
    const goodsNo = req.body.goodsNo;
    const optionNo = req.body.optionNo;
    let size = req.body.size;
    if(!goodsNo) {
      res.json();
    } else {
      try {
        axios.get('https://cerrotorremall.com/product/detail.html', {
          params: {
            product_no: goodsNo,
          }
        })
        .then(html => {
          var $ = cheerio.load(html.data);
          var optionName = $('select#product_option_id1').children('option');
          if(optionName.length != 0) {
            optionName = optionName[Number(optionNo) + 2].attribs.value;
            optionName = optionName.replace(/\//gi, '\\\\/');
          } else {
            optionName = '';
          }
          if(size != '') {
            if(isNaN(size) == false) {
              size = Number(size) * 10;
            } else {
              size = size[0];
            }
          }
          var content = $('script[type=text/javascript]');
          var lastContentNo = content.length - 1;
          var script = content[lastContentNo];
          var testScript = [];
          if(optionName != '') {
            script = $.html(script).split('var option_stock_data = ');
            script = script[1].split('var stock_manage = ');
            script = script[0].split('stock_price');
            for (let index = 0; index < script.length; index++) {
              if(script[index].includes('\\"option_value\\":\\"' + optionName + '-' + size)) {
                testScript.push(script[index]);
              }
            }
            var isSoldout = -1;
            if(testScript.length == 1) {
              if(testScript[0].includes('\\"is_selling\\":\\"T\\",')) {
                isSoldout = 1;
              } else if(testScript[0].includes('\\"is_selling\\":\\"F\\",')) {
                isSoldout = 0;
              }
              res.json({
                isSoldout: isSoldout, 
              });
            } else {
              res.json();
            }
          } else if(optionName == '') {
            var isSoldout = -1;
            if($.html(script).includes('\\"is_soldout\\":false,')) {
              isSoldout = 1;
            } else if($.html(script).includes('\\"is_soldout\\":true,')) {
              isSoldout = 0;
            }
            res.json({
              isSoldout: isSoldout,
            })
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
      catch (err) {
        console.log(err);
      }
    }
  } else {
    res.json();
  }
});

router.post('/kl', (req, res) => {
  console.log('/post/kl call')
  const scm = req.body.scm;
  if(scm == "kl") {
    const goodsNo = req.body.goodsNo;
    const optionNo = req.body.optionNo;
    let size = req.body.size;
    if(!goodsNo) {
      res.json();
    } else {
      try {
        axios.get('https://www.altrarunning.kr/shop/shopdetail.html', {
          params: {
            branduid: goodsNo,
          }
        })
        .then(html => {
          var $ = cheerio.load(html.data);
          var content = $('body script[type=text/javascript]');
          var script = '';
          content.each(function(i, el) {
            if(i == 7) {
              script = $(this).html();
            }
          })
          script = script.split('var optionJsonData');
          script = script[1].split('var view_member_only_price');
          script = script[0].split('adminuser');
          var isOptionOne = [];
          script.forEach(element => {
            var soldoutTest = element.split('opt_values');
            if(typeof(soldoutTest[1]) == 'string') {
              if(isNaN(size)) {
                if(soldoutTest[1].includes(":'" + size + "',sto_price")) {
                  isOptionOne.push(soldoutTest[1]);
                }
              } else {
                if(soldoutTest[1].includes('(US ' + size + ')')) {
                  isOptionOne.push(soldoutTest[1]);
                }
              }
            }
          });
          var isSoldout = -1;
          if(isOptionOne.length == 1) {
            if(isOptionOne[0].includes("'SOLDOUT'")) {
              isSoldout = 0;
            } else {
              isSoldout = 1;
            }
          }
          res.json({
            isSoldout: isSoldout,
          })
          console.log(isSoldout);
        })
        .catch(err => {
          console.log(err);
        })
      }
      catch (err) {
        console.log(err);
      }
    }
  } else {
    res.json();
  }
});

module.exports = router;