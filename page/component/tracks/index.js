let bsurl = 'https://poche.fm/api/app/playlists/'
Page({
    data: {
        tracks: [],
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: bsurl + options.id,
            success: function (res) {
                that.setData({
                    tracks: res.data
                })
            }
        })
    },
    itemClick: function(event) {
        var p = event.currentTarget.id
        var that = this
        var pages = getCurrentPages()

        if(pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2]
            //关键在这里
            prePage.changeData(this.data.tracks,p)
        }
    }
})
