/**
 * Created by admin on 2017/8/30.
 */
import weapp from 'weapp-next'
import config from './config'
const { Http } = weapp(wx);
const http = Http(config.GLOBAL.baseUrl);
export const sandBox = {

    get({api, data}){
        return new Promise((resolve, reject) => {
            http.get(api, data)
                .then((response) => {
                console.log(response)
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    post({api, data}){
        return new Promise((resolve, reject) => {
            http.get(api, {data: data})
                .then((response) => {
                    resolve(response)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    },
    APIs: {
        PROJECT: {
            load(obj, ...params){
               
                obj.api = `org/octokit/repos`;
                sandBox.get(obj)
                    .then(res => params.dispatch({
                        type:params.PROJECTS_LOADED,
                        payload:res
                    }))
                    .catch(err => console.log(err))
            }
        },
        STORE:{
            DETAIL:{
                get (obj,action){

                    sandBox.get(obj)
                        .then(res => {
                           return action.dispatch({
                                type:action.action_type,
                                payload:res.data
                            })
                        })
                        .catch(err => console.log(err))

                }
            }
        }
    }
};