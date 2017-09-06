
var Wxparse = require('../../../component/wxParse/wxParse');
var app = getApp();
import {config,weapp} from '../../../lib/myapp.js'
const {request} = weapp(wx)

import {
    connect,
    bindActionCreators,
    store,
    actions,
    sandBox
} from '../../../lib/myapp.js'
import Animation from '../../../utils/animation.js'

let args = {
    data: {
        id:'',
        skuTable:{},
        price:0,
        commodity:{},
        detailData:{},
        specs:[],
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
        show_select: true, //选尺寸
        select_product: {}, //当前选中商品
        store_count:0,
        select_count:1,
        is_login:true,

        canBuy:false,
        query:{},
        animationSelect:{}
    },


    onStateChange(nextState){
        console.log(sandBox)
        if (!app.isEmptyObject(nextState.detailData)) {
            Wxparse.wxParse('detailI', 'html', nextState.detailData.data.content, this, 0);
            this.attributesList(nextState.detailData.meta);
            wx.setNavigationBarTitle({
                title: nextState.detailData.data.name
            })
            this.setData({
                detailData:nextState.detailData,
                commodity:nextState.detailData.data
            })
            wx.hideLoading()
        }

        // if (nextState.commoditySpec.length > 0 ) {
        //
        //     this.setData({
        //         specs:nextState.commoditySpec
        //     })
        // }
        //
        // if (!app.isEmptyObject(nextState.resultStore)) {
        //     this.specStore(nextState.resultStore,nextState.resultStore.key)
        //

        // }

    },
    onLoad(e){
        console.log(e.id)
        this.setData({
            query:e
        })
        wx.showLoading({
            title: "加载中",
            mask: true
        })

		this.getGoodsDetail(e.id)
        this.queryCommodityStore(e.id)



    },
    change(e) {
        var  expands = this.data.expands[e.currentTarget.dataset.type];
        this.setData({
            [`expands.${e.currentTarget.dataset.type}`]: !expands
        })

    },

    showSelect(e){
        this.setData({
            show_select:false
        })

        var animation = new Animation('show');
        animation.down()
    },
    closeSelect(){



        var animation = new Animation('show');
        animation.up().then(() => {
            this.setData({
                show_select:true
            })
        })



    },

    modifyCount(){
        var val = this.data.select_count;
        if (!val) {
            val = 1;
        } else if (!/^[1-9]\d*$/.test(val)) {
            val = val.replace(/[^\d].*$/, '');
            val = parseInt(val) || 1;
        }

        if (val < 0) {
            val = 1;
        } else if (val > this.data.store_count) {
            val = parseInt(this.data.store_count);
        }

        this.setData({
            select_count:val
        })

    },
    selectSpec(e){

        var spec = {
            key:e.currentTarget.dataset.key,
            index:e.currentTarget.dataset.index,
            disabled:Number(e.currentTarget.dataset.disabled),
            active:Number(e.currentTarget.dataset.active),
            id:Number(e.currentTarget.dataset.id)
        };

        if (spec.disabled) return;
        var specs = this.data.specs;
        if (!spec.active) {
            for (let item of specs[spec.index].values) {
                if (item.active) {
                    item.active = false;
                    break;
                }
            }
        }

        specs[spec.index].values[spec.key].active =  !specs[spec.index].values[spec.key].active
        spec.active = !spec.active;
        specs[spec.index].select = spec.active ? spec.id : '';


        this.setData({
            specs:specs
        })
        var id = this.data.query.id;
        this.queryCommodityStore(id, spec.index);
    },

    specStore(result, key) {
        var query = this.data.query;
        var data = result.data;
        var specs = this.data.specs

        if (key === undefined) {
            specs.forEach(spec => {
                for (let v of spec.values) {
                    v.disabled = !data[v.id] || data[v.id].count == 0;
                }
            });


            this.setData({
                specs:specs,
                skuTable:result.table
            })

            specs.forEach(spec => {

                let name = 'spec[' + spec.id + ']';
                if (query[name]) {
                    let id = query[name];

                    for (let v of spec.values) {
                        if (v.id == id && !v.disabled && data[v.id] && data[v.id].count) {
                            v.active = true;
                            spec.select = v.id;
                            this.setData({
                                specs:specs
                            })
                            this.specStore(result,v.index)

                            return;
                        }
                    }
                }

                if (!spec.select) {
                    for (let v of spec.values) {
                        if (!v.disabled && data[v.id] && data[v.id].count) {
                            v.active = true;
                            spec.select = v.id;
                            this.setData({
                                specs:specs
                            })
                            // this.$emit('specStore', result, v.index);
                            this.specStore(result,v.index)

                            return;
                        }
                    }
                }

            });


            return;
        }

        var spec = specs[key];
        if (spec.select) {
            this.setData({
                store_count: data[spec.select].count
            })

            for (let i = 0; i < specs.length; i++) {
                if (i === key) continue;

                let s = specs[i];
                s.values.forEach(v => {
                    v.disabled = !data[spec.select].specs[v.id].count;
                });

                if (s.select) {
                    this.data.store_count = data[spec.select].specs[s.select].count;
                }
            }
        } else {

            this.setData({
                store_count:this.data.commodity.store
            })


            for (let i = 0; i < specs.length; i++) {
                if (i === key) continue;

                let s = specs[i];
                s.values.forEach(v => {
                    v.disabled = !data[v.id] || !data[v.id].count;
                });

                if (s.select) {
                    this.setData({
                        store_count:data[s.select].count
                    })

                }
            }
        }

        if (this.data.select_count > this.data.store_count) {
            this.setData({
                select_count:String(this.data.store_count)
            })

        } else if (this.data.select_count === 0) {
            this.setData({
                select_count:'1'
            })
        }
        this.setData({
            specs:specs,
        })


        var canBuy = this.disallow_cart()

        console.error(this.data.select_product)
        this.setData({
            canBuy:canBuy
        })
    },

    confirm(){

        if (this.disallow_cart()) return;


        var select_product = this.data.select_product;

        var data = this.data.specs.length ? {
            id: select_product.id,
            name: this.data.commodity.name,
            qty: 1,
            store_count: this.data.store_count,
            price: select_product.price,
            attributes: {
                img: select_product.img,
                size: select_product.size,
                color: select_product.color,
                com_id: this.data.commodity.id
            }
        } : {
            id: this.data.commodity.id,
            name: this.data.commodity.name,
            qty: this.data.select_count,
            store_count: this.data.store_count,
            price: this.data.commodity.price,
            attributes: {
                img: this.data.commodity.img,
                com_id: this.data.commodity.id
            }
        };

        // if (this.channel) data.attributes.channel = 'employee';
        if (select_product.sku) data.attributes.sku = select_product.sku;


        // 判断是否登录
        // var is_login = !!Cache.get(cache_keys.token);
        if (this.data.is_login) {
            this.appendToCart(data);
            // this.addStoreNum();
        } else {
            data.local = true;
            data.total = Number(data.qty) * Number(data.price);
            data.color = data.attributes.color;
            data.size = data.attributes.size;
            data.img = data.attributes.img;

            var locals = wx.getStorageSync('cart') || [];
            locals.unshift(data);

            var skus = {};
            var save = [];
            locals.forEach(v => {
                let sku, index;
                if (v.attributes && v.attributes.sku) {
                    sku = v.attributes.sku;
                } else {
                    sku = v.id;
                }

                if (skus[sku] === undefined) {
                    index = save.length;
                    v.index = index;
                    v.checked = true;
                    save.push(v);
                    skus[sku] = index;

                } else {
                    let i = skus[sku];
                    save[i].qty += v.qty;
                    save[i].total += v.total;
                    save[i].store_count = this.store_count;

                }
            });
            console.log(skus, save)

            wx.setStorageSync('cart', save);

            this.store_num = 0;
            this.addStoreNum();
            this.addCart(true)
        }
    },
    addStoreNum() {

        // 判断是否登录
        // var is_login = !!Cache.get(cache_keys.token);
        // var cache_store_num = Cache.get(cache_keys.cart);
        if (this.data.is_login) {
            this.queryShoppingCount();
        } else {
            if (cache_store_num && cache_store_num.length) {

                cache_store_num.forEach(v => {
                    this.store_num += v.qty;
                })
            }
        }
    },
    disallow_cart() {
        if (!this.data.specs.length) {
            return !this.data.store_count;
        }

        var ids = [], select_product = {} ,specs = this.data.specs;
        for (let spec of specs) {
            if (!spec.select) {
                this.setData({
                    price:this.data.commodity.sell_price,
                    select_product:null
                })
                return true;
            }

            ids.push(spec.select);
            for (let v of spec.values) {
                if (v.id === spec.select) {
                    switch (spec.id) {
                        case 2:
                            select_product.img = v.img;
                            select_product.color = v.alias || v.value;
                            break;
                        default:
                            select_product.size = v.value;
                    }

                    break;
                }
            }
        }

        if (this.data.skuTable) {
            ids = ids.sort((a, b) => a > b).join('-');
            select_product = Object.assign(select_product, this.data.skuTable[ids]);
        }

        this.setData({
            price:select_product.price,
            select_product:select_product
        })

        return false;
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
    queryCommodityStore(id, key){
        var that = this;
        sandBox.get({api:`api/store/detail/${id}/stock`})
            .then(res => {

                res = res.data
                if (!res.status || !res.data || !res.data.specs) return;
                if (res.data.specs && typeof key === 'undefined') {
                    let specs = [];

                    Object.keys(res.data.specs)
                        .forEach((key, index) => {
                            let value = res.data.specs[key];
                            value.select = '';
                            value.values = value.list
                                .map(v => {
                                    return Object.assign({
                                        index: index,
                                        active: false,
                                        disabled: false
                                    }, v);
                                });

                            delete value.list;
                            specs.push(value);
                        });

                    that.setData({
                        specs:specs
                    })
                }

                if (res.data.stores) {
                    let data = {};
                    Object.keys(res.data.stores)
                        .forEach(key => {
                            let value = res.data.stores[key];

                            value.ids.forEach(id => {
                                data[id] = data[id] || {count: 0, specs: {}};
                                data[id].count += parseInt(value.store);

                                value.ids.forEach(i => {
                                    if (i === id) return;

                                    data[id].specs[i] = {
                                        count: parseInt(value.store)
                                    };
                                })
                            });
                        });
                    // console.log(data);
                    var result = {data, table: res.data.stores};


                    that.specStore(result,key)
                    // this.$emit('specStore', result, key);
                }

            })
            .catch(err => {

            })
    },
    queryShoppingCount(){

        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/cart/count`,
            header:{Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg'},
            method:'GET',
            success:function(res){

            },
            fail: function(){

            }
        })
    },
    appendToCart(data){

        if (!Array.isArray(data)) {
            data = [data];
        }

        var json = {};
        data.forEach((v, i) => json[i] = v);
        data = json;
        var that = this;
        wx.request({
            url:config.GLOBAL.baseUrl+'api/shopping/cart',
            header:{Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg'},
            method:'POST',
            data:data,
            success:function(res){
                res = res.data
                if (res.status) {
                    that.addCart(true);
                } else {
                    that.addCart(false,res.message)
                }
            },
            error:function(){
                that.addCart(false)
            }
        })
    },
    addCart(success, message) {
        // this.$refs.button.finish();
        if (success) {
            this.closeSelect()
            wx.showModal({
                title:'提示',
                content:'添加到购物车成功！',
                cancelText:'继续购物',
                confirmText:'购物车',
                success:function (res){
                    if (res.confirm) {
                        wx.navigateTo({
                            url:'/pages/store/order/order'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                },
                fail:function(){

                }
            })

            // if (typeof window.__analytics == 'function') {
            //     console.log('11212132323')
            //     var cart = {
            //         action :'add to cart',
            //         product:{
            //             sku: this.$brand.name == 'JackWolfskin' ? this.select_product.id :this.select_product.sku,
            //             title: this.commodity.name,
            //             category: this.commodity.tags,
            //             quantity: this.store_count
            //         }
            //     }
            //
            //     window.__analytics({cart})
            // }
        } else {
            if (message) {
                wx.showToast({
                    title:message,
                })
            } else {
                wx.showToast({
                    title:'添加到购物车失败，请重试',
                })
            }
        }

    }
}



const page = connect.Page(
    store(),
    (state) => {return {detailData: state.goods_detail}} ,
    (dispatch) => {
        return {
            getGoodsDetail: bindActionCreators(actions.getGoodsDetail, dispatch,'GOODS_DETAIL'),
            // queryCommodityStore: bindActionCreators(actions.queryCommodityStore, dispatch ,'COMMODITYSTORE','COMMODITYSPECS')
        }
    }
)

Page(page(args))