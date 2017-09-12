/**
 * Created by admin on 2017/8/31.
 */
import {config,getUrl,pageLogin} from '../../../lib/myapp.js';

Page({
    data:{
        showReason:false,
        detail:"",
        cancelReason:"",
        statusList:[
            '待审核',
            '审核通过',
            '拒绝申请',
            '已完成',
            '已关闭',
            '等待买家退货',
            '买家已退货',
            '等待商城发货'
        ],
        showStatus:[
            '申请审核中',
            '申请已通过',
            '拒绝申请',
            '已完成',
            '售后已关闭',
            '等待用户退货',
            '用户已退货',
            '等待商城发货'
        ],
        token: ''
    },
    onLoad(e){
        var id=e.no;
        pageLogin(getUrl(),()=>{
            this.queryAfterSalesDetail(id)
        });
    },
    viewExpress(e){
        var refund_no=e.currentTarget.dataset.refundNo;
        wx.navigateTo({
            url: '/pages/afterSales/retreat/retreat?no='+refund_no
        })
    },

    // 查询售后订单详情
    queryAfterSalesDetail(id){
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/refund/show/"+id,
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            success: res => {
                var tips=res.data.data.tips;
                tips=tips.replace(/\<br\>/g,"\n");
                res.data.data.tips=tips;
                if(res.data.status){
                    this.setData({
                        detail:res.data
                    });
                }
            }
        })
    },
    close(){
        this.setData({
            showReason:true
        });
        // wx.showModal({
        //     title:"是否取消",
        //     content:"<input type='text'/>",
        // });
    },
    cancel(){
        this.setData({
            showReason:false
        })
    },
    changeReason(e){
        this.setData({
            cancelReason: e.detail.value
        })
    },
    confirm(){
         if(!this.data.cancelReason){
             return
         }
         var reason =this.data.cancelReason;
         var refund_no=this.data.detail.data.refund_no;
        this.setData({
            showReason:false,
            cancelReason:""
        });
         // 退款
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/refund/user/close",
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            method:"POST",
            data:{
                refund_no:refund_no,
                remark:reason
            },
            success: res => {
                if(res.data.status){
                     wx.showToast({
                         title:"取消成功",
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
                        title:"取消失败",
                        duration: 1000
                    })
                }
            }
        });
    },
    onReady(){
        console.log(this.data.detail);
    }
})