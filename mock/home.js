// const Mock = require('mockjs')

// const data = Mock.mock({
//     'items|30': [{
//         id: '@id',
//         title: '@sentence(10, 20)',
//         'status|1': ['published', 'draft', 'deleted'],
//         author: 'name',
//         display_time: '@datetime',
//         pageviews: '@integer(300, 5000)'
//     }]
// })
// ------------------------------------以上是在使用mock模拟数据------------，这里我们不需要，直接从准备好的data.json文件夹中引入即可
const data = require('./data.json');

module.exports = [{
    url: '/home/list', //数据可视化接口
    type: 'get',
    response: config => {
        // const items = data.items(不需要，删)
        return {
            code: 20000,
            data //kv一致，省略v
        }
    }
}]