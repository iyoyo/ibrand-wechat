Page({
	data: {
		storeList: {},
		text: '',
		clear:true,
		searches: wx.getStorageSync('goods_search_history') || [],
		show: true
	},
	onReady() {
		wx.showLoading({
			title: '加载中',
			mask: true
		});
		wx.request({
			url: "http://api.dev.tnf.ibrand.cc/api/store/list",
			success:res=>{
				res = res.data;
				this.setData({
					storeList: res
				});
				wx.hideLoading()
			},
			fail: err => {
				wx.hideLoading()
			}
		});
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

		this.setData({
			show: false,
			searches: searches
		})

	},
	searchHistory(e) {

		var searches = JSON.parse(JSON.stringify(this.data.searches));
		var keyword = searches[e.currentTarget.dataset.index];

		searches.splice(e.currentTarget.dataset.index, 1);
		searches.unshift(keyword);


		wx.setStorageSync('goods_search_history', searches);

		this.setData({
			show: false,
			searches: searches
		})
	},
	removeSearchHistory(e) {
		var searches = JSON.parse(JSON.stringify(this.data.searches));

		searches.splice(e.currentTarget.dataset.index, 1);

		wx.setStorageSync('goods_search_history', searches);

		this.setData({
			searches: searches
		})
	},
	clearSearchHistory() {
		wx.removeStorageSync('goods_search_history');
		this.setData({
			show: false,
			searches:[]
		})
	}
})