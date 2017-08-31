/**
 * Created by admin on 2017/8/30.
 */
import { combineReducers } from 'redux'
import { PROJECTS_LOADED } from './action-types'

const projects = (state = [], action) => {
    switch (action.type) {
        case PROJECTS_LOADED:
            return state.concat[action.payload]

    }

    return state
}


export default combineReducers({
    projects
})

