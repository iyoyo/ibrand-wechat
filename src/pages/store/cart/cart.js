var app = getApp();

import {
    config, getUrl, weapp,

    connect,
    bindActionCreators,
    store,
    actions,
    sandBox
} from '../../../lib/myapp.js'
var args = {
    data: {
        is_login: '',
        list:[],
        groupList:[],
        select_products:{},
        allCheck:true,
        channel:'normal',
        loading:false
    },
    onShow () {
        // var oauth = Cache.get(cache_keys.token);
        // var locals = Cache.get(cache_keys.cart);
        var is_login = wx.getStorageSync('user_token');
        this.setData({
            is_login:is_login,
            loading:false
        })
        var oauth = this.data.is_login;
        var locals = wx.getStorageSync('cart')
        if (oauth && locals && locals.length) {
            // 提交本地购物车
            this.appendToCart(locals);
        } else {
            this.queryCartList();
        }
    },
    select_product() {
        var data = {
            count:0,
            total:0,
            __ids:[]
        }

        this.data.list.forEach((v) => {
            if (v.checked) {
                data.count += parseInt(v.qty);
                data.total += Number(v.total);
                data.__ids.push(v.__raw_id || v.index);
            } else {
                this.setData({
                    allCheck:false
                })
            }
        })

        this.setData({
            select_products:data
        })
    },
    addCart(success, message) {
        // this.$refs.button.finish();
        this.setData({
            loading:false
        })
        if (success) {

            wx.removeStorageSync('cart')

            // TODO
            //this.$emit('readyCheckout');
            this.queryCartList();

        } else {

            wx.showModal({
                title:message || '保存本地购物车失败,请重试！'
            })
        }
    },

    order(){
        var data = this.data.select_products;
        if (!data.count) {
            // this.$refs.button.finish();
            return
        };
        this.setData({
            loading:true
        })
        var oauth = this.data.is_login
        if (!oauth) {
            // 滚去登录

            // this.$router.go({ name: 'user-quick-login', query: { source: this.$route.path } });
            wx.navigateTo({
                url:'/pages/user/register/register'
            })
            return;
        }

        var locals = wx.getStorageSync('cart');
        if (locals && locals.length) {
            // 提交本地购物车
            this.appendToCart(locals);
            return;
        }

        this.readyCheckout()
    },

    readyCheckout() {
        var ids = this.data.select_products.__ids;
        var type = this.data.channel;
        this.checkoutOrder(ids, type);
    },
    checkoutOrder(ids,type){
        var oauth = this.data.is_login;
        var cart_ids = ids.filter(id => id);
        var that = this
        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/order/checkout`,
            data:{ cart_ids, type },
            header: {Authorization: oauth},
            method:'POST',
            success:function (res){
                res = res.data;
                if (res.status) {
                    // Cache.set(cache_keys.order, res.data);
                    wx.setStorageSync('local_order',res.data)
                    that.checkout(true)
                } else {
                   that.checkout(false, '库存数量不够');
                }
            }
        })
    },
    checkout (success, message) {
        // this.$refs.button.finish();
        if (success) {

            // this.$router.go({ name: 'store-order'});
            wx.navigateTo({
                url:'/pages/store/order/order',
            })

        } else {
            // this.$Alert(message || '结算失败，请重试!');
            wx.showToast({
                title:message || '结算失败,请重试！',
                image: '../../../assets/image/error.png'
            })
        }
    },
    queryCartList () {
        var data = wx.getStorageSync('cart') || [];
        // var oauth = Cache.get(cache_keys.token);
        var oauth = this.data.is_login

        if (!oauth) {
            this.setData({
                list:data
            })

            this.select_product()
            this.groupList()

            return
        }
        var that = this;
        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/cart`,
            header: {Authorization: oauth},
            success:function (res) {
                res = res.data
                var data = []
                if (res.status && res.data) {
                    data = Object.keys(res.data).map(key => {
                        res.data[key].checked = true;
                        return res.data[key];
                    }).concat(data);
                }
                that.setData ({
                    list:data
                })
                that.select_product()

                that.groupList()
            }
        })
    },
    updated(success,data,item,index){
        if (success) {
            item.qty = data.qty;
            item.total = data.total;
        } else {
            // TODO;
            item.qty = data.qty;
            item.total = item.qty * Number(item.price);
            wx.showToast({
                title:'超过最大库存',
                image: '../../../assets/image/error.png'
            })
        }
        console.log(item)
        var list = this.data.list
        list[index] = item

        this.setData({
            list:list
        })
        this.select_product()

        this.groupList()
    },
    change(item, data,index) {
        console.log(item)
        if (item.local) {
            var locals = wx.getStorageSync('cart') || [];
            locals[item.index].qty = data.qty;
            locals[item.index].total = data.total;
            // Cache.set(cache_keys.cart, locals, 0, null);
            wx.setStorageSync('cart',locals)
            // this.$emit('updated', true, data, item);
            this.updated(true,data,item,index)
        } else {
            // clearTimeout(this.data.countTimer);
            //
            // this.countTimer = setTimeout(() => {
            //     this.updateToCart(data, item);
            // }, 200);
            this.updateToCart(data, item,index);
        }
    },
    updateToCart (attr ,data,index) {

        var oauth = this.data.is_login;
        var that = this;
        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/cart/${data.__raw_id}`,
            data:{
                attributes: {
                    qty: attr.qty
                }
            },
            method:'PUT',
            header: {Authorization: oauth},
            success:function (res) {
                res = res.data;
                if (res.status !== false) {
                    // this.$emit('updated', true, attr, data);
                    that.updated(true,attr,data,index)
                } else {
                    // this.$emit('updated', false, { qty: res.data.stock_qty }, data);
                    that.updated(false,{ qty: res.data.stock_qty }, data,index)
                }
            }
        })
    },
    changeCount(e){

        var index = e.target.dataset.index,
            change = e.target.dataset.change,
            list = this.data.list,
            val = (parseInt(list[index].qty) || 0) + (parseInt(change) ? 1 : -1),
            store_count = list[index].store_count

        if (store_count == undefined) {
            if (val > 0 && val <= 99) {
                var data = {
                    qty: val,
                    total: val * Number(list[index].price)
                };
                this.change(list[index], data,index);
            }
        } else {
            if (val > 0 && val <= store_count) {
                var data = {
                    qty: val,
                    total: val * Number(list[index].price)
                };
                this.change(list[index], data,index);
            }  else {
                wx.showToast({
                    title:'超过最大库存',
                    image: '../../../assets/image/error.png'
                })
            }
        }

    },

    groupList() {
        if (this.data.list) {
            var data = [];
            var groups = {};

            this.data.list.forEach((v, i) => {
                let channel = v.channel || 'normal';
                if (groups[channel] !== undefined) {
                    data[groups[channel]].items.push(v);
                    data[groups[channel]].index.push(i);
                } else {
                    groups[channel] = data.length;
                    data.push({
                        channel,
                        items: [v],
                        checked: [],
                        index: [i]
                    });
                }
            });
        }

        this.setData({
            groupList:data
        })
    },

    appendToCart (data) {
        // var oauth = Cache.get(cache_keys.token);
        var oauth = this.data.is_login
        if (!oauth) return;

        if (!Array.isArray(data)) {
            data = [data];
        }

        var json = {};
        data.forEach((v, i) => json[i] = v);
        data = json;
        var that = this;
        wx.request({
            url: `${config.GLOBAL.baseUrl}api/shopping/cart`,
            data: data,
            method:'POST',
            header: {Authorization: oauth},
            success:function (res){
                res = res.data;
                if (res.status) {
                    that.addCart(true)
                } else {
                    that.addCart(false,res.message)
                }
            },
            fail:function (){
                that.addCart(false)
            }

        })
    },

    removeFromCart(e){
        var oauth = this.data.is_login;
        var index = e.target.dataset.index;
        var list = this.data.list;
        var data = list[index]
        var that = this;

        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/cart/${data.__raw_id}`,
            header: {Authorization: oauth},
            method:'DELETE',
            success:function (res) {
                res = res.data;

                that.removed(true,index)
            },
            fail:function () {
                that.removed(false)
            }
        })
    },

    removed (success,index){
        if (success) {

            var list = this.data.list
            var product = list.splice(index, 1)[0];
            this.setData({
                list:list
            })
            this.select_product()
            this.groupList();

        } else {
            wx.showToast({
                title:'删除购物车商品失败！',
                image: '../../../assets/image/error.png'
            })
        }
    },
    changeCheck (e) {
        var ids = e.detail.value;
        var list = this.data.list;

        list.forEach((item)=>{
            item.checked = false;
        })

        ids.forEach((item)=>{
            list[item].checked = true
        })

        this.setData({
            list:list
        })

        this.select_product();
        this.groupList()
    },
    selectAll(e){
        var allCheck = this.data.allCheck
        var list = this.data.list
        this.setData({
            allCheck:!allCheck
        })

        list.forEach((item)=> {item.checked = this.data.allCheck ? true : false})


        this.setData({
            list:list
        })
        this.select_product();
        this.groupList()
    }

}


const page = connect.Page(
    store(),
    (state) => {
    },
    (dispatch) => {
        return {}
    }
)

Page(page(args))