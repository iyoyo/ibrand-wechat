/**
 * Created by admin on 2017/8/30.
 */
import { combineReducers } from 'redux'
import { PROJECTS_LOADED ,GOODS_DETAIL} from './action-types'

const projects = (state = [], action) => {
    switch (action.type) {
        case PROJECTS_LOADED:
            return state.concat[action.payload]
    }

    return state
}

const goods_detail = (state = {},action) => {

    switch (action.type) {
        case GOODS_DETAIL:
            return {...action.payload,state}
    }

    return state
}


export default combineReducers({
    projects,
    goods_detail
})

