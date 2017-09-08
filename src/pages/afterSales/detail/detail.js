/**
 * Created by admin on 2017/8/31.
 */
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
        token:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg"
    },
    onLoad(e){
        var id=e.no;
        var token='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg';
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/refund/show/"+id,
            header:{
                Authorization:token
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
    viewExpress(e){
        var refund_no=e.currentTarget.dataset.refundNo;
        wx.navigateTo({
            url: '/pages/afterSales/retreat/retreat?no='+refund_no
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
         var that=this;
        this.setData({
            showReason:false,
            cacelReason:""
        });
         // 退款
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/refund/user/close",
            header:{
                Authorization:that.data.token
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
                                 wx.navigateTo({
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