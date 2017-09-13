import {config} from '../../../lib/myapp.js';

Page({
	data:{
		page: 1,
		list: [],
		meta: '',
		show: false,
		code: ''
	},
	onLoad(){
		this.queryCouponList(1);
	},
	onReachBottom ()  {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			var page = this.data.meta.pagination.current_page + 1;
			this.setData({
				show: true
			})
			this.queryCouponList(1, page)
		} else {
			wx.showToast({
				image: '../../../assets/image/error.png',
				title: '再拉也没有啦'
			});
		}
	},
	jumpOff() {
		wx.navigateTo({
		  url: '/pages/coupon/over/over'
		})
	},
	convert() {
		var code = this.data.code;
		if (code == '') {
			wx.showModal({
				title: '',
				content: "请输入兑换码",
				showCancel: false
			})
		} else {
			this.convertCoupon(code);
		}

	},
	input(e) {
		var vlaue = e.detail.value

		this.setData({
			code: vlaue
		})
	},
	viewDetail(e) {
		var type = e.currentTarget.dataset.info.discount.type;
		var id = e.currentTarget.dataset.info.id;
		if (type == 0) {
			wx.navigateTo({
				url: '/pages/coupon/onDetail/onDetail?id=' + id
			})
		} else {
			wx.navigateTo({
				url: '/pages/coupon/offDetail/offDetail?id=' + id
			})
		}
	},
	// 查询优惠券列表
	queryCouponList(status, page = 1) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/coupon',
			header: {
				Authorization: token
			},
			data: {
				is_active:status,
				page
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						this.setData({
							[`list.${page - 1}`]: res.data,
							meta: res.meta
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
			},
			complete: err => {
				this.setData({
					show: false
				})
			}
		})
	},
	// 兑换优惠券
	convertCoupon(code) {
		var token = wx.getStorageSync('user_token');

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/coupon/convert',
			method: 'POST',
			header: {
				Authorization: token
			},
			data: {
				coupon_code:code
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						wx.showModal({
							title: '',
							content: '领取成功',
							showCancel: false,
							success: res => {
								if (res.confirm) {
									this.queryCouponList(1)
								}
							}
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