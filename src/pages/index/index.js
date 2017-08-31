/**
 * Created by admin on 2017/8/16.
 */
import {
    weapp,
    connect,
    bindActionCreators,
    store,
    actions
} from '../../lib/myapp.js'
import {rater,slide} from '../../component/vlc'
import Animation from '../../utils/animation'
const config = {
    data: {
        projects: []
    },

    onReady(){
        this.loadProjects()
    },

    onStateChange(nextState){
        this.setData({projects: nextState})
    }
}


const page = connect.Page(
    store(),
    (state) => ({projects: state.projects}),
    (dispatch) => {
        return {
            loadProjects: bindActionCreators(actions.loadProjects, dispatch)
        }
    }
)



Page(page(config))

