import {config,pageLogin,getUrl} from '../../../lib/myapp.js'
Page({
	data: {
		info: {},
		order_no: ''
	},
	onLoad(e) {
		this.setData({
			order_no: e.order_no
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
				amount: 3000,
				channel: "alipay_wap"
			},
			success: res => {
				res = res.data;

				if (res.status) {
					this.setData({
						info: res.data
					})
				}
			}
		})
	}
})