import {config} from '../../../lib/myapp.js'
Page({
	data: {
		order: {},
		typeList: [
			'临时订单',
			'待付款',
			'付款成功',
			'已发货',
			'已完成',
			'已完成',
			'已取消',
			'已退款',
			'已作废',
			'已删除'
		],
		norder_no: '',
		token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg'
	},
	onLoad(e) {
		wx.showLoading({
			title: "加载中",
			mask: true
		});
		this.setData({
			norder_no: e.no
		})
		this.queryOrderDetail(e.no);
	},
	cancel() {
		wx.showModal({
		  title: '',
		  content: '确定取消该订单',
		  success: res=>{
		    if (res.confirm) {
			    this.cancelOrder(this.data.norder_no);
		    }
		  }
		})
	},
	receive() {
		wx.showModal({
			title: '',
			content: '确定已收货?',
			success: res=>{
				if (res.confirm) {
					this.receiveOrder(this.data.norder_no);
				}
			}
		})
	},
	// 获取订单详情
	queryOrderDetail(orderNo) {
		var token = this.data.token
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/order/' + orderNo,
			header: {
				Authorization: token
			},
			success: res => {
				res = res.data;
				this.setData({
					order: res.data
				})
			},
			fail: err => {
				wx.showModal({
					title: '',
					content: '请求失败，请稍后重试'
				})
			},
			complete: res => {
				wx.hideLoading();
			}
		})
	},
	// 取消订单
	cancelOrder(orderNo) {
		var token = this.data.token;

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/shopping/order/cancel',
			header: {
				Authorization: token
			},
			method: 'POST',
			data: {
				order_no: orderNo
			},
			success: res => {
				res = res.data;
				wx.showModal({
				    title: '',
				    content: res.message,
					showCancel: false,
				    success: res => {
				    if (res.confirm) {
					    this.queryOrderDetail(orderNo);
				    }
				  }
				})
			},
			fail: err => {
				wx.showModal({
					title: '',
					content: '取消订单失败, 请检查您的网络状态',
					showCancel: false
				})
			},
			complete: err => {
				if (err.statusCode == 404) {
					wx.showModal({
						title: '',
						content: '接口不存在',
						showCancel: false
					})
				}
			}
		})
	},
	// 确认收货
	receiveOrder(orderNo) {
		var token = this.data.token;

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/shopping/order/received',
			header: {
				Authorization: token
			},
			method: 'POST',
			data: {
				order_no: orderNo
			},
			success: res => {
				res = res.data;
				wx.showModal({
					title: '',
					content: res.message,
					showCancel: false,
					success: res => {
						if (res.confirm) {
							this.queryOrderDetail(orderNo);
						}
					}
				})
			},
			fail: err => {
				wx.showModal({
					title: '',
					content: '取消订单失败, 请检查您的网络状态',
					showCancel: false
				})
			},
			complete: err => {
				if (err.statusCode == 404) {
					wx.showModal({
						title: '',
						content: '接口不存在',
						showCancel: false
					})
				}
			}
		})
	}
})