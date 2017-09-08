/**
 * Created by admin on 2017/9/1.
 */
var app = getApp();
Page({
    data:{
         detail:""
    },
    onLoad(){
        var token=wx.getStorageSync('user_token');
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/me",
            header:{
                Authorization:token
            },
            success: res => {
                // console.log(res.data);
                if(res.data.status){
                    this.setData({
                        detail:res.data.data
                    })
                }
            }
        })
    },
    jump(e){
        var status=e.currentTarget.dataset.status;
        wx.navigateTo({
            url: '/pages/order/index/index?type='+status
        })
    },
    jumpAfterSales(){
        wx.navigateTo({
            url: '/pages/afterSales/index/index'
        })
    },
    jumpSetting(){
        wx.navigateTo({
            url: '/pages/user/usersetting/usersetting'
        })
    }
})