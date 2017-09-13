import {config,is,getUrl,pageLogin} from '../../../lib/myapp.js';
Page({
    data:{
        list:[
            '退货退款'
        ],
        // 最大的申请数量
        maxNum:"",
        selectedIndex:"",
        // 申请数量
        applyNum:1,
        // 退款金额
        amount:"",
        // 问题描述
        qestionDetail:"",
        // 可退的金额
        availableAmount:"",
        imgList:[],
        order_id:"",
        order_item_id:"",
        good:{
            money:"",
            number:""
        }
    },
    changeValue(e){
        var amount=Number(e.detail.value);
        if(amount>this.data.availableAmount){
            amount=this.data.availableAmount
        }
        this.setData({
            amount:amount
        });
    },
    changeDetail(e){
        var str=e.detail.value;
        if(e.detail.value.length>150) {
             wx.showModal({
              title: '提示',
              content: '超出字数限制'
            });
           str=str.slice(0,150);
        }
        this.setData({
            qestionDetail:str
        });
    },
    setAmount(i){
        this.setData({
            availableAmount:(((this.data.good.money)/this.data.good.number)*i).toFixed(2)
        })
    },
    change:function(e){
        // console.log(e);
        // 修改选中项文案
        this.setData({
            selectedIndex:e.detail.value
        })
    },
    getValue:function(e){
        console.log(e.detail.value)
    },
    onLoad(e){
        var id=e.id,
            no=e.no;
        this.setData({
            order_id:no,
            order_item_id:id
        });
        pageLogin(getUrl(),()=>{
            this.queryRefundBaseInfo(id);
        })
    },
    deleteImg(e){
        var i=e.currentTarget.dataset.index;
        var arr=this.data.imgList;
        arr.splice(i,1);
        this.setData({
            imgList:arr
        })
    },
    selectImage(){
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
                    url: config.GLOBAL.baseUrl+'api/users/upload/avatar', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'avatar_file',
                    success: (res)=>{
                        var result = JSON.parse(res.data);
                        var arr=this.data.imgList;
                            arr.push(result.data.url);
                        // this.data.imgList.push();
                        this.setData({
                            imgList:arr
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
    submitApplication(){
        var applyItem ={
            order_no:this.data.order_id,
            order_item_id:parseInt(this.data.order_item_id),
            quantity:parseInt(this.data.applyNum),
            images:this.data.imgList,
            amount:parseFloat(this.data.amount),
            content:this.data.qestionDetail,
            type:this.data.selectedIndex
        },message=null;
        if(!is.has(applyItem.type)){
            message="请选择售后类型";
        }
        else if(!is.has(applyItem.amount)){
            message='请填写退款金额';
        }else if(!is.has(applyItem.content)){
            message="请输入问题描述";
        }
        if(message){
            wx.showModal({
              title: '提示',
              content:message
            })
        }else{
            applyItem.type=parseInt(applyItem.type)+1;
            this.applyretreat(applyItem);
        }
    },
    applyretreat(data){
        wx.request({
            url:config.GLOBAL.baseUrl+"api/refund/apply",
            method:"POST",
            data:data,
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            success:(res)=>{
                // console.log(res);
                if(res.statusCode==200){
                    var result=res.data.data;
                    if(res.data.status){
                        wx.showToast({
                            title:"申请成功请等待审核",
                            duration: 1500,
                            success:()=>{
                                setTimeout(()=>{
                                    wx.redirectTo({
                                        url: '/pages/afterSales/detail/detail?no='+result.refund_no
                                    })
                                },1500);
                            }
                        })
                    }
                }else{
                    wx.showModal({
                      title: '提示',
                      content: '申请失败',
                      success: res=>{
                        if (res.confirm) {

                        }
                      }
                    })
                }
            }
        })
    },
    plus(){
        var num=this.data.applyNum;
        num++;
        if(num>this.data.maxNum) return;
        this.setData({
            applyNum:num
        });
        this.setAmount(num)
    },
    minus(){
        var num=this.data.applyNum;
        if (num <= 1) return;
        num--;
        this.setData({
            applyNum:num
        });
        this.setAmount(num);
    },
    queryRefundBaseInfo(id){
        wx.request({
            url:config.GLOBAL.baseUrl+"api/refund/base_info",
            header:{
                Authorization:wx.getStorageSync('user_token')
            },
            data:{
                order_item_id: id
            },
            success:res=>{
                console.log(res.data);
                var store=res.data.data;
                this.setData({
                    'good.money':(store.total)/100,
                    'good.number':store.quantity,
                     availableAmount:((store.total)/100/store.quantity).toFixed(2),
                     maxNum:store.quantity
                })
            }
        });
    }
});