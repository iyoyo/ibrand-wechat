// pages/order/index/index.js
Page({
    data: {
        tabs: ["可申请", "申请中", "已结束"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        width: 0
    },
    onLoad() {
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    width: res.windowWidth / this.data.tabs.length,
                    sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
                })
            }
        })
    },
    tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onReachBottom(e) {
        wx.showToast({
            title: '到底部啦'
        });
        console.log(e);
    }
})