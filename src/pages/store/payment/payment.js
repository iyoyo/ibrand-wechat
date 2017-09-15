var app = getApp();
import {config} from '../../../lib/myapp.js'
Page({

        data:{
            order:{},

        },
        onLoad(e){
            var order_no = e.order_no;
            this.queryOrderDetail(order_no)

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
                }
            })
        }
})