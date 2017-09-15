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
	onShow() {
		this.queryFavoriteList();
	},
	onReachBottom() {
		var hasMore = this.data.meta.pagination.total_pages > this.data.meta.pagination.current_page;
		if (hasMore) {
			this.setData({
				show: true
			});

			var page = this.data.meta.pagination.current_page + 1;
			this.queryFavoriteList(0,page);
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
		var newList = [];
		if (value.length == this.data.total) {
			this.setData({
				allCheck: true
			})
		} else {
			this.setData({
				allCheck: false
			})
		}

		value.forEach(v => {
			v=parseInt(v);
			newList.push(v);
		})
		this.setData({
			checkList: newList
		})
	},
	click() {
		var newList = this.data.dataList;
		if (this.data.allCheck) {
			newList.forEach(v => {
				v.forEach(i => {
					i.isCheck =false
				})
			});
			this.setData({
				checkList: []
			})
		} else {
			var checkList = [];
			newList.forEach(v => {
				v.forEach(i => {
					i.isCheck =true
				})
			});
			newList.forEach(v => {
				v.forEach(i => {
					checkList.push(i.favoriteable_id)
				})
			});
			this.setData({
				checkList: checkList
			})
		}
		this.setData({
			dataList: newList,
			allCheck: !this.data.allCheck
		})

	},
	fClick(e) {
		var index = e.currentTarget.dataset.index;
		var value = e.currentTarget.dataset.value;
		var fIndex = e.currentTarget.dataset.findex;
		var isCheck = e.currentTarget.dataset.ischecked;
		var list = `dataList[${fIndex}]`;
		this.setData({
			[`${list}[${index}].isCheck`]: !this.data.dataList[fIndex][index].isCheck
		})
	},
	cancel() {
		var data = {
			checkList: this.data.checkList,
			dataList: this.data.dataList
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
	jump(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
		  url: '/pages/store/detail/detail?id=' + id
		})
	},
	// 查询收藏列表
	queryFavoriteList(status = 0, page = 1) {
		var token = wx.getStorageSync('user_token');
		wx.request({
			url: config.GLOBAL.baseUrl + 'api/favorite',
			header: {
				Authorization: token
			},
			data: {
				page: page
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						var pages = res.meta.pagination;
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
			},
			complete: err => {
				this.setData({
					show: false
				})
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
				favoriteable_id: data.checkList,
				favoriteable_type: 'goods'
			},
			header: {
				Authorization: token
			},
			success: res => {
				if (res.statusCode == 200) {
					res = res.data;
					if (res.status) {
						var dataList = data.dataList;
						var checkList = data.checkList;
						dataList.forEach((v, idx) => {
							v.forEach((i, index) => {
								if (checkList.indexOf(i.favoriteable_id) != -1) {
									this.setData({
										[`dataList[${idx}][${index}].remove`]: true
									})
								}
							})
						});
						this.queryFavoriteList();
						this.setData({
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