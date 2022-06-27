const data = require('./data.json')

// 这部分代码在做什么？？
module.exports = [{
    url: '/dashboard/list',
    type: 'get',
    response: config => {
        const items = data.items
        return {
            code: 20000,
            data
        }
    }
}]