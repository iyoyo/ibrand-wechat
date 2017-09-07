/**
 * Created by admin on 2017/8/30.
 */
Page({
    data:{
       list:[
           '男',
           '女',
       ],
        selectedIndex:"",
        img:""
    },
    change:function(e){
        // console.log(e);
        // 修改选中项文案
        this.setData({
            selectedIndex:e.detail.value
        })
    },
    changeImage:function(){
        wx.chooseImage({
            count:1,
            success: res => {
                var tempFilePaths = res.tempFilePaths;
                var token=wx.getStorageSync('iBrand_user_token');
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
                            img:result.data.url
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
    }
})