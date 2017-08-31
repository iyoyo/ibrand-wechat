/**
 * Created by admin on 2017/8/30.
 */
import { PROJECTS_LOADED } from './action-types'
import { sandBox } from './sandBox'


 const loadProjects = () => {
    return (dispatch) => {
        sandBox.APIs.PROJECT.load({api:'org/octokit/repos'},dispatch,PROJECTS_LOADED)
    }
}

export default {
    loadProjects
}
