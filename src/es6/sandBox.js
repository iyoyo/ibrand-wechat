/**
 * Created by admin on 2017/8/30.
 */
import weapp from 'weapp-next'
import config from './config'
const {Http} = weapp(wx);
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
            http.post(api, {data: data})
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
                        type: params.PROJECTS_LOADED,
                        payload: res
                    }))
                    .catch(err => console.log(err))
            }
        },
        STORE: {
            DETAIL: {
                get (obj, action){

                    sandBox.get(obj)
                        .then(res => {
                            return action.dispatch({
                                type: action.action_type,
                                payload: res.data
                            })
                        })
                        .catch(err => console.log(err))

                },
                queryCommodityStore (obj, action) {

                    sandBox.get(obj)
                        .then(res => {

                            res = res.data
                            if (!res.status || !res.data || !res.data.specs) return;
                            if (res.data.specs && typeof obj.key === 'undefined') {
                                let specs = [];

                                Object.keys(res.data.specs)
                                    .forEach((key, index) => {
                                        let value = res.data.specs[key];
                                        value.select = '';
                                        value.values = value.list
                                            .map(v => {
                                                return Object.assign({
                                                    index: index,
                                                    active: false,
                                                    disabled: false
                                                }, v);
                                            });

                                        delete value.list;
                                        specs.push(value);
                                    });



                                 action.dispatch({
                                    type: action.action_specs,
                                    payload: specs
                                })
                            }

                            if (res.data.stores) {
                                let data = {};
                                Object.keys(res.data.stores)
                                    .forEach(key => {
                                        let value = res.data.stores[key];

                                        value.ids.forEach(id => {
                                            data[id] = data[id] || {count: 0, specs: {}};
                                            data[id].count += parseInt(value.store);

                                            value.ids.forEach(i => {
                                                if (i === id) return;

                                                data[id].specs[i] = {
                                                    count: parseInt(value.store)
                                                };
                                            })
                                        });
                                    });
                                // console.log(data);
                                var result = {data, table: res.data.stores,key:obj.key};

                                 action.dispatch({
                                    type: action.action_store,
                                    payload: result,
                                })
                                // this.$emit('specStore', result, key);
                            }

                        })
                        .catch(err => {

                        })
                }
            }
        }
    }
};