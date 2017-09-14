/**
 * Created by admin on 2017/9/1.
 */
import {config,getUrl,pageLogin} from '../../../lib/myapp.js';
Page({
    data:{
         detail:"",
         token:""
    },
    onShow(){
        var token=wx.getStorageSync('user_token');
        this.setData({
            token:token
        });
         if(token){
             this.gitUserInfo()
         }
    },
    jumpLogin(){
        wx.navigateTo({
            url: '/pages/user/register/register'
        })
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
    jumpAddress(){
        if(!this.data.token){
          return this.jumpLogin();
        }
        wx.navigateTo({
            url: '/pages/address/list/list'
        })
    },
    jumpImg() {
        if(!this.data.token){
            return this.jumpLogin();
        }
        wx.navigateTo({
            url: '/pages/user/usersetting/usersetting'
        })
    },
    jump(e){
        if(!this.data.token){
            return this.jumpLogin();
        }
        var status=e.currentTarget.dataset.status;
        wx.navigateTo({
            url: '/pages/order/index/index?type='+status
        })
    },
    jumpAfterSales(){
        if(!this.data.token){
            return this.jumpLogin();
        }
        wx.navigateTo({
            url: '/pages/afterSales/index/index'
        })
    },
    jumpSetting(){
        if(!this.data.token){
            return this.jumpLogin();
        }
        wx.navigateTo({
            url: '/pages/user/out/out'
        })
    }
})
