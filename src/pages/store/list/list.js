var app = getApp();
import {config} from '../../../lib/myapp.js'
Page({
	data: {
		page: 1,
		storeList: [],
		orderBy: 'updated_at',
		sort: 'desc',
		c_id:'',
		meta: '',
		show: false
	},
	onLoad(e) {
		if (e.c_id) {
			this.setData({
				c_id: e.c_id
			})
		}
		if (e.orderBy) {
			this.setData({
				orderBy: e.orderBy,
				sort: e.sort
			})
		}

	},
	onReady() {
		wx.showLoading({
			title: '加载中',
			mask: true
		});

		var query = {
			sort: this.data.sort,
			orderBy: this.data.orderBy,
			c_id: this.data.c_id
		};

		this.queryCommodityList(query);
	},
	changeOrderBy(e) {
		var field = e.currentTarget.dataset.type;
		if (this.data.orderBy === field) {
			this.setData({
				sort: this.data.sort === 'desc' ? 'asc' : 'desc'
			})
		} else {
			this.setData({
				orderBy: field,
				sort: 'desc'
			})
		}

		wx.redirectTo({
			url: '/pages/store/list/list?orderBy=' + this.data.orderBy + '&sort=' + this.data.sort + '&c_id=' + this.data.c_id
		})

	},
	jump(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/store/detail/detail?id=' + id
		})
	},
	search() {
		wx.navigateTo({
			url: '/pages/store/search/search'
		})
	},
	cart() {
		wx.navigateTo({
			url: '/pages/store/cart/cart'
		})
	},
	onReachBottom() {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			this.setData({
				show: true
			})
			var query = {
				sort: this.data.sort,
				orderBy: this.data.orderBy,
				c_id: this.data.c_id
			};
			var page = this.data.meta.pagination.current_page + 1;
			this.queryCommodityList(query,page);
		} else {
			wx.showToast({
				image: '../../../assets/image/error.png',
				title: '再拉也没有啦'
			});
		}

	},
	loadMore() {
		wx.request({
			url: config.GLOBAL.baseUrl + "api/store/list?page=" + (this.data.page + 1),
		})
	},
	// 查询商品列表
	queryCommodityList(query = {}, page = 1) {
		var params = Object.assign({}, query, {page});


		wx.request({
			url: config.GLOBAL.baseUrl + 'api/store/list',
			data: params,
			success: res => {
				res = res.data;
				if (res.status) {
					this.setData({
						[`storeList.${page - 1}`]: res.data,
						meta: res.meta
					})
				} else {
					wx.showModal({
						title: '',
						content: res.message
					})
				}

			},
			complete: err => {
				this.setData({
					show: false
				})
				wx.hideLoading();
			}
		})
	}
})