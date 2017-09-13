/**
 * Created by admin on 2017/8/30.
 */
import {combineReducers} from 'redux'
import {PROJECTS_LOADED, GOODS_DETAIL, COMMODITYSPECS, COMMODITYSTORE} from './action-types'

const projects = (state = [], action) => {
    switch (action.type) {
        case PROJECTS_LOADED:
            return state.concat[action.payload]
    }

    return state
}

const goods_detail = (state = {}, action) => {

    switch (action.type) {
        case GOODS_DETAIL:
            console.log(state,action)
            return Object.assign({}, state, action.payload)
    }

    return state
}

const store_specs = (state = [], action) => {

    switch (action.type) {
        case COMMODITYSPECS:
            state = action.payload
            return state
            break;

    }

    return state;
}

const store_result = (state = {}, action) => {
    console.warn(action)
    switch (action.type) {
        case COMMODITYSTORE:

            return action.payload
            break

    }

    return state;
}


export default combineReducers({
    projects,
    goods_detail,
    store_specs,
    store_result
})

