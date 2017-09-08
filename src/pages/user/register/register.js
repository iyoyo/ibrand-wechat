var app = getApp();

Page({
    data:{
        code:{
            total:60,
            access_token:null,
            codeText:"获取验证码"
        },
        tellphone:"",
        identifyingcode:"",
        sending:false,
        checked:false,
        orginUrl:"",
        showLoading: false
    },
    submit() {
        wx.chooseImage({
            success: res => {
                console.log(res);
            }
        })
    },
    changeChecked(e){
        // console.log(e);
        this.setData({
            checked:!this.data.checked
        })
    },
    changeCode(e){
        this.setData({
            tellphone: e.detail.value
        })
    },
    changeIdentifyCode(e){

        this.setData({
            identifyingcode: e.detail.value
        })
    },
    random(){
        return Math.random().toString(36).substr(2,24);
    },
    onLoad(e){
         this.setData({
             orginUrl:decodeURIComponent(e.url)
         })
    },
    getCode(){
        if(this.data.sending) return;
        var randoms=this.random();
        this.setData({
            sending:true,
            'code.codeText':"短信发送中",
            'code.access_token':randoms
        });
         var fn;
         fn=this.getLoginCode;
         fn(()=>{
            var total =this.data.code.total;
             this.setData({
                 'code.codeText':total+"秒后再发送"
             });
             var timer =setInterval(()=>{
                total--;
                 this.setData({
                     'code.codeText':total+"秒后再发送"
                 });
                 if(total<1){
                     this.setData({
                         sending:false,
                         'code.codeText':"获取验证码"
                     });
                     clearInterval(timer);
                 }
             },1000);
         },()=>{
             this.setData({
                 sending:false,
                 'code.codeText':"获取验证码"
             });
         });
    },
    getLoginCode(resolve,reject){
        var message =null;
        if(!this.data.tellphone){
            message = "请输入您的手机号";
        } else if(!/(^(13\d|14[57]|15[^4\D]|17[135678]|18\d)\d{8}|170[^346\D]\d{7})$/.test(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        }
        if(message){
            wx.showModal({
                title:"提示",
                content:message,
            });
            reject();
            return
        }
        wx.request({
            url:"http://api.dev.tnf.ibrand.cc/api/sms/verify-code",
            method:"POST",
            data:{
                mobile:this.data.tellphone,
                access_token:this.data.code.access_token
            },
            success:(res)=>{
                // console.log(res);
                 if(res.data.success){
                     resolve();
                 }
                 else{
                     reject();
                 }
            }
        })
        // resolve();
    },
    submit(){
        var message=null;
        if(!this.data.tellphone){
            message = "请输入您的手机号";
        } else if(!/(^(13\d|14[57]|15[^4\D]|17[135678]|18\d)\d{8}|170[^346\D]\d{7})$/.test(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        } else if(!this.data.identifyingcode){
            message="请填写验证码";
        } else if(!this.data.checked){
            message="请同意此协议";
        }
        if(message){
            wx.showModal({
                title:"提示",
                content:message,
            });
            return;
        }
        this.setData({
            showLoading: true
        })
         this.quickLogin();
        // wx.login({
        //     success:res=>{
        //         console.log(res);
        //     }
        // })
    },
    quickLogin(){
        var that=this;
        var data={
            grant_type: 'sms_token',
            access_token:that.data.code.access_token,
            mobile:that.data.tellphone,
            code:that.data.identifyingcode,
            type:'direct'
        };
         wx.request({
             url:"http://api.dev.tnf.ibrand.cc/api/oauth/sms",
             method:"POST",
             data:data,
             success:res=>{
                 console.log(res);
                 if(res.statusCode==500){
                     wx.showModal({
                         title:"提示",
                         content:"验证码不正确",
                     });
                 }
                 else if(res.statusCode==200){
                       var result=res.data;
                       if(result.access_token){
                           result.access_token =result.token_type + ' ' + result.access_token;
                           wx.setStorageSync("user_token",result.access_token);
                           if(this.data.orginUrl){
                               wx.redirectTo({
                                   url:"/"+this.data.orginUrl
                               })
                           }
                           else{
                               wx.redirectTo({
                                       url: '/pages/user/personal/personal'
                               })
                           }

                       }
                 }
                 // else if(){
                 //
                 // }
             },
             fail:res=>{
                 wx.showModal({
                     title:"提示",
                     content:"验证码不正确",
                 });
             },
	         complete: err => {
	             this.setData({
		             showLoading: false
	             })
             }
         })
    }
});
