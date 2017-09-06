/**
 * Created by admin on 2017/8/30.
 */
Page({
    data:{
       list:[
           '男',
           '女',
       ],
        selectedIndex:""
    },
    change:function(e){
        // console.log(e);
        // 修改选中项文案
        this.setData({
            selectedIndex:e.detail.value
        })
    }
})