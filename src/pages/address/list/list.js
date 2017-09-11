import {config,pageLogin,getUrl} from '../../../lib/myapp.js';
Page({
	data: {
		list: [],
		order_no: ''
	},
	onLoad(e) {
		pageLogin(getUrl());
		this.setData({
			order_no: e.order_no
		})
	},
	onShow() {
		this.queryAddressList();
	},
	setInfo(e) {
		var from = e.currentTarget.dataset.info;
		var data = wx.getStorageSync('order_form');
		if (!data) {
			return this.view(from.id);
		}


		var order_no = this.dta.order_no;
		if (order_no && data.order_no === order_no) {
			data.address  = from;
			wx.setStorageSync('order_form', data);
			wx.navigateBack();
		} else {
			return this.view(from.id);
		}
	},
	view(id) {
		wx.navigateTo({
			url: '/pages/address/add/add?id=' + id
		})
	},
	add() {
		wx.navigateTo({
			url: '/pages/address/add/add'
		})
	},
	// 查询收货地址列表
	queryAddressList() {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/address',
			header: {
				Authorization: token
			},
			success: res => {
				res = res.data;
				this.setData({
					list: res.data
				})
			}
		})
	}
})