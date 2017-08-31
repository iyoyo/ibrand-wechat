/**
 * Created by admin on 2017/8/30.
 */
import {createStore, applyMiddleware, bindActionCreators} from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'

export default function(initState = {}){
    return createStore(
        reducers,
        initState,
        applyMiddleware(thunkMiddleware)
    )
}