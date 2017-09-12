var app = getApp();
import {config} from '../../../lib/myapp.js';
import Animation from '../../../utils/animation';
Page({
	data: {
		page: 1,
		storeList: [],
		orderBy: 'updated_at',
		sort: 'desc',
		c_id:'',
		meta: '',
		show: false,
		showFilter: false,
		filter: null,
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


		var price = { min: '', max: '' };
		var shadows = { attr: {}, specs: {} };
		if (e.attr) {
			e.attr.forEach(v => shadows.attr[v] = true);
		}

		Object.keys(e).forEach(key => {
			let ret = /^specs\[([^\]]+)]$/.exec(key);
			if (ret) {
				let name = ret[1];
				shadows.specs[name] = e[key];
			}
		})

		var priceList = ['200-500', '501-1000', '1001-1500', '1501-2000', '2000-'];
		shadows.price = e.price || '';

		if (!~priceList.indexOf(shadows.price)) {
			var parts = shadows.price.split(/\s*\-\s*/);
			price.min = parts[0] || '';
			price.max = parts[1] || '';
		}

		this.setData({
			price: price,
			shadows: shadows,
			selections: {},
			priceList: priceList,
			priceCache: {}
		})
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
	scroll(e) {
		console.log(e);
	},
	// 价格点击
	checkPrice(e) {
		var num = e.currentTarget.dataset.num;
		if (this.data.shadows.price == num) {
			console.log("gaehgae");
			this.setData({
				'priceCache.value': num
			})
			if (this.data.priceCache.min !== undefined) {
				this.setData({
					'price.min': this.data.priceCache.min
				})
			}
			if (this.data.priceCache.max !== undefined) {
				this.setData({
					'price.min': this.data.priceCache.max
				})
			}

			this.setData({
				'shadows.price': ''
			})
		} else {
			console.log(46846846846846)
			if (this.data.price.min !== '') {
				this.setData({
					'priceCache.min': this.data.priceCache.min
				})
			}
			if (this.data.price.max !== '') {
				this.setData({
					'priceCache.max': this.data.priceCache.max
				})
			}

			this.setData({
				'price.min': '',
				'price.max': '',
				'shadows.price': num
			})
		}
	},
	// 价格输入
	modifyPrice(e) {
		var type = e.currentTarget.dataset.type
		var val = this.data.price[type ? 'max' : 'min'];
		val = parseFloat(val);
		if (isNaN(val)) val = '';
		if (this.data.price[type] == 'max') {
			this.setData({
				'price.max': val
			})
		} else {
			this.setData({
				'price.min': val
			})
		}
		this.setData({
			'shadows.price': ''
		})
	},
	// 点击筛选条件
	check(e) {
		var type = e.currentTarget.dataset.type;

		var id = type.id;
		var selections = Object.assign({}, this.data.selections);

		if (!selections[id]) {
			for (let k in selections) {
				if (selections.hasOwnProperty(k)) {
					let o = selections[k]
					if (o.type === type.type && o.key === type.key) {
						delete selections[k];
					}
				}
			}

			selections[id] = {
				key: type.key,
				type: type.type,
				value: type.value,
				field: type.field
			}
		} else {
			delete  selections[id];
		}

		this.setData({
			selections: Object.assign({}, selections)
		})
	},
	// 取消
	cancel() {

		var animation = new Animation('show');
		animation.right().then(() => {
			this.setData({
				showFilter: false,
				selections: {},
				shadows: {}
			});
		})
	},
	// 确定
	confirm() {
		var attr = [], specs = {};
		for (let k in this.data.selections) {
			if (this.data.selections.hasOwnProperty(k)) {
				let o = this.data.selections[k];
				if (o.type === 'attr') {
					attr.push(o.value);
				} else {
					specs['specs[' + o.field + ']'] = o.value;
				}
			}
		}
		var price = this.data.shadows.price;

		if (attr.length) {
			var query = Object.assign({}, {attr}, {c_id: this.data.c_id,orderBy: this.data.orderBy, sort: this.data.sort, price: price}, specs)
		} else {
			var query = Object.assign({},{c_id: this.data.c_id,orderBy: this.data.orderBy, sort: this.data.sort, price: price}, specs)
		}

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
		if (!this.data.showFilter)  {
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
		}
	},
	showFilter() {

		this.setData({
			showFilter: true
		})

		var animation = new Animation('show');
		animation.Pullleft();
		// var animation = new Animation("show");
		// animation.left().then(() => {
		// 	this.setData({
		// 		showFilter: true
		// 	})
		// })
	},
	move(e) {
		console.log(e);
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
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						// 商品列表页赋值
						this.setData({
							[`storeList.${page - 1}`]: res.data,
							meta: res.meta
						})
						// 右侧筛选赋值
						if (res.meta && res.meta.filter) {
							if (Array.isArray(res.meta.filter)) {
								this.setData({
									filter: null
								})
							} else {
								let filter = res.meta.filter;
								let list =[];

								if (filter.attr && filter.attr.keys) {
									let type = 'attr';

									filter.attr.keys.forEach(key => {

										let arr = [];
										let arrText = [];

										for (let attr in filter.attr.values[key]) {
											!!attr && arrText.push(filter.attr.values[key][attr])
											!!attr && arr.push(attr);
										}
										list.push({
											key,
											values: arr.map((v, index) => {
												return {id: [type, key, v].join('-'),key,type,value: v, text:arrText[index]}
											})
										});
									});
								}
								if (filter.specs && filter.specs.keys)  {
									let type = 'specs';
									filter.specs.keys.forEach(key => {
										let entries = key.split(':');
										let field = entries[1];
										key = entries[0];

										let specs = [];
										let specsText = [];
										for (let spec in filter.specs.values[key]) {
											!!spec && specsText.push(filter.specs.values[key][spec]);
											!!spec &&　specs.push(spec);
										}
										list.push({
											key,
											values: specs
												.map((v, index) => {
													return {id: [type, key, v].join('-'), key, type, field, value: v, text: specsText[index]}
												})
										});
									})
								}

								this.setData({
									filter: list
								})
							}
						}
					} else {
						wx.showModal({
							title: '',
							content: res.message,
							showCancel: false
						})
					}
				} else {
					wx.showModal({
						title: '',
						content: "请求失败",
						showCancel: false
					})
				}


			},
			fail: err => {
				wx.showModal({
				  title: '',
				  content: err,
				  success: res=>{
				    if (res.confirm) {

				    }
				  }
				})
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