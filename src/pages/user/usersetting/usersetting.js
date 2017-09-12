/**
 * Created by admin on 2017/8/30.
 */
import {config,getUrl,pageLogin} from '../../../lib/myapp.js';

Page({
    data:{
       list:[
           '男',
           '女',
       ],
        selectedIndex:"",
        detail:""
    },
    change:function(e){
        // console.log(e);
        // 修改选中项文案
        this.setData({
            selectedIndex:e.detail.value
        })
    },
    changeName(e){
        this.setData({
            'detail.nick_name':e.detail.value
        })
    },
    onShow(){
        pageLogin(getUrl(),()=>{
            this.gitUserInfo()
        });
    },
    gitUserInfo(){
        wx.request({
            url: config.GLOBAL.baseUrl + 'api/me',
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            success: res => {
                if(res.data.status){
                    var sex=res.data.data.sex;
                    var index=this.data.list.findIndex((val)=>{ return val==sex});
                    if(index==-1) index="";
                    this.setData({
                        detail:res.data.data,
                        selectedIndex:index
                    })
                }
            }
        })
    },
    changeImage:function(){
        wx.chooseImage({
            count:1,
            success: res => {
                var tempFilePaths = res.tempFilePaths;
                var token=wx.getStorageSync('user_token');
                 wx.uploadFile({
                    header: {
                        'content-type':'multipart/form-data',
                        Authorization:token
                    },
                    url: 'http://api.dev.tnf.ibrand.cc/api/users/upload/avatar', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'avatar_file',
                    success: (res)=>{
                        console.log(res);
                        var result = JSON.parse(res.data);
                        console.log(result);
                        this.setData({
                            'detail.avatar':result.data.url
                        });

                        //do something
                        // wx.hideLoading();
                    }
                });
                // uploadTask.onProgressUpdate((res) => {
                //     wx.showLoading({
                //         title: "上传中",
                //         mask: true
                //     });
                // })
            }
        })
    },
    updateUserInfo(){
        var message=null;
        if(!this.data.detail.nick_name){
            message="请填写用户昵称";
        }
        if(message){
            wx.showModal({
              title: '提示',
              content: message
            });
            return
        }


         wx.request({
             url: config.GLOBAL.baseUrl +'api/users/update/info',
             header:{
                 Authorization:wx.getStorageSync('user_token')
             },
             method:"POST",
             data:{
                 nick_name:this.data.detail.nick_name,
                 sex:this.data.list[this.data.selectedIndex],
                 avatar:this.data.detail.avatar
             },
             success:res=>{
                 console.log(res);
                 if(res.statusCode==200){
                     wx.showToast({
                         title:res.data.message,
                         duration: 1500,
                         success:()=>{
                             setTimeout(()=>{
                                 wx.redirectTo({
                                     url: '/pages/user/personal/personal'
                                 })
                             },1500);
                         }
                     })
                 }
                 else{
                     wx.showModal({
                         title:"提示",
                         content:"修改失败",
                     });
                 }
             }
         })
    }
})