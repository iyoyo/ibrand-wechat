import {config} from '../../../lib/myapp.js';

Page({
	data: {
		detail: ''
	},
	onLoad(e) {
		var id = e.id;
		this.queryCouponDetail(id);
	},
	// 查询优惠券详情
	queryCouponDetail(id) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/coupon/' + id,
			header: {
				Authorization: token
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						this.setData({
							detail: res.data
						})
					} else {
						wx.showModal({
							title: '',
							content: res.message,
							showCancel: false
						})
					}
				} else {
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