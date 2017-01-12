let bsurl = 'https://poche.fm/api/app/playlists'
Page({
    data: {
        playlists: [],
        loadingHide:false,
        currentPosition:0,
        cIndex:0,
        isPlayingMusic:0,
    },
    onLoad: function () {
        var that = this
        wx.request({
            url: bsurl,
            success: function (res) {
                that.setData({
                    playlists: res.data,
                    loadingHide:true
                })
            }
        })
    },
    tracks: function(event) {
        var p = event.currentTarget.id
        wx.navigateTo({
            url: '../tracks/index?id=' + p
        })
    },
    //bottom click event
  clickBottomInfo: function(e){
    console.log('bottom click event');

    var curData = this.data.musicData[this.data.cIndex];
    console.log(curData);

    var params = '?dataUrl='+curData.dataUrl+'&title='+curData.title+'&coverImgUrl='
      +curData.coverImgUrl+'&author='+curData.author+'&mvUrl='+curData.mvUrl;

    this.pause();

    wx.navigateTo({
      url:"../list/list"+params,
      success:function(){
        console.log("eee");
      }
    });

  },
  // 接收点击数据
  changeData: function(tracks, index) {
    this.play(tracks, index)
  },
  //播放方法
  play:function(tracks, index){
      console.log(index);
      var curMusic = tracks[index];
      wx.playBackgroundAudio({
        dataUrl: curMusic.url,
        title: curMusic.name,
        coverImgUrl:curMusic.cover,

        success:function(res){
          console.log('playBackgroundAudio success mp3');
        },
        fail:function(){
          console.log('playBackgroundAudio fail mp3');
        },
        complete:function(){
          console.log('playBackgroundAudio conpile mp3');
        }
      });
  },
})
