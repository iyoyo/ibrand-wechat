import {config} from '../../../lib/myapp.js';

Page({
	data:{
		page: 1,
		list: [],
		meta: '',
		show: false,
	},
	onLoad(){
		this.queryCouponList(0);
	},
	onReachBottom ()  {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			var page = this.data.meta.pagination.current_page + 1;
			this.setData({
				show: true
			})
			this.queryCouponList(0, page)
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
	}
})