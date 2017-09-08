
var Wxparse = require('../../../component/wxParse/wxParse');
var app = getApp();
import {config,getUrl} from '../../../lib/myapp.js'

import {
    weapp,
    connect,
    bindActionCreators,
    store,
    actions
} from '../../../lib/myapp.js'


let args = {
    data: {
        detailData:{},
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
        showToTop: false,
	    is_Fav: false,
	    id: ''
    },

	onLoad(e){
		wx.showLoading({
			title: "加载中",
			mask: true
		})
		this.setData({
			id: e.id,
		});
		this.getGoodsDetail(e.id);
		this.queryFavoriteStatus(e.id, 'goods');
	},
	changeStatus() {
		var token = wx.getStorageSync('user_token');
		if (token) {
			this.changeFavorite(this.data.id,'goods');
		} else {
			var url = getUrl();
			wx.showModal({
			  title: '',
			  content: '请先登录',
			  success: res=>{
			    if (res.confirm) {
			    	wx.navigateTo({
			    	  url: '/pages/user/register/register?url=' + url
			    	})
			    }
			  }
			})
		}

	},
	onStateChange(nextState){
		console.log(nextState)
		if (!app.isEmptyObject(nextState.detailData)) {
			Wxparse.wxParse('detailI', 'html', nextState.detailData.data.content, this, 0);
			this.attributesList(nextState.detailData.meta);
			wx.setNavigationBarTitle({
				title: nextState.detailData.data.name
			})
			this.setData({
				detailData:nextState.detailData
			})
			wx.hideLoading()
		}

	},
	change(e) {
		var  expands = this.data.expands[e.currentTarget.dataset.type];
		this.setData({
			[`expands.${e.currentTarget.dataset.type}`]: !expands
		})

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
		if (e.currentTarget.dataset.type == 'shop') {
			wx.navigateTo({
				url: '/pages/store/list/list'
			})
		} else if (e.currentTarget.dataset.type == 'cart') {
			wx.navigateTo({
				url: '/pages/store/cart/cart'
			})
		} else {
			wx.navigateTo({
				url: '/pages/store/detail/detail?id=' + e.currentTarget.dataset.id
			})
		}

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


    // 查询是否收藏改商品
	queryFavoriteStatus(id, type) {
		var token = wx.getStorageSync('user_token');
        if (!token) return;

        wx.request({
            url: config.GLOBAL.baseUrl + 'api/favorite/isfav',
            header: {
                Authorization: token
            },
            data: {
	            favoriteable_id: id,
	            favoriteable_type: type
            },
            success: res => {
                res = res.data;

                if (res.status) {
                    this.setData({
	                    is_Fav: !!res.data.is_Fav
                    })
                } else {
	                wx.showToast({
		                image: '../../../assets/image/error.png',
		                title: res.message
	                });
                }
            }
        })
    },
    // 改变收藏状态
	changeFavorite(id, type) {
		var token = wx.getStorageSync('user_token');

	    wx.request({
	        url: config.GLOBAL.baseUrl + 'api/favorite/store',
		    method: 'POST',
            header: {
	            Authorization: token
            },
            data: {
	            favoriteable_id: id,
	            favoriteable_type: type
            },
            success: res => {
	            res = res.data;

	            if (res.status) {
	                this.setData({
	                	is_Fav: !this.data.is_Fav
                    })
                }
            }
        })
    }
}

console.log(store())

const page = connect.Page(
    store(),
    (state) => {console.log(state);return {detailData: state.goods_detail}} ,
    (dispatch) => {
        return {
            getGoodsDetail: bindActionCreators(actions.getGoodsDetail, dispatch,'GOODS_DETAIL')
        }
    }
)

Page(page(args))