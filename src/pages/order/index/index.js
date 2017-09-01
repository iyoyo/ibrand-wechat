// pages/order/index/index.js
Page({
	data: {
		tabs: ["全部", "待付款", "待发货", "待收货"],
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