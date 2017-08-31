/**
 * Created by admin on 2017/8/30.
 */
export default  {

    BRAND: {
        name: 'DMP',
        logo: 'NorthFace.png',
        title: 'DMP © 移动商城',
        cache: ''
    },
    GLOBAL: {
        baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.github.com/' : 'http://example.com/', // 运行时自动替换变量
        client_id: '2',
        client_secret: 'sL8ybYt3DpoxfilP5I45goZ0bsLHEcKFHF9bbnVY',
    },
    PACKAGES: {
        activity: false
    },
    VERSION:'1.2'

}