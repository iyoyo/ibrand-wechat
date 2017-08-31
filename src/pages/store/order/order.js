var app = getApp();
Page({
	data: {
		show: false,
		checked: []
	},
	change(e) {
		this.setData({
			checked: [],
			[`checked.${e.detail.value}`]: true
		})
		console.log(e.detail.value)
	},
	select() {
		this.setData({
			show: true
		})
	},
	cancel() {
		this.setData({
			show: false
		})
	}
})