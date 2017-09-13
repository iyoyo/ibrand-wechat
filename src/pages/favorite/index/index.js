import {config} from '../../../lib/myapp.js';
Page({
	data: {
		page: 1,
		show: false,
		edit: false,
		meta: '',
		total: 0,
		dataList: [],
		checkList: [],
		allCheck: false,
		token: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjRkMGFhNTM1MzU3ZDExOTc2NDA5Njg0ZTA3ZjdlODRjM2EzODRlYmVlNDc0OTYxMmNiMjgxOWFjOTkyMWQzYmZiMWUzNmU2M2M4YTU1OWMyIn0.eyJhdWQiOiIxIiwianRpIjoiNGQwYWE1MzUzNTdkMTE5NzY0MDk2ODRlMDdmN2U4NGMzYTM4NGViZWU0NzQ5NjEyY2IyODE5YWM5OTIxZDNiZmIxZTM2ZTYzYzhhNTU5YzIiLCJpYXQiOjE1MDUyMTE4OTYsIm5iZiI6MTUwNTIxMTg5NiwiZXhwIjoxODIwNzQ0Njk2LCJzdWIiOiI0OTUiLCJzY29wZXMiOltdfQ.Hsvxv48y8f6HaxGCk7wUvAvXsYPNSRZLF4oBGvLKjo015FY59fPw_BSli5xeMKMsqG97ST1bjsKz9jA2HlnnikPZCDHrCxVwMrHtug2k2Pdr343iYH98wYxwhKIeCwlT8TpzM2c3CDEPLUcvd8Mdxgndekpm-5Y9bG5lcaW7lM1iRaUzzxM2vghpc2xPLDbj6K-SEk6YHkw0UYEcpHJnE1qXom59SOeigJbTDUozRpz9wYLyhB5L3WcU1hs1NDC68B16X32oVWCYVKAV2wpGfgEv8mZt2TtS6eo45GoRvrHMfFI7CnZZAXDAYJus1kQlGaCoA1mc6YnJgENFbHDFDET3uzVWbtg6Kc2bm-lqbo8jF4NOxVMbm2MhkROQ9fKL3E8Ker41KhNJxLmR1wEPr2aWpIhgBKk77vblWDlnuRyh4ZN5GOTAUh5PqXMJ8qbvORzExvdeyx5lwbjCWUqRy8XTuB2dZh7bIzqh-d_-qGdEwaOxeGFJ_TCGGCo9tmqgUhavw39iJ3KWF6abUZtBgV6iEVJuP3uFtzY94Yr5h5aE_zJjPeCZELB-b_k07V-Ytn3SzirsFT9AntcE0YAA0MFyJJMBQ4B0XIf21wyUc6ITzj_xjZeX1pOhl3-Qfu_CK0dqc0gcG9nZSLAiDHHC-n6nA-LTjiHOptiiZ_b3lg0'
	},
	onLoad() {
		this.queryFavoriteList();
	},
	onReachBottom() {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			this.setData({
				show: true
			});

			var page = this.data.meta.pagination.current_page + 1;
			this.queryFavoriteList(page);
		} else {
			wx.showToast({
				image: '../../../assets/image/error.png',
				title: '再拉也没有啦'
			});
		}
	},
	edit() {
		this.setData({
			edit: !this.data.edit
		})
	},
	select(e) {
		var value = e.detail.value;
		var newList = this.data.dataList;
		if (value.length == this.data.total) {
			// this.setData({
			// 	allCheck: true
			// })
			newList.forEach(v => {
				v.forEach(i => {
					i.isCheck =true
				})
			});
			console.log(newList);
		} else {
			// var f = false
			// this.setData({
			// 	allCheck: f
			// })
		}
		// return value
		// console.log(value)
	},
	click() {
		// this.setData({
		// 	allCheck: !this.data.allCheck
		// })
		// var newList = this.data.dataList;
		// newList.forEach(v => {
		// 	v.forEach(i => {
		// 		i.isCheck =true
		// 	})
		// });
		// this.setData({
		// 	dataList: newList
		// })

	},
	// click(e) {
	// 	var index = e.currentTarget.dataset.index;
	// 	var value = e.currentTarget.dataset.value;
	// 	var fIndex = e.currentTarget.dataset.findex;
	// 	var isCheck = e.currentTarget.dataset.ischecked;
	// 	var list = `dataList[${fIndex}]`;
	// 	if (!isCheck) {
	// 		this.checkList().push(value)
	// 		// this.setData({
	// 		// 	checkList: this.data.checkList.push(value)
	// 		// })
	// 	} else {
	// 		this.checkList().splice(index,1)
	// 		// this.setData({
	// 		// 	checkList: this.data.checkList.splice(index,1)
	// 		// })
	// 	}
	// 	console.log(this.checkList())
	// 	this.setData({
	// 		[`${list}[${index}].isCheck`]: !this.data.dataList[fIndex][index].isCheck
	// 	})
	// },
	cancel() {
		var data = {
			array: this.data.checkList,
			dataList: this.data.dataList,
			checkList: this.data.checkList
		}
		if (this.data.checkList.length === 0) {
			wx.showModal({
			  title: '',
			  content: '请选择你要删除的收藏',
				showCancel: false
			})
		} else {
			wx.showModal({
			  title: '',
			  content: '是否取消收藏',
			  success: res=>{
			    if (res.confirm) {
			    	this.removeBatchFavorite(data);
			    }
			  }
			})
		}
	},
	// 查询收藏列表
	queryFavoriteList(status = 0, page = 1) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/favorite',
			header: {
				Authorization: this.data.token
			},
			data: {
				page: page
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						var pages = res.meta.pagination;
						var current_page = pages.current_page;
						var total_pages = pages.total_pages;
						var total = res.meta.pagination.total;
						res.data.forEach(v => {
							v.remove = false;
							v.isCheck = false
						})
						this.setData({
							total: total,
							[`dataList[${page -1}]`]: res.data,
							meta: res.meta
						})
					} else {
						wx.showModal({
							title: '',
							content: res.message,
							showCancel: false
						})
					}
				} else {
					wx.showModal({
						title: '',
						content: "请求失败",
						showCancel: false
					})
				}
			}
		})
	},
	// 批量删除收藏
	removeBatchFavorite(data) {
		var token = wx.getStorageSync('user_token');

		wx.request({
			url: config.GLOBAL.baseUrl + 'api/favorite/delFavs',
			method: 'POST',
			data: {
				favoriteable_id: data.array,
				favoriteable_type: 'goods'
			},
			header: {
				Authorization: token
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					var dataList = data.dataList;
					var checkList = data.checkList;
					if (res.status) {
						for (let item of dataList) {
							if (checkList.indexOf(item.favoriteable_id) != -1) {
								item.remove = true
							}
						}
						this.setData({
							total: this.data.total -= this.checkList.length,
							checkList: []
						})
					} else {
						wx.showModal({
							title: '',
							content: res.message,
							showCancel: false
						})
					}
				} else {
					wx.showModal({
						title: '',
						content: "请求失败",
						showCancel: false
					})
				}
			}
		})
	}
})