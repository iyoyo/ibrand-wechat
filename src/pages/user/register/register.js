import {is,config} from '../../../lib/myapp.js';
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
        showLoading: false,
        message:"",
	    open_id: ''
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
         });
    },
    onShow() {
        wx.login({
	        success: res => {
	            if (res.code) {
	                this.autoLogin(res.code);
                } else {
		            wx.showToast({
			            title: '获取code失败',
			            image: '../../../assets/image/error.png'
		            })
                }
            }
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
        if(!is.has(this.data.tellphone)){
            message = "请输入您的手机号";
        } else if(!is.mobile(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        }
        if(message){
            this.setData({
                message:message
            });
            reject();
            setTimeout(()=>{
                this.setData({
                    message:""
                });
            },3000)
            return
        }
        wx.request({
            url:config.GLOBAL.baseUrl+"api/sms/verify-code",
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
        if(!is.has(this.data.tellphone)){
            message = "请输入您的手机号";
        } else if(!is.mobile(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        } else if(!is.has(this.data.identifyingcode)){
            message="请填写验证码";
        } else if(!is.has(this.data.checked)){
            message="请同意此协议";
        }
        if(message){
            this.setData({
                message:message
            });
            setTimeout(()=>{
                this.setData({
                    message:""
                });
            },3000)
            return
        }
        this.setData({
            showLoading: true
        })
         this.quickLogin();
    },
    quickLogin(){
        var that=this;
        var data={
            grant_type: 'sms_token',
            access_token:that.data.code.access_token,
            mobile:that.data.tellphone,
            code:that.data.identifyingcode,
            type:'miniprogram',
            open_id: this.data.open_id
        };
         wx.request({
             url:config.GLOBAL.baseUrl+"api/oauth/sms",
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
                           if(this.data.orginUrl != 'undefined'){
                               wx.redirectTo({
                                   url:"/"+this.data.orginUrl
                               })
                           } else {
                               wx.switchTab({
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
    },
    autoLogin(code) {
        wx.request({
            url: config.GLOBAL.baseUrl + 'api/mini/program/login',
	        method: "POST",
	        data: {
                code: code
            },
            success: res => {
                if (res.statusCode == 200) {
                    res = res.data;
                    if (res.status) {
	                    // 没能自动登录会返回open_id
	                    if (res.data.open_id) {
		                    this.setData({
			                    open_id: res.data.open_id
		                    })
	                    } else {
	                        if (res.access_token) {
		                        var access_token = res.token_type + '' + res.access_token;
		                        wx.setStorageSync("user_token",access_token);
		                        wx.switchTab({
			                        url: '/pages/user/personal/personal'
		                         })
                            } else {

		                        wx.showToast({
			                        title: '获取用户信息失败',
			                        image: '../../../assets/image/error.png'
		                        })
                            }

	                    }
                    } else {
	                    wx.showToast({
		                    title: res.message,
		                    image: '../../../assets/image/error.png'
	                    })
                    }

                } else {
	                wx.showToast({
		                title: '获取信息失败',
		                image: '../../../assets/image/error.png'
	                })
                }
            }
        })
    }
});
