let bsurl = 'https://poche.fm/api/app/playlists'
var common = require('../../../utils/util.js');

let seek = 0
let defaultdata = {
  winWidth: 0,
  winHeight: 0,
  listHeight: 0,
  // tab切换
  currentTab: 0,
  // 播放列表
  playlists: [],
  coverImgUrl: "../../../imgs/icon.jpg",
  nowPlayingTitle:"请选择歌曲",
  nowPlayingArtist: "",
  music: {},
  playing:false,
  playtime: '00:00',
  duration: '00:00',
  percent: 1,
  lrc: [],
  lrcindex: 0,
  showlrc: false,
  disable: false,
  downloadPercent: 0,
  share: {
    title: "一起来听",
    des: ""
  }
}
//获取应用实例
var app = getApp()
Page({
  data: defaultdata,
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: bsurl,
      success: function (res) {
        that.setData({
          listHeight: res.data.length * 230,
          playlists: res.data,
          loadingHide:true
        })
      }
    })
    /**
     * 获取系统信息
     */
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })

    this.setData({
      shuffle: app.globalData.shuffle
    });
    this.share = {
      id: options.id,
      br: options.br
    }
    if (app.globalData.curplay.id != options.id || !app.globalData.curplay.url) {
      //播放不在列表中的单曲
      this.playmusic(that, options.id, options.br);
    } else {
      that.setData({
        start: 0,
        music: app.globalData.curplay,
        duration: common.formatduration(app.globalData.curplay.dt)
      });
    };
    console.log(app.globalData.globalStop, "F playing")
  },
  bindChange: function(e) {
    var that = this;
    that.setData( { currentTab: e.detail.current });

  },
  swichNav: function(e) {
    var that = this;
    if( this.data.currentTab === e.target.dataset.current ) {
      return false;
    } else {
      that.setData( {
        currentTab: e.target.dataset.current
      })
    }
  },
  // 跳转下一页
  tracks: function(event) {
    var index = event.currentTarget.id
    var playlist = this.data.playlists[index]
    var p = playlist.id
    var title = playlist.title
    console.log(index)
    wx.navigateTo({
        url: '../tracks/index?id=' + p + '&title=' + title
    })
  },
  // 接收点击数据
  changeData: function(tracks, index) {
    app.globalData.curplay = tracks[index]
    app.globalData.index_am = index
    app.globalData.playtype = 1
    app.globalData.globalStop = false
    var shuffle = app.globalData.shuffle
    app.globalData.list_am = tracks

    this.setData({
      curplay: tracks[index].id,
      music: tracks[index].id
    })
    this.play(tracks, index)
  },
  //播放方法
  play:function(tracks, index){
    var curMusic = tracks[index]
    this.setData({
      coverImgUrl:curMusic.cover,
      nowPlayingArtist: curMusic.artist,
      nowPlayingTitle: curMusic.name,
      playing: true,
    })
    wx.playBackgroundAudio({
      dataUrl: curMusic.url,
      success:function(res){
        console.log('playBackgroundAudio success mp3');
      },
      fail:function(){
        console.log('playBackgroundAudio fail mp3');
      },
      complete:function(res) {
        console.log("complete", res)
        console.log('playBackgroundAudio complete mp3');
      }
    });
  },
  playmusic: function (that,id, br) {
    that.setData({
        start: 0,
        music: app.globalData.curplay,
        duration: common.formatduration(app.globalData.curplay.dt)
      });
    app.seekmusic(1);
  },
  playingtoggle:function(){
    var that = this
    if (this.data.playing) {
      console.log("暂停播放")
      that.setData({ playing: false })
      app.stopmusic(1)
    } else {
      console.log("继续播放")
      app.seekmusic(1, function () {
        that.setData({
          playing: true
        })
      }, app.globalData.currentPosition)
    }
  },
  playother: function (e) {
    var type = e.currentTarget.dataset.other;
    this.setData(defaultdata);
    app.nextplay(type);
    // var track = app.globalData.curplay
    // that.setData({
    //   coverImgUrl:track.cover,
    //   nowPlayingArtist: track.artist,
    //   nowPlayingTitle: track.name,
    //   playing: true,
    // })
  },
  onShow: function () {
    var that = this;
    app.globalData.playtype = 1;
    common.playAlrc(that, app);
    seek = setInterval(function () {
      common.playAlrc(that, app);
    }, 1000)
  },
})
