import {config} from '../../../lib/myapp.js'
Page({
	data: {
		type: 'solo',
		token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg',
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
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/invoice-user/add',
			header: {
				Authorization: this.data.token
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