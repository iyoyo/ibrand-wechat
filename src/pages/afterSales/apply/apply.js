Page({
    data:{
        list:[
            '退货退款',
            '退货退款',
            '退货退款'
        ],
        selectedIndex:""
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
    }
})