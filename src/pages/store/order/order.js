var app = getApp();
Page({
	data: {
		show: false,
		checked: null
	},
	change(e) {
		this.setData({
			checked: e.detail.value
		})
	},
	select() {
		this.setData({
			show: true
		})
	},
	cancel() {
		this.setData({
			checked: null,
			show: false
		})
	}
})