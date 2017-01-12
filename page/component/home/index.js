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
  tracks: [],
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
  curIndex: 0,
  initial: true,
  shuffle: 1,
  share: {
    title: "一起来听",
    des: ""
  }
}
//获取应用实例
let app = getApp()
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
    // 获取上次播放数据
    let index = wx.getStorageSync('curIndex')
    let tracks = wx.getStorageSync('tracks')
    if (tracks) {
      let track = tracks[index]
      that.setData( {
        curIndex: index,
        tracks: tracks,
        coverImgUrl:track.cover,
        nowPlayingArtist: track.artist,
        nowPlayingTitle: track.name,
      })
    }

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
    wx.navigateTo({
        url: '../tracks/index?id=' + p + '&title=' + title
    })
  },
  // 接收点击数据
  changeData: function(tracks, index) {
    console.log(tracks,index)
    var curMusic = tracks[index]
    this.setData({
      curIndex: index,
      tracks: tracks,
      coverImgUrl:curMusic.cover,
      nowPlayingArtist: curMusic.artist,
      nowPlayingTitle: curMusic.name,
      playing: true,
    })
    //存储当前播放
    wx.setStorageSync("curIndex", index)
    wx.setStorageSync("tracks", tracks)
    app.seekmusic(1)
  },
  //播放方法

  playingtoggle:function(){
    var that = this
    if (this.data.initial) {
      // this.play(this.data.tracks, this.data.curIndex)
      this.setData({
        initial: false
      })
      app.seekmusic(1)
      return
    }
    if (this.data.playing) {
      console.log("暂停播放")
      that.setData({ playing: false })
      app.stopmusic(1)
      // wx.stopBackgroundAudio()
    } else {
      console.log("继续播放")
      app.seekmusic(1, function () {
        that.setData({
          playing: true
        })
      }, app.globalData.currentPosition)
    }
  },
  playnext: function (e) {
    if (this.data.initial) {
      this.setData({
        initial: false
      })
    }
    let lastIndex = parseInt(this.data.curIndex)
    let count = this.data.tracks.length
    if (lastIndex == count - 1) {
      lastIndex = 0
    } else {
      lastIndex = lastIndex + 1
    }
    this.changeData(this.data.tracks, lastIndex)

  },
  playprev: function (e) {
    if (this.data.initial) {
      this.setData({
        initial: false
      })
    }
    let lastIndex = parseInt(this.data.curIndex)
    let count = this.data.tracks.length
    if (lastIndex == 0) {
      lastIndex = count - 1
    } else {
      lastIndex = lastIndex - 1
    }
    this.changeData(this.data.tracks, lastIndex)
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
