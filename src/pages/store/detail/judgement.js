/**
 * Created by Administrator on 2017/7/25.
 */
(function () {

	// 判断当前域名
	if (window.location.host != 'tnf.ibrand.cc') {
		window.location.href = 'http://tnf.ibrand.cc'
	}

	// 判断是否为移动端设备
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios)/i)) {
		window.location.href = 'http://tnf.ibrand.cc'
	} else {
		window.location.href = 'http://tnf.ibrand.cc'
	}

})();