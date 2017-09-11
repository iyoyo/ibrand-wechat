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
        show: false,
        checked: null,
        block: {
            order: {
                items: []
            },
            orderPoint: {
                pointAmount: 0,
                pointCanUse: 0
            }
        },
        extra:{
            point:{

            }
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
        paymentMoneys:{
            discounts:{},
            total:0
        }
    },
    change(e) {
        this.setData({
            checked: e.detail.value
        })
    },
    select() {
        this.setData({
            show: true
        })
    },
    cancel() {
        this.setData({
            checked: null,
            show: false
        })
    },

    onLoad() {

        this.initData()


    },
    initData() {
        var local_order = {"order":{"user_id":495,"status":0,"order_no":"O2017090776309094135","items_total":251600,"total":251600,"count":2,"updated_at":"2017-09-07 14:56:27","created_at":"2017-09-07 14:56:27","id":1269,"payable_freight":0,"refund_status":0,"can_refund":true,"payment_text":"","balance_paid":0,"items":[{"quantity":2,"unit_price":125800,"units_total":251600,"total":251600,"item_id":22453,"item_name":"16秋冬新品 男款防水透气舒适保暖 冲锋衣2UB9","item_meta":{"image":"http://tnf-equipment.b0.upaiyun.com/2016/09/14732294340980.jpg","detail_id":2466,"specs_text":"深绿/MPB L"},"order_id":1269,"updated_at":"2017-09-07 14:56:27","created_at":"2017-09-07 14:56:27","id":1631,"is_refunded":false,"refund_no":null,"refund_status":null,"item_sku":"NF0A2UB9MPB100L","item_category":["男装","硬壳夹克"],"order":null}],"adjustments":[],"comments":[],"payments":[]},"discounts":true,"coupons":[{"id":9101,"discount_id":23,"user_id":495,"code":"C2017090785034015840","used_at":null,"expires_at":null,"created_at":"2017-09-07 14:55:10","updated_at":"2017-09-07 14:55:10","deleted_at":null,"utm_campaign":null,"utm_source":null,"orderAmountLimit":10000,"adjustments":[{"order_id":1269,"amount":-5000}],"adjustmentTotal":-5000,"discount_amount":5000,"discount_percentage":100,"is_expire":false,"discount":{"id":23,"title":"测试小程序下单","label":"","intro":"","exclusive":0,"usage_limit":99,"used":1,"coupon_based":1,"code":"xcx1","type":0,"starts_at":"2017-09-07 14:52:00","ends_at":"2017-10-31 14:52:00","status":1,"created_at":"2017-09-07 14:53:16","updated_at":"2017-09-07 14:55:10","deleted_at":null,"useend_at":"2017-11-30 14:52:00","per_usage_limit":10,"app_id":1,"tags":"","is_open":1,"url":"","is_enabled":true,"rules":[{"id":99,"discount_id":23,"type":"item_total","configuration":{"amount":10000}}],"actions":[{"id":23,"discount_id":23,"type":"order_fixed_discount","configuration":{"amount":5000}}]}},{"id":9102,"discount_id":24,"user_id":495,"code":"C2017090754029096138","used_at":null,"expires_at":null,"created_at":"2017-09-07 14:55:17","updated_at":"2017-09-07 14:55:17","deleted_at":null,"utm_campaign":null,"utm_source":null,"orderAmountLimit":10000,"adjustments":[{"order_id":1269,"amount":-125800}],"adjustmentTotal":-125800,"discount_amount":0,"discount_percentage":"50","is_expire":false,"discount":{"id":24,"title":"测试小程序下单2","label":"","intro":"","exclusive":0,"usage_limit":99,"used":1,"coupon_based":1,"code":"xcx2","type":0,"starts_at":"2017-09-07 14:53:00","ends_at":"2017-10-31 14:53:00","status":1,"created_at":"2017-09-07 14:54:49","updated_at":"2017-09-07 14:55:17","deleted_at":null,"useend_at":"2017-10-31 14:53:00","per_usage_limit":10,"app_id":1,"tags":"","is_open":1,"url":"","is_enabled":true,"rules":[{"id":100,"discount_id":24,"type":"item_total","configuration":{"amount":10000}}],"actions":[{"id":24,"discount_id":24,"type":"order_percentage_discount","configuration":{"percentage":"50"}}]}}],"address":{"id":37,"user_id":495,"accept_name":"彭磊","mobile":"13348673353","province":430000,"city":430100,"area":430105,"address_name":"湖南省 长沙市 芙蓉区","address":"新时代广场","is_default":1,"created_at":"2017-09-06 19:55:44","updated_at":"2017-09-06 19:55:44","deleted_at":null},"in_source_discount_id":false,"orderPoint":{"userPoint":"22209.00","pointToMoney":"10","pointLimit":0.3,"pointAmount":-75480,"pointCanUse":7548},"discountGroup":[],"invoice_status":"1"}

        var order_form = {

                "order_no": "O2017090776309094135",
                "address": {
                    "id": 37,
                    "user_id": 495,
                    "accept_name": "彭磊",
                    "mobile": "13348673353",
                    "province": 430000,
                    "city": 430100,
                    "area": 430105,
                    "address_name": "湖南省 长沙市 芙蓉区",
                    "address": "新时代广场",
                    "is_default": 1,
                    "created_at": "2017-09-06 19:55:44",
                    "updated_at": "2017-09-06 19:55:44",
                    "deleted_at": null
                },
                "coupon": {},
                "invoice": {},
                "discount": {},
                "point": 0,
                "note": "",
                "formStates": {},
                "isDisabled": false
            }


        wx.setStorageSync('local_order', local_order)
        wx.setStorageSync('order_form', order_form)

        var block = wx.getStorageSync('local_order');
        var form = wx.getStorageSync('order_form');

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
                        [`formStates.discountsCheckIndex`]:form.formStates.discountsCheckIndex,
                        [`formStates.pointStatus`]:form.formStates.pointStatus
                    })
                }


                this.setData({
                    [`form.isDisabled`]:form.isDisabled,
                    [`temporary.coupon`]:form.coupon
                })
            }

            this.setData({
                [`temporary.coupons`]:block.coupons
            })
            this.queryOrderExtra();

            this.setData({
                block: Object.assign({},this.data.block,block),
                form: Object.assign({},this.data.form,form)
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
        var that = this;
        wx.request({
            url:`${config.GLOBAL.baseUrl}api/shopping/order/extraInfo`,
            header:{Authorization:'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg'},
            success:function(res){
                res = res.data

                var data = res.data;

                if (res.status) {
                    var extra = {
                        point: data.userPoint,
                        limit: data.pointLimit,
                        factor: data.pointToMoney
                    };

                    that.setData({
                        extra:extra
                    })
                    // dispatch(UserOrderExtra, extra);
                }
            }
        })
    },
    changeDiscounts(e){
        this.setData({
            [`formStates.discountsCheckIndex`]:e.detail.value
        })

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
        var pointToMoney = block.orderPoint.pointToMoney;

//                订单折扣
        if (this.data.block.discounts && Array.isArray(this.data.block.discounts)) {
            let discounts = this.data.block.discounts;
            let check = this.data.formStates.discountsCheckIndex;
            if (check === -1) {
//                        当选择不使用优惠的情况
                dis.order = 0;
                this.setData({
                    [`form.discount`]:{},
                    [`form.formStates.discountsCheckIndex`]:check,

                })
                if (this.data.temporary.coupons.length) {

                    this.setData({
                        [`block.coupons`]:this.data.temporary.coupons
                    })
                }
                //                            操作积分
                // this.data.block.orderPoint.pointCanUse = Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint);
                // this.data.block.orderPoint.pointAmount = Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney));
                //
                // this.data.form.coupon = this.data.temporary.coupon;     // 将选择的优惠券还原

                this.setData({
                    [`block.orderPoint.pointCanUse`]:Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint),
                    [`block.orderPoint.pointAmount`]:Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney)),
                    [`form.coupon`]:this.data.temporary.coupon
                })
                wx.setStorageSync('order_form', this.data.form)
            } else {
//                        当使用了优惠的情况
                let discount = -(discounts[check].adjustmentTotal);
                let exclusive = discounts[check].exclusive;    //是否排他(优惠券);

                if (discount <= total) {
                    if (exclusive) {
                        this.setData({
                            [`block.coupons`]:[],
                            [`form.coupon`]:{}
                        })
                    } else {
                        this.setData({
                            [`block.coupons`]: this.data.temporary.coupons,
                            [`form.coupon`]:this.data.temporary.coupon
                        })
                    }
                    dis.order = discounts[check].adjustmentTotal;
                    this.setData({
                        [`form.discount`]:discounts[check]
                    })
                    total -= discount;
                    //                            操作积分


                    this.setData({
                        [`block.orderPoint.pointCanUse`]:Math.min(total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney, this.data.block.orderPoint.userPoint),
                        [`block.orderPoint.pointAmount`]:Math.max(-(total * this.data.block.orderPoint.pointLimit), -(this.data.block.orderPoint.userPoint * this.data.block.orderPoint.pointToMoney)),
                        [`form.formStates.discountsCheckIndex`]:check
                    })
                    // Cache.set(cache_keys.order_form, this.data.form);
                    wx.setStorageSync('order_form', this.data.form)

                } else {
                    // this.$Alert('超过最大优惠折扣', () => {
                    //     check = -1;
                    // });
                    wx.showModal({
                        title:'超过最大折扣',
                        showCancel:false,
                        success:function(res){
                            if (res.confirm) check = -1
                        }
                    })
                    this.setData({
                        [`form.discount`]:{}
                    })
                    wx.setStorageSync('order_form', this.data.form)
                }
            }
        }

//                优惠券折扣
        if ( Array.isArray(this.data.form.coupon.adjustments)) {
            let adjustments = this.data.form.coupon.adjustments;
            let discount = -(adjustments[0].amount);
            if (discount <= total) {
                dis.coupon = adjustments[0].amount;
                total -= discount;
//                        操作积分

                this.setData({
                    [`block.orderPoint.pointCanUse`]:total * this.data.block.orderPoint.pointLimit / this.data.block.orderPoint.pointToMoney,
                    [`block.orderPoint.pointAmount`]:-(total * this.data.block.orderPoint.pointLimit)
                })
            } else {
                wx.showModal({
                    title:'超过最大折扣',
                    showCancel:false,
                })
                this.setData({
                    [`form.coupon`]:{},
                    [`temporary.coupon`]:{},
                    [`form.isDisabled`]:false
                })
                wx.setStorageSync('order_form', this.data.form)
            }
        }

        console.log(this.data.form,this.data.block)



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
                    [`form.point`]:0
                })
                wx.setStorageSync('order_form', this.data.form)
            }
        }

        // 除积分外的优惠
        dis.total = dis.order + dis.coupon;




        this.setData({
            [`paymentMoneys.discounts`]:dis,
            [`paymentMoneys.total`]:total
        })

        console.log(console.log(this.data.paymentMoneys))
    },
    usePoint(){

        this.setData({
            [`formStates.pointStatus`]:true,
            [`form.point`]:this.data.block.orderPoint.pointCanUse
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

        this.setData({
            [`form.point`]:val
        })
        this.paymentMoney()
    },
    saveForm(){
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