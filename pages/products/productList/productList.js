// pages/products/productList/productList.js
//获取应用实例
var app = getApp();

Page({
  data: {
    list: [],              //用于存储目录
    datalist: [],          //用于存储商品
    scrollNum: 1,
    curIndex: 0,
    typeHeight: 37,
    goodHeight: 96,
    toView: "index3",
  },

  /*******  接口调用失败   *******/
  FunFail: function (res) {
    console.log("fail", res);
  },

  onLoad: function (options) {
    var that = this;
    var url = app.apiUrl + "/Material/CatalogueList";
    var params = {};
    //目录请求
    app.request.requestGetApi(url, params, this, function (res) {
      console.log(res);
      if (res.status == 200) {
        that.setData({
          list: res.result,
          start: 1,
          perpage: 10,
        })

        var list = that.data.list;
        var catalogueId = list[0].identity;            //分类id
        var start = that.data.start;
        var perpage = that.data.perpage;
        that.productInfo(start, perpage);
      } else {
        console.log(res);
      }
    }, that.FunFail);


    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    });
  },

  //商品请求
  productInfo: function (start, perpage) {
    var that = this;
    var url = app.apiUrl + "/Material/ProductList";
    var params = {
      // catalogueId: catalogueId,
      start: start,
      perpage: perpage
    };
    app.request.requestGetApi(url, params, this, function (res) {
      console.log(res);
      if (res.status == 200) {
        that.setData({
          datalist: res.result,
        })
      }
    }, that.FunFail);
  },

  //滚动函数
  goodsScrollAct: function (e) {
    console.log("发生了goodsScrollAct事件");
    var that = this;
    var list = that.data.list;
    var datalist = that.data.datalist;
    var data = [];
    for (var i = 0; i < list.length; i++) {
      var n = 0;
      for (var j = 0; j < datalist.length; j++) {
        if (list[i].identity == datalist[j].catalogue.catalogue_identity) {
          n++
          data[i] = n;
        } else {
          if (n == 0) {
            data[i] = 0;
          } else {
            data[i] = n;
          }
        }
      }
    }

    var heightList = [0];
    var curHeight = 0;
    data.forEach((item) => {
      curHeight += (that.data.typeHeight + item * that.data.goodHeight);
      heightList.push(curHeight);
    });
    console.log(heightList);

    for (var i = 0; i < heightList.length; i++) {
      if (i == (heightList.length - 1)) {
        if (e.detail.scrollTop >= (heightList[i - 1] - 180)) {
          console.log(333);
          that.setData({
            scrollNum: i
          });
        }
      }
       else {
        if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
          console.log(i);
          console.log("e.detail.scrollTop=", e.detail.scrollTop);
          console.log("heightList[i]=", heightList[i]);
          console.log("heightList[i + 1]", heightList[i + 1]);
          that.setData({
            scrollNum: i + 1
          });
        }
       }
    }
  },

  //左侧点击事件
  selectMenuAct: function (e) {
    console.log("发生了selectMenuAct事件");
    var that = this;
    var id = e.target.dataset.id;
    this.setData({
      // scrollNum: id,
      toView: id
    })
  },

  //进入商品详情页
  productDetails: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/products/productDetails/productDetails?productId=' + id,
    })
  },

  //进入礼包详情页
  giftDetails: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/products/giftDetails/giftDetails?productId=' + id,
    })
  }
})