import {config} from '../../../lib/myapp.js'
Page({
	data: {
		type: 'solo',
		order_no: '',
		content: ''
	},
	onLoad(e) {
		this.setData({
			order_no: e.order_no
		})
	},
	change(e) {
		this.setData({
			type: e.detail.value
		})
	},
	input(e) {
		this.setData({
			content: e.detail.value
		})
	},
	submit() {
		var type = '';
		if (this.data.type == 'solo') {
			type = '个人'
		} else {
			if (this.data.type != 'solo' && this.data.content == '') {
				return wx.showToast({
					title: '请输入单位名称',
					image: '../../../assets/image/error.png'
				})
			} else {
				type = this.data.content
			}
		}
		this.addInvoiceInfo(type);
	},
	// 添加发票信息
	addInvoiceInfo(type) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/invoice-user/add',
			header: {
				Authorization: token
			},
			method: 'POST',
			data: {
				type: type
			},
			success: res => {
				res = res.data;

				if (res.status) {
					var data = wx.getStorageSync('order_form');
					if (!data) {
						return wx.showToast({
							title: '非法操作',
							image: '../../../assets/image/error.png',
							complete: err => {
								setTimeout(() => {
									wx.navigateBack();
								},1600)
							}
						})
					}

					var order_no = this.data.order_no;
					if (order_no && data.order_no === order_no) {
						data.invoice = res.data;
						wx.setStorageSync('order_form', data);
						wx.navigateBack();
					} else {
						return wx.showToast({
							title: '非法操作',
							image: '../../../assets/image/error.png',
							complete: err => {
								setTimeout(() => {
									wx.navigateBack();
								},1600)
							}
						})
					}
				} else {
					wx.showToast({
						title: res.messages,
						image: '../../../assets/image/error.png',
						complete: err => {
							setTimeout(() => {
								wx.navigateBack();
							},1600)
						}
					})
				}
			},
			complete: err => {
				if (err.statusCode != 200) {
					wx.showToast({
						title: '网络错误',
						image: '../../../assets/image/error.png',
						complete: err => {
							setTimeout(() => {
								wx.navigateBack();
							},1600)
						}
					})
				}
			}
		})
	}

})