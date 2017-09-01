
var Wxparse = require('../../../component/wxParse/wxParse');
var app = getApp();
import {config} from '../../../lib/myapp.js'

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
        showToTop: false
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
    onLoad(e){
        wx.showLoading({
            title: "加载中",
            mask: true
        })


		this.getGoodsDetail(e.id)
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