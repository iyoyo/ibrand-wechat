Page({
    data:{
        list:"",
        codeList:"",
        selectedIndex:"",
        codeNumber:"",
        refundNo:"",
        token:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjQzNzM0ZTI5ZWRhZTM4MDNiY2FmZTNlNjhlMTUyOWNkYjJkYjVlZTViYzQyYzk0ZWRhZTEzY2JjMDhiZTE3NmFkOGY1NWIzZDFmODIwOWUxIn0.eyJhdWQiOiIxIiwianRpIjoiNDM3MzRlMjllZGFlMzgwM2JjYWZlM2U2OGUxNTI5Y2RiMmRiNWVlNWJjNDJjOTRlZGFlMTNjYmMwOGJlMTc2YWQ4ZjU1YjNkMWY4MjA5ZTEiLCJpYXQiOjE1MDM2MzkwNDcsIm5iZiI6MTUwMzYzOTA0NywiZXhwIjoxODE5MTcxODQ3LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.j6JptbhqAheBqwZC4k4Fm9bd93oCCnGZDvwiHvFssvsIM-GIsKKIPA3gmeDoQaQRY2JeI3Tff1tz5uF1mwqbW_uexuPn80jicfvbGSljlrOkiU9s_rB1o20lLuZTc149it2x6IPAkDLSXIW3IZVOr7WQpyeM2gDgGBXeoV6OIjOggSpc1wKE25hEX2xhfQ7AyYrCihLbeCHqgSDxXEnS5MwY0XgV1vjd9yM6MyGaOFs05WDOhdeqf6I8gVRTT21dYjwM020-tWZMaHSJd3B6zhWHu_4V5Ql8tb3kP1jPgrPkeJhJgdRYWf_6Thiea32BsvEyCK2aT1vK03nOsj1kE78-SY52d6dTIg5syrwQyOgtq-KrmFw_EDCb_fZN-RCEgsGzSfajt984tDiI81-rFrx6jx9FfhS2tNut9ZqjtSctGhVrHY59CgSGjwDf-uLrZD7Ee0pAG2VhC4EYA9iZnr8oyw6Jxx4UIlWfh_-z8LHaglex1oRr_8cwUGkCvSrFXRojxobcxGDtjXW8o_tIhbgmkw57hle7wzdPFnyEIlR1Ap12bPtUhH7OyMCH9UTGTWXzUaW18UuH_-vrb1XUsv-fIm6BHQ4ic8824uUNVTTj4kRUQr99PCZ2K_9itvrDeETlgKbKXCpMjgO3f_t5ujv1DEemctxn76v9OHJ9pHg"
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
        var that=this;
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/shipping/methods",
            header:{
                Authorization:that.data.token
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
        var token=this.data.token;
        wx.request({
           url:"http://api.dev.tnf.ibrand.cc/api/refund/user/return",
            header:{
                Authorization:token
            },
            method:"POST",
            data:applyItem,
            success:res=>{
               // if(re)

                if(res.data.status){
                    wx.showToast({
                        title:"提交申请成功",
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
                        title:"提交申请失败",
                        duration: 1500
                    })
                }
            }
        });
    }
})