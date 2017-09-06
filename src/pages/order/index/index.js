import {config} from '../../../lib/myapp.js'
Page({
	data: {
		activeIndex: 0,
		sliderOffset: 0,
		sliderLeft: 0,
		width: 0,
		tabList: [
			{
				title: "全部",
				init: false,
				page: 0,
				more: true,
				show: false
			},
			{
				title: "待付款",
				init: false,
				page: 0,
				more: true,
				show: false
			},
			{
				title: "待发货",
				init: false,
				page: 0,
				more: true,
				show: false
			},
			{
				title: "待收货",
				init: false,
				page: 0,
				more: true,
				show: false
			},
		],
		dataList: {
			0: [],
			1: [],
			2: [],
			3: []
		},
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
		showText: '正在加载下一页数据',
		token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg'
	},
	onLoad() {
		wx.showLoading({
			title: "加载中",
			mask: true
		});
		wx.getSystemInfo({
			success: res => {
				this.setData({
					width: res.windowWidth / this.data.tabList.length,
					sliderOffset: res.windowWidth / this.data.tabList.length * this.data.activeIndex
				})
			}
		});
		this.orderList();
	},
	tabClick(e) {

		var status = e.currentTarget.id;
		this.setData({
			sliderOffset: e.currentTarget.offsetLeft,
			activeIndex: status
		});
		if (!this.data.tabList[status].init) {
			wx.showLoading({
				title: "加载中",
				mask: true
			});

			this.orderList(0, status);
		}
	},
	delete(e) {
		wx.showModal({
			title: '',
			content: '是否删除该订单',
			success:res => {
				if (res.confirm) {
					wx.request({
						url: config.GLOBAL.baseUrl + 'api/shopping/order/delete',
						method: 'POST',
						header: {
							Authorization: this.data.token
						},
						data: {
							'order_no': e.currentTarget.dataset.no
						},
						success: res => {
							wx.showToast({
							  title: res.message
							})
						}
					})
				}
			}
		})
		console.log(e);
	},
	onReachBottom(e) {
		var status = this.data.activeIndex
		var page = this.data.tabList[status].page + 1;
		var tabList = `tabList[${status}]`;
		if (this.data.tabList[status].more) {
			this.setData({
				[`${tabList}.show`]: true
			})
			this.orderList(0,status,page);
		} else {
			wx.showToast({
				title: '再拉也没有啦'
			});
		}
	},
	orderList(offline = 0, status = 0, page = 1, type = 0) {
		var token = this.data.token;
		// var token = wx.getStorageSync('token');
		var params = status ? { status  } : {  };
		params.page = page;
		params.type = type;
		params.offline = offline;

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/order/list',
			header: {
				Authorization: token
			},
			data: params,
			success: res => {
				res = res.data;
				var list;
				var page = res.meta.pagination;
				var current_page = page.current_page;
				var total_pages = page.total_pages;
				if (current_page === 1) {
					list = res.data;
				} else {
					list = this.data.dataList[status].concat(res.data);
				}
				var tabList = `tabList[${status}]`;
				this.setData({
					[`dataList.${status}`]: list,
					[`${tabList}.init`]: true,
					[`${tabList}.page`]: current_page,
					[`${tabList}.more`]: current_page < total_pages
				})
			},
			complete: err => {
				wx.hideLoading()
			}
		})
	}
})