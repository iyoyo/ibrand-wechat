import {config,is} from '../../../lib/myapp.js';
Page({
	data: {
		detail: {
			is_default: false,
			address_name: [],
			area: 430105,
			city: 430100,
			province: 430000
		},
		token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg',
		order_no: '',
		id: '',
		loading: false,
		deleteLoading: false
	},

	onLoad(e) {
		this.setData({
			id: e.id
		})
		if (e.id) {
			wx.setNavigationBarTitle({
				title: '修改收货地址'
			})
			this.queryAddress(e.id);
		} else {
			wx.setNavigationBarTitle({
				title: '新增收货地址'
			})
		}
	},
	bindRegionChange(e) {
		this.setData({
			'detail.address_name': e.detail.value
		})
	},
	check(e) {
		this.setData({
			"detail.is_default": !this.data.detail.is_default
		})
	},
	input(e) {
		var type = e.currentTarget.dataset.type;
		var value = e.detail.value;
		this.setData({
			[`detail.${type}`]: value
		})
	},
	delete() {
		this.setData({
			deleteLoading: true
		})
		this.removeAddress(this.data.id);
	},
	submit() {
		this.setData({
			loading: true
		})
		var message = null;
		if (!is.has(this.data.detail.accept_name)) {
			message = '请输入姓名'
		} else if (!is.has(this.data.detail.mobile)) {
			message = '请输入手机号码'
		} else if (!is.mobile(this.data.detail.mobile)) {
			message = '请输入正确的手机号码'
		} else if (!is.has(this.data.detail.address_name)) {
			message = '请选择地址'
		} else if (!is.has(this.data.detail.address)) {
			message = '请输入详细地址';
		}
		if (message) {
			this.setData({
				loading: false
			})
			wx.showModal({
				title: '',
				content: message,
				showCancel: false
			})
		} else {
			if (this.data.id) {
				this.updateAddress(this.data.detail);
			} else {
				this.createAddress(this.data.detail)
			}
		}
	},
	// 获取收货地址详情
	queryAddress(id) {
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/address/' + id,
			header: {
				Authorization: this.data.token
			},
			success: res => {
				res = res.data;
				var data = res.data;
				data.is_default = !!data.is_default;
				data.address_value = [data.province, data.city, data.area].join(' ');
				data.address_name = data.address_name.split(' ');
				if (res.status) {
					this.setData({
						detail: data
					})
				} else {
					wx.showToast({
						title: '获取信息失败',
						image: '../../../assets/image/error.png'
					})
				}
			},
			fail: err => {
				wx.showToast({
					title: '获取信息失败',
					image: '../../../assets/image/error.png'
				})
			}
		})
	},
	// 新增收货地址
	createAddress(data) {
		var address = {
			accept_name: data.accept_name,
			mobile: data.mobile,
			province: data.province,
			city: data.city,
			area: data.area,
			address_name: data.address_name.join(" "),
			address: data.address,
			is_default: data.is_default ? 1 : 0
		};

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/address/create',
			method: 'POST',
			header: {
				Authorization: this.data.token
			},
			data: address,
			success: res => {
				res = res.data;
				if (res.status) {
					wx.showModal({
						title: '',
						content: '新增收货地址成功',
						showCancel: false,
						success: res=>{
							if (res.confirm) {
								wx.navigateBack();
							}
						}
					})
				} else {
					wx.showToast({
						title: '新增收货地址失败',
						image: '../../../assets/image/error.png',
						complete: err => {
							setTimeout(() => {
								wx.navigateBack();
							},1600)
						}
					})
				}
			},
			fail: err => {
				wx.showToast({
					title: '请求错误',
					image: '../../../assets/image/error.png',
					complete: err => {
						setTimeout(() => {
							wx.navigateBack();
						},1600)
					}
				})
			},
			complete: err => {
				this.setData({
					loading: false
				})
			}
		})
	},
	// 修改收货地址
	updateAddress(data) {
		var address = {
			id: data.id,
			accept_name: data.accept_name,
			mobile: data.mobile,
			province: data.province,
			city: data.city,
			area: data.area,
			address_name: data.address_name.join(" "),
			address: data.address,
			is_default: data.is_default ? 1 : 0
		};

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/address/update',
			method: 'PUT',
			header: {
				Authorization: this.data.token
			},
			data: address,
			success: res => {
				res = res.data;
				if (res.status) {
					wx.showModal({
					  title: '',
					  content: '修改收货地址成功',
						showCancel: false,
					  success: res=>{
					    if (res.confirm) {
						    wx.navigateBack();
					    }
					  }
					})
				} else {
					wx.showToast({
						title: '修改收货地址失败',
						image: '../../../assets/image/error.png',
						complete: err => {
							setTimeout(() => {
								wx.navigateBack();
							},1600)
						}
					})
				}
			},
			fail: err => {
				wx.showToast({
					title: '请求错误',
					image: '../../../assets/image/error.png',
					complete: err => {
						setTimeout(() => {
							wx.navigateBack();
						},1600)
					}
				})
			},
			complete: err => {
				this.setData({
					loading: false
				})
			}
		})
	},
	// 删除收货地址
	removeAddress(id) {
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/address/' + id,
			header: {
				Authorization: this.data.token
			},
			method: 'DELETE',
			success: res => {
				res = res.data;
				if (res.status) {
					wx.showModal({
						title: '',
						content: '删除收货地址成功',
						showCancel: false,
						success: res=>{
							if (res.confirm) {
								wx.navigateBack();
							}
						}
					})
				} else {
					wx.showToast({
						title: '删除收货地址失败',
						image: '../../../assets/image/error.png',
						complete: err => {
							setTimeout(() => {
								wx.navigateBack();
							},1600)
						}
					})
				}
			},
			fail: err => {
				wx.showToast({
					title: '请求错误',
					image: '../../../assets/image/error.png',
					complete: err => {
						setTimeout(() => {
							wx.navigateBack();
						},1600)
					}
				})
			},
			complete: err => {
				this.setData({
					deleteLoading: false
				})
			}
		})
	}

})