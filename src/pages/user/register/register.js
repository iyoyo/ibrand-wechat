var app = getApp();

Page({
    submit() {
        wx.chooseImage({
            success: res => {
                console.log(res);
            }
        })
    }
})
