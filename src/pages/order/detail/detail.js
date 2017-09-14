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
		refundStatus:[
            '待审核',
			'审核通过',
			'拒绝申请',
			'已完成',
			'已关闭',
			'等待买家退货',
			'买家已退货',
			'等待商城发货'
		],
		norder_no: '',
	},
	onShow(){
        wx.showLoading({
            title: "加载中",
            mask: true
        });
        this.queryOrderDetail(this.data.norder_no);
	},
	onLoad(e) {
		this.setData({
			norder_no: e.no
		})
	},
    applyRetreat(e){
        wx.navigateTo({
            url: '/pages/afterSales/apply/apply?no=' + e.currentTarget.dataset.no+'&id='+e.currentTarget.dataset.id
        })
	},
    jumpRetreat(e){
        var refund_no=e.currentTarget.dataset.no;
        wx.navigateTo({
            url: '/pages/afterSales/detail/detail?no='+refund_no
        })
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
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/order/' + orderNo,
			header: {
				Authorization: token
			},
			success: res => {
				if (res.statusCode = 200) {
					res = res.data;
					this.setData({
						order: res.data
					})
				} else {
					wx.showModal({
						title: '',
						content: '请求失败，请稍后重试'
					})
				}
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
		var token = wx.getStorageSync('user_token');

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
				if (res.statusCode == 200) {
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
				} else {
					wx.showModal({
						title: '',
						content: '取消订单失败, 请检查您的网络状态',
						showCancel: false
					})
				}
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
		var token = wx.getStorageSync('user_token');

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
				if (res.statusCode == 200) {
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
				} else {
					wx.showModal({
						title: '',
						content: '取消订单失败, 请检查您的网络状态',
						showCancel: false
					})
				}
			},
			fail: err => {
				wx.showModal({
					title: '',
					content: '取消订单失败, 请检查您的网络状态',
					showCancel: false
				})
			}
		})
	}
})