var app = getApp();
import {
    connect,
    bindActionCreators,
    store,
    actions,
    sandBox,
    config
} from '../../../lib/myapp.js'

var args = {
    data: {
        loading:false,
        show: false,
        block: {
            order: {
                items: []
            },
            orderPoint: {
                pointAmount: 0,
                pointCanUse: 0
            },
            otherCoupon: {}
        },
        extra: {
            point: {}
        },
        form: {
            order_no: '',
            address: {},
            coupon: {},
            invoice: {},
            discount: {},
            point: 0,
            note: '',
            formStates: {},
            isDisabled: false   //是否禁用优惠折扣按钮
        },
        useList: [
            [
                {name: '不使用', value: 0},
                {name: '使用', value: 1}
            ]
        ],
        formStates: {
            discountsCheckIndex: -1,
            noDiscountsCheckList: -1,
            pointStatus: false,
        },
        temporary: {
            coupons: [],    //可选择的优惠券
            coupon: {}      //当前选择的优惠券
        },
        paymentMoneys: {
            discounts: {},
            total: 0
        },
        check: null,
        is_login:''
    },
    addInvoice(){
        wx.navigateTo({
            url:`/pages/store/invoice/invoice?order_no=${this.data.block.order.order_no}&url=${getCurrentPages()[getCurrentPages().length - 1].route}`,
        })
    },
    selectAddress () {

        wx.navigateTo({
            url:`/pages/address/list/list?order_no=${this.data.block.order.order_no}&url=${getCurrentPages()[getCurrentPages().length - 1].route}`,
        })
    },
    change(e) {

        this.setData({
            check: e.detail.value
        })

        var coupons = this.data.block.coupons
        var item = coupons[e.detail.value]

        var data = wx.getStorageSync('order_form')
        let exclusive = item.discount.exclusive
        if (!data) return;
        coupons.forEach((v, key) => v.checked = key == e.detail.value)


        if (Array.isArray(item.adjustments)) {
            item.adjustments.sort((a, b) => {
                return Math.abs(a.amount) < Math.abs(b.amount);
            });
        }
//                    排他
        if (exclusive) {
            data.formStates.discountsCheckIndex = -1;
            data.isDisabled = true;
        } else {
            data.isDisabled = false;
        }
        data.otherCoupon = item;
        data.coupons = coupons;
        // Cache.set(cache_keys.order_form, data);
        this.setData({
            block: Object.assign({}, this.data.block, data)
        })

        wx.setStorageSync('order_form', data)

        this.paymentMoney()
    },
    sure(){
        var block = this.data.block.otherCoupon

        this.setData({
            [`block.coupon`]: block,
            [`form.coupon`]:block,
            show: false
        })

        console.log(this.data.form.coupon)

        this.paymentMoney()
    },
    select() {

        this.setData({
            show: true
        })
    },
    cancel() {
        var coupons = this.data.block.coupons
        coupons.forEach((v) => v.checked = false)
        this.setData({

            [`block.coupons`]: coupons,
            [`form.coupon`]:this.data.block.otherCoupon,
            [`block.otherCoupon`]: {},
            check: null,
            show: false
        })
    },

    onShow() {

        this.initData()


    },
    initData() {
        // var local_order = {
        //     "order": {
        //         "user_id": 495,
        //         "status": 0,
        //         "order_no": "O2017091232622905544",
        //         "items_total": 54900,
        //         "total": 54900,
        //         "count": 1,
        //         "updated_at": "2017-09-12 10:56:52",
        //         "created_at": "2017-09-12 10:56:52",
        //         "id": 1280,
        //         "payable_freight": 0,
        //         "refund_status": 0,
        //         "can_refund": true,
        //         "payment_text": "",
        //         "balance_paid": 0,
        //         "items": [
        //             {
        //                 "quantity": 1,
        //                 "unit_price": 54900,
        //                 "units_total": 54900,
        //                 "total": 54900,
        //                 "item_id": 21551,
        //                 "item_name": "  16秋冬新品女款防水透气全压胶冲锋衣2U8U",
        //                 "item_meta": {
        //                     "image": "http://tnf-equipment.b0.upaiyun.com/2016/07/14684833700862.jpg",
        //                     "detail_id": 2346,
        //                     "specs_text": "月光白/128 M"
        //                 },
        //                 "order_id": 1280,
        //                 "updated_at": "2017-09-12 10:56:52",
        //                 "created_at": "2017-09-12 10:56:52",
        //                 "id": 1643,
        //                 "is_refunded": false,
        //                 "refund_no": null,
        //                 "refund_status": null,
        //                 "item_sku": "NF0A2U8U128100M",
        //                 "item_category": [
        //                     "女款线上专供",
        //                     "女装",
        //                     "硬壳夹克"
        //                 ],
        //                 "order": null
        //             }
        //         ],
        //         "adjustments": [],
        //         "comments": [],
        //         "payments": []
        //     },
        //     "discounts": [
        //         {
        //             "id": 10,
        //             "title": "全场8折",
        //             "label": "全场8折",
        //             "intro": "全场8折",
        //             "exclusive": 0,
        //             "usage_limit": 4000,
        //             "used": 0,
        //             "coupon_based": 0,
        //             "code": null,
        //             "type": 0,
        //             "starts_at": "2017-09-11 15:08:00",
        //             "ends_at": "2017-10-11 15:08:00",
        //             "status": 1,
        //             "created_at": "2017-03-22 10:21:14",
        //             "updated_at": "2017-09-11 15:10:53",
        //             "deleted_at": null,
        //             "useend_at": null,
        //             "per_usage_limit": 4000,
        //             "app_id": 1,
        //             "tags": "满折",
        //             "is_open": 1,
        //             "url": null,
        //             "orderAmountLimit": 0,
        //             "adjustments": [
        //                 {
        //                     "order_id": 1280,
        //                     "order_item_id": 1643,
        //                     "amount": -10980
        //                 }
        //             ],
        //             "adjustmentTotal": -10980,
        //             "is_enabled": true,
        //             "rules": [
        //                 {
        //                     "id": 101,
        //                     "discount_id": 10,
        //                     "type": "contains_category",
        //                     "configuration": {"items":["373","379","380","381","382","383","384","385","386","387","388","389","390","391","392","393","394","395","396","457","465","474","374","397","398","399","400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","417","418","419","458","466","473","475","375","420","421","422","423","424","425","426","427","428","429","430","431","451","462","463","464","470","476","376","432","433","434","435","436","437","471","477","377","438","439","440","441","442","443","378","444","445","446","447","448","449","450","461","468","469","472","452","453"],"exclude_spu":""}
        //                 }
        //             ],
        //             "actions": [
        //                 {
        //                     "id": 10,
        //                     "discount_id": 10,
        //                     "type": "goods_percentage_discount",
        //                     "configuration": {"percentage":"80"}
        //                 }
        //             ]
        //         }
        //     ],
        //     "coupons": [
        //         {
        //             "id": 9101,
        //             "discount_id": 23,
        //             "user_id": 495,
        //             "code": "C2017090785034015840",
        //             "used_at": null,
        //             "expires_at": null,
        //             "created_at": "2017-09-07 14:55:10",
        //             "updated_at": "2017-09-07 14:55:10",
        //             "deleted_at": null,
        //             "utm_campaign": null,
        //             "utm_source": null,
        //             "orderAmountLimit": 10000,
        //             "adjustments": [
        //                 {
        //                     "order_id": 1280,
        //                     "amount": -5000
        //                 }
        //             ],
        //             "adjustmentTotal": -5000,
        //             "discount_amount": 5000,
        //             "discount_percentage": 100,
        //             "is_expire": false,
        //             "discount": {
        //                 "id": 23,
        //                 "title": "测试小程序下单",
        //                 "label": "",
        //                 "intro": "",
        //                 "exclusive": 0,
        //                 "usage_limit": 98,
        //                 "used": 2,
        //                 "coupon_based": 1,
        //                 "code": "xcx1",
        //                 "type": 0,
        //                 "starts_at": "2017-09-07 14:52:00",
        //                 "ends_at": "2017-10-31 14:52:00",
        //                 "status": 1,
        //                 "created_at": "2017-09-07 14:53:16",
        //                 "updated_at": "2017-09-11 14:55:57",
        //                 "deleted_at": null,
        //                 "useend_at": "2017-11-30 14:52:00",
        //                 "per_usage_limit": 10,
        //                 "app_id": 1,
        //                 "tags": "",
        //                 "is_open": 1,
        //                 "url": "",
        //                 "is_enabled": true,
        //                 "rules": [
        //                     {
        //                         "id": 99,
        //                         "discount_id": 23,
        //                         "type": "item_total",
        //                         "configuration": {"amount":10000}
        //                     }
        //                 ],
        //                 "actions": [
        //                     {
        //                         "id": 23,
        //                         "discount_id": 23,
        //                         "type": "order_fixed_discount",
        //                         "configuration": {"amount":5000}
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             "id": 9102,
        //             "discount_id": 24,
        //             "user_id": 495,
        //             "code": "C2017090754029096138",
        //             "used_at": null,
        //             "expires_at": null,
        //             "created_at": "2017-09-07 14:55:17",
        //             "updated_at": "2017-09-07 14:55:17",
        //             "deleted_at": null,
        //             "utm_campaign": null,
        //             "utm_source": null,
        //             "orderAmountLimit": 10000,
        //             "adjustments": [
        //                 {
        //                     "order_id": 1280,
        //                     "amount": -27450
        //                 }
        //             ],
        //             "adjustmentTotal": -27450,
        //             "discount_amount": 0,
        //             "discount_percentage": "50",
        //             "is_expire": false,
        //             "discount": {
        //                 "id": 24,
        //                 "title": "测试小程序下单2",
        //                 "label": "",
        //                 "intro": "",
        //                 "exclusive": 0,
        //                 "usage_limit": 98,
        //                 "used": 2,
        //                 "coupon_based": 1,
        //                 "code": "xcx2",
        //                 "type": 0,
        //                 "starts_at": "2017-09-07 14:53:00",
        //                 "ends_at": "2017-10-31 14:53:00",
        //                 "status": 1,
        //                 "created_at": "2017-09-07 14:54:49",
        //                 "updated_at": "2017-09-11 14:56:01",
        //                 "deleted_at": null,
        //                 "useend_at": "2017-10-31 14:53:00",
        //                 "per_usage_limit": 10,
        //                 "app_id": 1,
        //                 "tags": "",
        //                 "is_open": 1,
        //                 "url": "",
        //                 "is_enabled": true,
        //                 "rules": [
        //                     {
        //                         "id": 100,
        //                         "discount_id": 24,
        //                         "type": "item_total",
        //                         "configuration": {"amount":10000}
        //                     }
        //                 ],
        //                 "actions": [
        //                     {
        //                         "id": 24,
        //                         "discount_id": 24,
        //                         "type": "order_percentage_discount",
        //                         "configuration": {"percentage":"50"}
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             "id": 9103,
        //             "discount_id": 23,
        //             "user_id": 495,
        //             "code": "C2017091116554153742",
        //             "used_at": null,
        //             "expires_at": null,
        //             "created_at": "2017-09-11 14:55:57",
        //             "updated_at": "2017-09-11 14:55:57",
        //             "deleted_at": null,
        //             "utm_campaign": null,
        //             "utm_source": null,
        //             "orderAmountLimit": 10000,
        //             "adjustments": [
        //                 {
        //                     "order_id": 1280,
        //                     "amount": -5000
        //                 }
        //             ],
        //             "adjustmentTotal": -5000,
        //             "discount_amount": 5000,
        //             "discount_percentage": 100,
        //             "is_expire": false,
        //             "discount": {
        //                 "id": 23,
        //                 "title": "测试小程序下单",
        //                 "label": "",
        //                 "intro": "",
        //                 "exclusive": 0,
        //                 "usage_limit": 98,
        //                 "used": 2,
        //                 "coupon_based": 1,
        //                 "code": "xcx1",
        //                 "type": 0,
        //                 "starts_at": "2017-09-07 14:52:00",
        //                 "ends_at": "2017-10-31 14:52:00",
        //                 "status": 1,
        //                 "created_at": "2017-09-07 14:53:16",
        //                 "updated_at": "2017-09-11 14:55:57",
        //                 "deleted_at": null,
        //                 "useend_at": "2017-11-30 14:52:00",
        //                 "per_usage_limit": 10,
        //                 "app_id": 1,
        //                 "tags": "",
        //                 "is_open": 1,
        //                 "url": "",
        //                 "is_enabled": true,
        //                 "rules": [
        //                     {
        //                         "id": 99,
        //                         "discount_id": 23,
        //                         "type": "item_total",
        //                         "configuration": {"amount":10000}
        //                     }
        //                 ],
        //                 "actions": [
        //                     {
        //                         "id": 23,
        //                         "discount_id": 23,
        //                         "type": "order_fixed_discount",
        //                         "configuration": {"amount":5000}
        //                     }
        //                 ]
        //             }
        //         }
        //     ],
        //     "address": {
        //         "id": 37,
        //         "user_id": 495,
        //         "accept_name": "彭磊",
        //         "mobile": "13348673353",
        //         "province": 430000,
        //         "city": 430100,
        //         "area": 430105,
        //         "address_name": "湖南省 长沙市 芙蓉区",
        //         "address": "新时代广场",
        //         "is_default": 1,
        //         "created_at": "2017-09-06 19:55:44",
        //         "updated_at": "2017-09-06 19:55:44",
        //         "deleted_at": null
        //     },
        //     "in_source_discount_id": false,
        //     "orderPoint": {
        //         "userPoint": "18438.00",
        //         "pointToMoney": "10",
        //         "pointLimit": 0.3,
        //         "pointAmount": -16470,
        //         "pointCanUse": 1647
        //     },
        //     "discountGroup": [],
        //     "invoice_status": "1"
        // }
        //
        // var order_form = {"order_no":"O2017091232622905544","address":{"id":37,"user_id":495,"accept_name":"彭磊","mobile":"13348673353","province":430000,"city":430100,"area":430105,"address_name":"湖南省 长沙市 芙蓉区","address":"新时代广场","is_default":1,"created_at":"2017-09-06 19:55:44","updated_at":"2017-09-06 19:55:44","deleted_at":null},"coupon":{"id":9102,"discount_id":24,"user_id":495,"code":"C2017090754029096138","used_at":null,"expires_at":null,"created_at":"2017-09-07 14:55:17","updated_at":"2017-09-07 14:55:17","deleted_at":null,"utm_campaign":null,"utm_source":null,"orderAmountLimit":10000,"adjustments":[{"order_id":1280,"amount":-27450}],"adjustmentTotal":-27450,"discount_amount":0,"discount_percentage":"50","is_expire":false,"discount":{"id":24,"title":"测试小程序下单2","label":"","intro":"","exclusive":0,"usage_limit":98,"used":2,"coupon_based":1,"code":"xcx2","type":0,"starts_at":"2017-09-07 14:53:00","ends_at":"2017-10-31 14:53:00","status":1,"created_at":"2017-09-07 14:54:49","updated_at":"2017-09-11 14:56:01","deleted_at":null,"useend_at":"2017-10-31 14:53:00","per_usage_limit":10,"app_id":1,"tags":"","is_open":1,"url":"","is_enabled":true,"rules":[{"id":100,"discount_id":24,"type":"item_total","configuration":{"amount":10000}}],"actions":[{"id":24,"discount_id":24,"type":"order_percentage_discount","configuration":{"percentage":"50"}}]}},"invoice":{},"discount":{"id":10,"title":"全场8折","label":"全场8折","intro":"全场8折","exclusive":0,"usage_limit":4000,"used":0,"coupon_based":0,"code":null,"type":0,"starts_at":"2017-09-11 15:08:00","ends_at":"2017-10-11 15:08:00","status":1,"created_at":"2017-03-22 10:21:14","updated_at":"2017-09-11 15:10:53","deleted_at":null,"useend_at":null,"per_usage_limit":4000,"app_id":1,"tags":"满折","is_open":1,"url":null,"orderAmountLimit":0,"adjustments":[{"order_id":1280,"order_item_id":1643,"amount":-10980}],"adjustmentTotal":-10980,"is_enabled":true,"rules":[{"id":101,"discount_id":10,"type":"contains_category","configuration":{"items":["373","379","380","381","382","383","384","385","386","387","388","389","390","391","392","393","394","395","396","457","465","474","374","397","398","399","400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","417","418","419","458","466","473","475","375","420","421","422","423","424","425","426","427","428","429","430","431","451","462","463","464","470","476","376","432","433","434","435","436","437","471","477","377","438","439","440","441","442","443","378","444","445","446","447","448","449","450","461","468","469","472","452","453"],"exclude_spu":""}}],"actions":[{"id":10,"discount_id":10,"type":"goods_percentage_discount","configuration":{"percentage":"80"}}]},"point":0,"note":"","formStates":{"discountsCheckIndex":0},"isDisabled":false}
        //
        //
        // wx.setStorageSync('local_order', local_order)
        // wx.setStorageSync('order_form', order_form)

        var block = wx.getStorageSync('local_order');
        var form = wx.getStorageSync('order_form');
        var is_login = wx.getStorageSync('user_token')
        this.setData({
            is_login:is_login,
            loading:false
        })
        if (block) {
            if (!form || form.order_no !== block.order.order_no) {
                form = Object.assign({}, this.data.form);
                form.order_no = block.order.order_no;
                if (block.address) {
                    form.address = block.address;
                }
                // Cache.set(cache_keys.order_form, form);
                wx.setStorageSync('order_form', form)
            } else {
                if (form.formStates) {

                    this.setData({
                        [`formStates.discountsCheckIndex`]: form.formStates.discountsCheckIndex,
                        [`formStates.pointStatus`]: form.formStates.pointStatus
                    })
                }


                this.setData({
                    [`form.isDisabled`]: form.isDisabled,
                    [`temporary.coupon`]: form.coupon
                })
            }

            this.setData({
                [`temporary.coupons`]: block.coupons
            })
            this.queryOrderExtra();

            this.setData({
                block: Object.assign({}, this.data.block, block),
                form: Object.assign({}, this.data.form, form)
            })
            console.log(this.data.form)
            this.paymentMoney()
            // t.next({block, form});
        } else {

            // this.addHistory();
            // t.to.router.forward({name: 'user-order-online', params: {status: 1}});
        }
    },
    queryOrderExtra(){
        var oauth = this.data.is_login
        var that = this;
        wx.request({
            url: `${config.GLOBAL.baseUrl}api/shopping/order/extraInfo`,
            header: {Authorization: that.data.is_login},
            success: function (res) {
                res = res.data

                var data = res.data;

                if (res.status) {
                    var extra = {
                        point: data.userPoint,
                        limit: data.pointLimit,
                        factor: data.pointToMoney
                    };

                    that.setData({
                        extra: extra
                    })
                    // dispatch(UserOrderExtra, extra);
                }
            }
        })
    },
    changeDiscounts(e){
        this.setData({
            [`formStates.discountsCheckIndex`]: e.detail.value
        })

        this.paymentMoney();

    },
    submitOrder() {
        this.setData({
            loading:true
        })
        var data = {
            order_no: this.data.form.order_no,   // 订单编号
            note: this.data.form.note            // 用户留言
        };

        if (this.data.form.address && this.data.form.address.id) {
            data.address_id = this.data.form.address.id;
        } else {
            this.setData({
                loading:false
            })
            wx.showModal({
                title:'请填写收货地址',
                success:function (res) {
                    if (res.confirm) {

                    }
                }
            })
            return;
        }

        if (this.data.form.coupon && this.data.form.coupon.id) {
            data.coupon_id = this.data.form.coupon.id;
        }

        if (this.data.form.invoice && this.data.form.invoice.id) {
            data.invoice_id = this.data.form.invoice.id;
        }

        if (this.data.form.discount && this.data.form.discount.id) {
            data.discount_id = this.data.form.discount.id;
        }

        if (this.data.form.point) {
            data.point = this.data.form.point;
        }

        this.confirmOrder(data);
    },
    confirmOrder (data) {

        var that = this;
        var oauth = this.data.is_login
        wx.request({
            url: `${config.GLOBAL.baseUrl}api/shopping/order/confirm`,
            data:data,
            method:"POST",
            header: {Authorization:  that.data.is_login},
            success:function (res) {
                res = res.data;
                console.log(res)
                if (res.status) {
                    wx.removeStorageSync('local_order')
                    // this.$emit('confirm', true, res.data);
                    that.confirm(true,res.data)
                } else {
                    that.confirm(true)
                }
            }
        })
    },
    confirm(success,data) {

        if (success) {
            this.setData({
                loading:false
            })
            // this.$refs.button.finish();

            var registration = this.data.block.registration_id;
            var pay_status = data.order.pay_status;

            if (registration || pay_status == 1) {
                // this.addHistory();

                // this.$router.forward({name: 'user-order-online', params: {status: 0}});

//                        this.$router.forward({name: 'user-order-online', params: {status: 0}, query: {registration}});

                wx.redirectTo({
                    url:`/pages/order/index/index?status=0`,
                    success:function (){

                    }
                })

            } else {
                wx.redirectTo({
                    url: `/pages/store/payment/payment?order_no=${data.order.order_no}`,
                    success: function () {

                    }
                    // this.$router.forward({name: 'store-payment', params: {order_no: data.order.order_no}});

                })
            }
        } else {
            this.setData({
                loading:false
            })
            wx.showModal({
                title:'提交订单失败',
                success:function (res){
                    if (res.confirm) {

                    }
                }
            })
        }
    },
    paymentMoney() {
        var dis = {
            order: 0,
            point: 0,
            coupon: 0,
        };
        var total = this.data.block.order.total;
        var fixedTotal = this.data.block.order.total;
        var block = wx.getStorageSync('local_order');
        // var pointToMoney = block.orderPoint.pointToMoney;

//                订单折扣
        if (this.data.block.discounts && Array.isArray(this.data.block.discounts)) {

            let discounts = this.data.block.discounts;
            let check = this.data.formStates.discountsCheckIndex;
            console.warn(check)
            if (check == -1) {


//                        当选择不使用优惠的情况
                dis.order = 0;
                this.setData({
                    [`form.discount`]: {},
                    [`form.formStates.discountsCheckIndex`]: check,

                })
                if (this.data.temporary.coupons.length) {

                    this.setData({
                        [`block.coupons`]: this.data.temporary.coupons
                    })
                }
                //                            操作积分
                // this.data.block.orderPoint.pointCanUse = Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint);
                // this.data.block.orderPoint.pointAmount = Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney));
                //
                // this.data.form.coupon = this.data.temporary.coupon;     // 将选择的优惠券还原

                this.setData({
                    [`block.orderPoint.pointCanUse`]: Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint),
                    [`block.orderPoint.pointAmount`]: Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney)),
                    [`form.coupon`]: this.data.temporary.coupon
                })
                wx.setStorageSync('order_form', this.data.form)
            } else {

//                        当使用了优惠的情况
                let discount = -(discounts[check].adjustmentTotal);
                console.log(discount)
                let exclusive = discounts[check].exclusive;    //是否排他(优惠券);

                if (discount <= total) {
                    if (exclusive) {
                        this.setData({
                            [`block.coupons`]: [],
                            [`form.coupon`]: {}
                        })
                    } else {
                        this.setData({
                            [`block.coupons`]: this.data.temporary.coupons,
                            [`form.coupon`]: this.data.temporary.coupon
                        })
                    }
                    dis.order = discounts[check].adjustmentTotal;
                    this.setData({
                        [`form.discount`]: discounts[check]
                    })
                    total -= discount;
                    //                            操作积分


                    this.setData({
                        [`block.orderPoint.pointCanUse`]: Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint),
                        [`block.orderPoint.pointAmount`]: Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney)),
                        [`form.formStates.discountsCheckIndex`]: check
                    })
                    // Cache.set(cache_keys.order_form, this.data.form);
                    wx.setStorageSync('order_form', this.data.form)

                } else {
                    // this.$Alert('超过最大优惠折扣', () => {
                    //     check = -1;
                    // });
                    wx.showModal({
                        title: '超过最大折扣',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) check = -1
                        }
                    })
                    this.setData({
                        [`form.discount`]: {}
                    })
                    wx.setStorageSync('order_form', this.data.form)
                }
            }
        }

//                优惠券折扣
        if (this.data.block.coupon && this.data.block.coupon.adjustments && Array.isArray(this.data.block.coupon.adjustments)) {
            let adjustments = this.data.block.coupon.adjustments;
            let discount = -(adjustments[0].amount);
            if (discount <= total) {
                dis.coupon = adjustments[0].amount;
                total -= discount;
//                        操作积分

                this.setData({
                    [`block.orderPoint.pointCanUse`]: total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney,
                    [`block.orderPoint.pointAmount`]: -(total * this.data.block.orderPoint.pointLimit)
                })
            } else {
                wx.showModal({
                    title: '超过最大折扣',
                    showCancel: false,
                })
                this.setData({
                    [`form.coupon`]: {},
                    [`temporary.coupon`]: {},
                    [`form.isDisabled`]: false
                })
                wx.setStorageSync('order_form', this.data.form)
            }
        }

        console.log(this.data.form, this.data.block)


        //              积分折扣
        if (this.data.form.point) {

            let factor = this.data.extra.factor;

            let discount = this.data.form.point * factor;

            if (discount <= total) {
                dis.point = -discount;
                total -= discount;
                if (total < 0) {
                    total = 0;
                    if (dis.point != 0) {
                        dis.total = -(fixedTotal + dis.point);
                    }
                } else {
                    //                除积分外的优惠
                    dis.total = dis.order + dis.coupon;
                }
                wx.setStorageSync('order_form', this.data.form)
            } else {
                this.setData({
                    [`form.point`]: 0
                })
                wx.setStorageSync('order_form', this.data.form)
            }
        }

        // 除积分外的优惠
        dis.total = dis.order + dis.coupon;

        if (this.data.form.point > this.data.block.orderPoint.pointCanUse) {
            this.setData ({
                [`form.point`]:this.data.block.orderPoint.pointCanUse
            })
            dis.point = this.data.block.orderPoint.pointCanUse * 10
        }


        this.setData({
            [`paymentMoneys.discounts`]: dis,
            [`paymentMoneys.total`]: total
        })

    },
    usePoint(){

        this.setData({
            [`formStates.pointStatus`]: true,
            [`form.point`]: this.data.block.orderPoint.pointCanUse
        })


        this.paymentMoney()
    },
    modifyPoint(e){
        var min = 0;
        var max = this.data.extra.point;
        var val = e.detail.value;
        var use = Math.floor(this.data.block.order.total * this.data.extra.limit / this.data.extra.factor);
        var sun = Math.floor((this.data.block.order.total + this.data.paymentMoneys.discounts.total) / this.data.extra.factor);

        if (!isFinite(use)) use = max;
        if (!isFinite(sun)) sun = max;

        max = Math.min(max, use, sun);

        val = parseInt(val);
        if (isNaN(val)) {
            val = '';
        } else if (val < min) {
            val = min;
        } else if (val > max) {
            val = max;
        }

        e.detail.value = val
        this.setData({
            [`form.point`]: val
        })
        this.paymentMoney()
    },
    saveForm(e){
        wx.setStorageSync('order_form', this.data.form)

    }
}


const page = connect.Page(
    store(),
    (state) => {
        return {detailData: state.goods_detail}
    },
    (dispatch) => {
        return {
            getGoodsDetail: bindActionCreators(actions.getGoodsDetail, dispatch, 'GOODS_DETAIL'),
            // queryCommodityStore: bindActionCreators(actions.queryCommodityStore, dispatch ,'COMMODITYSTORE','COMMODITYSPECS')
        }
    }
)

Page(page(args))