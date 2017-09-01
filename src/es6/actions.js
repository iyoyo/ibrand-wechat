/**
 * Created by admin on 2017/8/30.
 */
import { PROJECTS_LOADED ,GOODS_DETAIL} from './action-types'
import { sandBox } from './sandBox'


 const loadProjects = () => {
    return (dispatch) => {

        sandBox.APIs.PROJECT.load({api:'org/octokit/repos'},PROJECTS_LOADED,dispatch)
    }
}


 const getGoodsDetail = (id) => {

    return (dispatch) => {

        sandBox.APIs.STORE.DETAIL.get({api:`store/detail/${id}`,data:{include: 'photos,products,oneComment,guessYouLike,whoLike,point'}},{dispatch:dispatch,action_type:GOODS_DETAIL})
    }
}

export default {
    loadProjects,
    getGoodsDetail
}
