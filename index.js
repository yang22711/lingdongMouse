//index.js
const app = getApp()

Page({
  data: {
    mode:'',
    sensibility:'',
    modeValue:'',
    sensibilityValue:'',
    tapValue:'',
    text: "",
     marqueePace: 1,//滚动速度
     marqueeDistance: 0,//初始滚动距离
     marquee_margin: 30,
     size:14,
     interval: 20 // 时间间隔
  },

  upload:function(){//这是上传的函数
  
    var that=this
    let deviceid = "643340502"
    let apikey = "lHTd2mV7gnorYu4osxfI0nJZwOE="
    let data={
      "datastreams": [//定义查找的数据流
        {"id": "mode","datapoints":[{"value": that.data.mode}]},
        {"id": "sensibility","datapoints":[{"value": that.data.sensibility}]},
        //{"id": "inf","datapoints":[{"value": that.data.inf}]},
      ]
    }
    wx.request({
      url: "https://api.heclouds.com/devices/" + deviceid + "/datapoints",
      method:'POST',//POST方式
      header:{
        "content-type": 'application/json',
        "api-key": apikey
      },
      data:JSON.stringify(data),//关键！数据流必须JSON化
      
      success:function(res){
        that.setData({
          tips:'上传成功！'
        })
        
        console.log("更新数据成功",res)
      },
      fail:function(res){
        wx.showToast({ title: '系统错误' })
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
    
  },

  onShow:function(){//页面加载函数
    var that=this
    let deviceid = "643340502"
    let apikey = "lHTd2mV7gnorYu4osxfI0nJZwOE="
    wx.request({
      url: "https://api.heclouds.com/devices/" + deviceid + "/datastreams",
      method:'GET',
      header:{
        "content-type": 'application/x-www-form-urlencoded',
        "api-key": apikey
      },//这些都是在载入页面时就读取OneNet数据的情况
      success:res=>{//读取成功后进行数据填充
        var m=res.data.data[0].current_value
        var s = res.data.data[1].current_value
        var inf1 = res.data.data[2].current_value
        var tap = res.data.data[2].current_value
        var mValue = ''//文字预处理
        console.log(res)
        if(m == 1){
             mValue = '左键'}
        else if(m == 2){
             mValue = '右键'}
        else if(m == 3){
             mValue = '双击'}
        else
             {mValue = '无操作'}//在这里做一个数据与文字的转换
        if(res.statusCode === 200){
          
          that.setData({
            modeValue: mValue,//这里直接填入文字，方便确认
            sensibilityValue: s,//灵敏度不用转换
            mode:m,
            sensibility: s,
            text:inf1,
          })

          if(tap==0){
            that.setData({
              tapValue:true
            })
          }
          else{
            that.setData({
              tapValue:false
            })
          }

          //滚动条
          var length = that.data.text.length * that.data.size;//文字长度
          var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
          //console.log(length,windowWidth);
          that.setData({
           length: length,
            windowWidth: windowWidth
          });
          that.scrolltxt();// 第一个字消失后立即从右边出现

        }
        
       
      },
      fail: function(res){
        wx.showToast({ title: '系统错误' })
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
},



   scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth){
     var interval = setInterval(function () {
      var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
      var crentleft = that.data.marqueeDistance;
      if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
       that.setData({
        marqueeDistance: crentleft + that.data.marqueePace
       })
      }
      else {
       //console.log("替换");
       that.setData({
        marqueeDistance: 0 // 直接重新滚动
       });
       clearInterval(interval);
       that.scrolltxt();
      }
     }, that.data.interval);
    }
    else{
     that.setData({ marquee_margin:"1000"});//只显示一条不滚动右边间距加大，防止重复显示
    } 
  },
   

  t0:function(){
    this.setData({
      mode:'0'
    })
  },

  t1:function(){
    this.setData({
      mode:'1'
    })
  },

  t2:function(){
    this.setData({
      mode:'2'
    })
  },

  t3:function(){
    this.setData({
      mode:'3'
    })
  },
  
  input1:function(e){
    this.setData({
      mode:e.detail.value
    })

  },

  input2:function(e){
    this.setData({
      sensibility:e.detail.value
    })

  },

  plus:function(){
    var sen1
    sen1=Number(this.data.sensibility)+1
    this.setData({
      sensibility:sen1
    })
  },

  reduce:function(){
    var sen2=this.data.sensibility-1
    this.setData({
      sensibility:sen2
    })
  },

  OneNet_Get: function(){
    var that=this
    let deviceid = "643340502"
    let apikey = "lHTd2mV7gnorYu4osxfI0nJZwOE="
    wx.request({
      url: "https://api.heclouds.com/devices/" + deviceid + "/datastreams",
      method:'GET',
      header:{
        "content-type": 'application/x-www-form-urlencoded',
        "api-key": apikey
      },
      success:res=>{
        var m=res.data.data[0].current_value
        var s = res.data.data[1].current_value
        var mValue = ''
        console.log(res)
        if(m == 1){
             mValue = '左键'}
        else if(m == 2){
             mValue = '右键'}
        else if(m == 3){
             mValue = '双击'}
        else
             {mValue = '无操作'}
        if(res.statusCode === 200){
          
          that.setData({
            modeValue: mValue,
            sensibilityValue: s,
            mode:m,
            sensibility: s,
          })
        }
        console.log(modeValue)
      },
      fail: function(res){
        wx.showToast({ title: '系统错误' })
      },
      complete:function(res){
        wx.hideLoading()
      }
    })
  },

   

})
