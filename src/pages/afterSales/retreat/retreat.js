import {config,getUrl,pageLogin} from '../../../lib/myapp.js';
Page({
    data:{
        list:"",
        codeList:"",
        selectedIndex:"",
        codeNumber:"",
        refundNo:""
    },
    change:function(e){
        // console.log(e);
        // 修改选中项文案
        this.setData({
            selectedIndex:e.detail.value
        })
    },
    onLoad(e){
        this.setData({
           refundNo:e.no
        });
        pageLogin(getUrl(),()=>{
            this.showlogistics();
        });
    },
    showlogistics(){
        wx.request({
            url:config.GLOBAL.baseUrl+"api/shipping/methods",
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            success:res=>{
                var arr=[];
                res.data.data.forEach((val)=>{
                    arr.push(val.name);
                });
                this.setData({
                    list:arr,
                    codeList:res.data.data
                });
            }
        });
    },
    changeCodeNumber(e){
        this.setData({
            codeNumber:e.detail.value
        })
    },
    submit(){
        var message=null;
        if(!this.data.selectedIndex){
            message="请选择物流公司";
        }
        else if(!this.data.codeNumber){
            message="请填写运单号";
        }
        if(message){
            wx.showModal({
                title:"提示",
                content:message,
            });
            return
        }
        var applyItem ={
            refund_no:this.data.refundNo,
            shipping_name:this.data.codeList[this.data.selectedIndex].name,
            shipping_tracking:this.data.codeNumber,
            shipping_code:this.data.codeList[this.data.selectedIndex].code
        }
        // console.log(applyItem);
        this.return(applyItem);
    },
    return(data){
        wx.request({
            url:config.GLOBAL.baseUrl+"api/refund/user/return",
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            method:"POST",
            data:data,
            success:res=>{
                // if(re)

                if(res.data.status){
                    wx.showToast({
                        title:"提交申请成功",
                        duration: 1500,
                        success:()=>{
                            setTimeout(()=>{
                                wx.redirectTo({
                                    url: '/pages/afterSales/index/index'
                                })
                            },1500);
                        }
                    })
                }

                else{
                    wx.showToast({
                        title:"提交申请失败",
                        duration: 1500
                    })
                }
            }
        });
    }
})