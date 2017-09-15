var app = getApp();
import {config,is} from '../../../lib/myapp.js'
Page({

        data:{
            order:{},
            order_no:'',
            channel:'wx_pub',
            amount:0
        },
        onLoad(e){

            this.setData(
                {
                    order_no:e.order_no
                }
            )


        },
        onShow(){
            this.queryOrderDetail(this.data.order_no)
        },
        queryOrderDetail (order_no) {
            var oauth = wx.getStorageSync('user_token')
            var that = this;
            wx.request({
                url:`${config.GLOBAL.baseUrl}api/order/${order_no}`,
                header:{Authorization:oauth},
                success:function (res){
                    res = res.data
                    wx.setStorageSync('service_retreat',res.data)

                    that.setData({
                        order:res.data
                    })
                },
                fail:function () {
                    wx.showModal({
                        title:'获取订单数据失败'
                    })
                }
            })
        },
        jump() {

            wx.redirectTo({
                url:`/pages/store/success/success?order_no=${this.data.order_no}&amount=${this.data.amount}&channel=${this.data.channel}`
            })

        },


})