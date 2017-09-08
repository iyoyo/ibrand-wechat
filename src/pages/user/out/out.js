Page({
    jump(){
        wx.navigateTo({
            url: '/pages/user/usersetting/usersetting'
        })
    },
    logout(){
        wx.removeStorageSync('user_token');
        wx.showToast({
          title: '已成功注销该账户',
          duration:1500,
          mask:true,
          success(){
              setTimeout(()=>{
                  wx.navigateTo({
                      url: '/pages/user/register/register'
                  })
              },1500)
          }
        })
    }
})