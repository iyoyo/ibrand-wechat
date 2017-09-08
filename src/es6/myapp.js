/**
 * Created by admin on 2017/8/30.
 */
import {bindActionCreators} from 'redux'
import weapp from 'weapp-next'
import connect from 'redux-weapp'
import store from './store'
import actions  from './actions'
import config from './config'
import {is,getUrl} from './utils';

export {
    weapp,
    connect,
    bindActionCreators,
    store,
    actions,
    config,
	is,
	getUrl
}
