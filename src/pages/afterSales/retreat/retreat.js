Page({
    data:{
       list:[
           '顺丰速运',
           '圆通快递',
           '申通快递',
           '韵达快递',
           '百世汇通',
           '邮政速递'
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