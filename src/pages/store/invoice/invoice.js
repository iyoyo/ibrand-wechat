Page({
	data: {
		type: 'solo',
		checked: []
	},
	change(e) {
		this.setData({
			type: e.detail.value
		})
	}

})