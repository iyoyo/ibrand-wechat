Page({
	data: {
		storeList: {},
		text: ''
	},
	onReady() {
		wx.showLoading({
			title: '加载中',
			mask: true
		});
		wx.request({
			url: "http://api.dev.tnf.ibrand.cc/api/store/list",
			success:res=>{
				res = res.data;
				this.setData({
					storeList: res
				});
				wx.hideLoading()
			},
			fail: err => {
				wx.hideLoading()
			}
		});
	},
	jump(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/store/detail/detail?id=' + id
		})
	},
	search(e) {
		this.setData({
			text: e.detail.value
		})
	}
})