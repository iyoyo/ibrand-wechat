import {config} from '../../../lib/myapp.js'
Page({
	data: {
		storeList: [],
		text: '',
		clear:true,
		searches: [],
		show: true,
		meta: ''
	},
	onReady() {
		var searches = wx.getStorageSync('goods_search_history');
		if (searches.length) {
			this.setData({
				searches: searches
			})
		}
	},
	onReachBottom() {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			var query = {
				keyword: this.data.text
			};
			var page = this.data.meta.pagination.current_page + 1;
			this.querySearchList(query,page);
		} else {
			wx.showToast({
				title: '再拉也没有啦'
			});
		}

	},
	jump(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/store/detail/detail?id=' + id
		})
	},
	search(e) {
		this.setData({
			text: e.detail.value,
			clear: e.detail.value <= 0
		})
	},
	clear() {
		this.setData({
			text: '',
			clear: true
		})
	},
	// 单击搜索
	searchKeywords() {

		var keyword = this.data.text;
		if (!keyword || !keyword.length) return;
		var searches = JSON.parse(JSON.stringify(this.data.searches));
		for (let i = 0, len = searches.length; i < len; i++) {
			let  search = searches[i];
			if (search === keyword) {
				searches.splice(i, 1);
				break;
			}
		}

		searches.unshift(keyword);
		wx.setStorageSync('goods_search_history', searches);

		wx.setNavigationBarTitle({
			title: '搜索：' + "'" + keyword + "'"
		})
		this.querySearchList({keyword: keyword});

		this.setData({
			show: false,
			searches: searches
		})

	},
	// 点击单个搜索记录搜索
	searchHistory(e) {

		var searches = JSON.parse(JSON.stringify(this.data.searches));
		var keyword = searches[e.currentTarget.dataset.index];

		searches.splice(e.currentTarget.dataset.index, 1);
		searches.unshift(keyword);


		wx.setStorageSync('goods_search_history', searches);

		wx.setNavigationBarTitle({
			title: '搜索：' + "'" + keyword + "'"
		})
		this.querySearchList({keyword: keyword});

		this.setData({
			show: false,
			searches: searches,
			text: keyword
		});
	},
	// 删除单个搜索记录
	removeSearchHistory(e) {
		var searches = JSON.parse(JSON.stringify(this.data.searches));

		searches.splice(e.currentTarget.dataset.index, 1);

		wx.setStorageSync('goods_search_history', searches);

		this.setData({
			searches: searches
		})
	},
	// 清空搜索记录
	clearSearchHistory() {
		wx.removeStorageSync('goods_search_history');
		this.setData({
			show: false,
			searches:[]
		})
	},

	// 搜索商品
	querySearchList(query = {}, page = 1) {
		var params = Object.assign({}, query, { page });

		wx.showLoading({
			title: '加载中',
			mask: true
		});

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/store/list',
			data: params,
			success: res => {
				res = res.data;

				if (res.status) {
					// var keyReg = new RegExp('(' + this.data.text + ')(?!</i>)', 'g')
					// list.forEach(item => {
					// 	item.name = item.name.replace(keyReg, '<i>$1</i>');
					// })
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
	}
})