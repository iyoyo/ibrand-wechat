/**
 * Created by admin on 2017/9/1.
 */
import {config,getUrl,pageLogin} from '../../../lib/myapp.js';
Page({
    data:{
         detail:""
    },
    onLoad(){
        // var that=this;
        pageLogin(getUrl(),()=>{
            this.gitUserInfo()
        });
    },
    gitUserInfo() {
        wx.request({
            url: config.GLOBAL.baseUrl + 'api/me',
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            success: res => {
                if(res.data.status){
                    this.setData({
                        detail:res.data.data
                    })
                }
            }
        })
    },
    jumpImg() {
        wx.navigateTo({
            url: '/pages/user/usersetting/usersetting'
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
            url: '/pages/user/out/out'
        })
    }
})
