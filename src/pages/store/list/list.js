import {config} from '../../../lib/myapp.js'
Page({
	data: {
		page: 1,
		storeList: {}
	},
	onReady() {
		wx.showLoading({
			title: '加载中',
			mask: true
		});
		wx.request({
		    url:config.GLOBAL.baseUrl + "api/store/list",
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
		})
	},
	jump(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/store/detail/detail?id=' + id
		})
	},
	onReachBottom() {
	},
	loadMore() {
		wx.request({
			url: config.GLOBAL.baseUrl + "api/store/list?page=" + (this.data.page + 1),
		})
	}
})