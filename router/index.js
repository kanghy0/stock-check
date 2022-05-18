const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
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

router.get('/cerrotorre', (req, res) => {
  console.log('/post/cerrotorre call')
  const scm = req.query.scm;
  if(scm == "cerrotorre") {
    const goodsNo = req.query.goodsNo;
    const optionNo = req.query.optionNo;
    const size = req.query.size;
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
          var content = $('script[type=text/javascript]');
          var lastContentNo = content.length - 1;
          var script = content[lastContentNo];
          console.log($.html(script));
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


// {\"P0000BCQ00BR\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"F\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-335\",\"stock_number\":0,\"option_value_orginal\":[\"BLUE \\/ BB\",\"335\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BR\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BS\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"F\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-340\",\"stock_number\":0,\"option_value_orginal\":[\"BLUE \\/ BB\",\"340\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BS\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BT\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-345\",\"stock_number\":999,\"option_value_orginal\":[\"BLUE \\/ BB\",\"345\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BT\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BU\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-350\",\"stock_number\":999,\"option_value_orginal\":[\"BLUE \\/ BB\",\"350\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BU\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BV\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"T\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-355\",\"stock_number\":999,\"option_value_orginal\":[\"BLUE \\/ BB\",\"355\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BV\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BW\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"F\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-360\",\"stock_number\":0,\"option_value_orginal\":[\"BLUE \\/ BB\",\"360\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BW\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"},
// \"P0000BCQ00BX\":{\"stock_price\":\"0.00\",\"use_stock\":false,\"use_soldout\":\"F\",\"is_display\":\"T\",\"is_selling\":\"F\",\"option_price\":135000,\"option_name\":\"\\uc0c9\\uc0c1#$%\\uc0ac\\uc774\\uc988\",\"option_value\":\"BLUE \\/ BB-365\",\"stock_number\":0,\"option_value_orginal\":[\"BLUE \\/ BB\",\"365\"],\"use_stock_original\":\"F\",\"use_soldout_original\":\"F\",\"use_soldout_today_delivery\":null,\"is_auto_soldout\":\"F\",\"is_mandatory\":\"T\",\"option_id\":\"00BX\",\"is_reserve_stat\":\"N\",\"item_image_file\":null,\"origin_option_added_price\":\"0.00\"}}'
// ;var stock_manage = '';
// var option_value_mapper = '
// {\"BLUE \\/ BB#$%335\":\"P0000BCQ00BR\",
// \"BLUE \\/ BB#$%340\":\"P0000BCQ00BS\",
// \"BLUE \\/ BB#$%345\":\"P0000BCQ00BT\",
// \"BLUE \\/ BB#$%350\":\"P0000BCQ00BU\",
// \"BLUE \\/ BB#$%355\":\"P0000BCQ00BV\",
// \"BLUE \\/ BB#$%360\":\"P0000BCQ00BW\",
// \"BLUE \\/ BB#$%365\":\"P0000BCQ00BX\"}'
// ;var item_count = '7';var item_listing_type = 'S';var product_option_price_display = 'T'