var app = getApp();
var page = getCurrentPages();
var Wxparse = require('../../../wxParse/wxParse.js');
Page({
	data: {
		detailData: '',
		detail: '',
		attributesList: {
			top: [],
			bottom: []
		},
		expands: {
			parameter: true,    //商品参数
			recommend: true,    //推荐搭配
			commodity: true,    //商品详情
			story: true,    //产品故事
			interest: true,    //TA们也感兴趣
			like: true,    //猜你喜欢
			history: true     //历史浏览
		},
		showToTop: false
	},
	// onPageScroll(e) {
	// 	this.setData({
	// 		showToTop: e.scrollTop > 200
	// 	})
	// },
	onLoad(e){
		wx.showLoading({
			title: "加载中",
			mask: true
		})
		wx.request({
			url: app.data.url + 'store/detail/' + e.id,
			data: {
				include: 'photos,products,oneComment,guessYouLike,whoLike,point'
			},
			success: res => {
				res = res.data;
				Wxparse.wxParse('detailI', 'html', res.data.content, this, 0);
				this.setData({
					detailData: res
				});
				this.attributesList(res.meta);
				wx.setNavigationBarTitle({
					title: res.data.name
				})
				wx.hideLoading()
			},
			fail: err => {
				wx.hideLoading()
			}
		})
	},
	change(e) {
		var  expands = this.data.expands[e.currentTarget.dataset.type];
		this.setData({
			[`expands.${e.currentTarget.dataset.type}`]: !expands
		})
		// console.log(this.data.expands);
		// if (e.currentTarget.dataset.type == "parameter") {
		//
		// 	if (this.data.expands.parameter) {
		// 		this.setData({
		// 			'expands.parameter': false
		// 		})
		// 	} else {
		// 		this.setData({
		// 			'expands.parameter': true
		// 		})
		// 	}
		// } else if (e.currentTarget.dataset.type == "commodity") {
		// 	if (this.data.expands.commodity) {
		// 		this.setData({
		// 			'expands.commodity': false
		// 		})
		// 	} else {
		// 		this.setData({
		// 			'expands.commodity': true
		// 		})
		// 	}
		// } else if (e.currentTarget.dataset.type == "like") {
		// 	if (this.data.expands.like) {
		// 		this.setData({
		// 			'expands.like': false
		// 		})
		// 	} else {
		// 		this.setData({
		// 			'expands.like': true
		// 		})
		// 	}
		// }

	},
	attributesList(meta) {
		var topList = [];
		var bottomList = [];

		if (meta && meta.attributes) {
			var attributes = meta.attributes;
			for (var item of attributes) {
				if (item.is_chart === 1) {
					bottomList.push(item);
				} else {
					topList.push(item);
				}
			}
		}
		this.setData({
			'attributesList.top': topList,
			'attributesList.bottom': bottomList
		})
	},
	jump(e) {
		wx.navigateTo({
			url: '/pages/store/detail/detail?id=' + e.currentTarget.dataset.id
		})
	},
	bigImg(e) {
		var srcList = [];
		var src = e.currentTarget.dataset.url;
		this.data.detailData.data.photos.forEach(i => {
			srcList.push(i.url);
		});
		if (src && srcList.length) {
			wx.previewImage({
				current: src,
				urls: srcList
			})
		}

	},
	// goTop(e) {
	// 	wx.pageScrollTo({
	// 		scrollTop: 0
	// 	})
	// }

})