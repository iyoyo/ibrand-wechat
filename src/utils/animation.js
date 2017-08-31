/**
 * Created by admin on 2017/8/29.
 */

export default class Animation {

    constructor (id,opts = {},name = 'animation'){

        this.id = id;
        this.opts = opts;
        this.page = getCurrentPages()[getCurrentPages().length - 1];
        this.setData = this.page.setData.bind(this.page);
        this.animate = wx.createAnimation(Object.assign({
            duration:350,
            timingFunction:'linear',
            delay:0,
        },opts));

        this.name = name
        this.page.data[`${id}.${name}`] = {}
    }

    up(){
        this.animate.translate3d(0,'100%',0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })

    }


    positionInit () {
        this.animate.translate3d(0,0,0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })

    }

    down(){
        this.animate.translate3d(0,'-100%',0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })
    }

    left(){
        this.animate.translate3d('-100%',0,0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })

    }

    right(){
        this.animate.translate3d('100%',0,0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })
    }


    expandUp(){
        this.animate.height(0).step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })
    }


    expandDown(){
        this.animate.height('100%').step();
        this.setData({
            [`${this.id}.${this.name}`] : this.animate.export()
        })
    }

}