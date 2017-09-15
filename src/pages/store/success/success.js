import {config,pageLogin,getUrl} from '../../../lib/myapp.js'
Page({
	data: {
		info: {},
		order_no: '',
		isOK: true
	},
	onLoad(e) {
		this.setData({
			order_no: e.order_no,
			amount:e.amount,
			channel:e.channel
		});
		pageLogin(getUrl(), () => {
			this.queryOrderType(e.order_no);
		});
	},
	jump() {
		wx.redirectTo({
			url: '/pages/order/detail/detail?no=' + this.data.order_no
		})
	},
	queryOrderType(no) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/shopping/order/paid',
			method: 'POST',
			header: {
				Authorization: token
			},
			data: {
				order_no: no,
				amount: this.data.amount,
				channel: this.data.channel
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;

					if (res.status) {
						this.setData({
							info: res.data
						})
					} else {
						this.setData({
							isOK: false
						})
						wx.showModal({
							title: '',
							content: res.message,
							showCancel: false
						})
					}
				} else {
					this.setData({
						isOK: false
					})
					wx.showModal({
						title: '',
						content: "请求失败",
						showCancel: false
					})
				}
			}
		})
	}
})