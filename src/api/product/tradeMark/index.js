// 这个模块主要获取的是品牌管理的数据的模块
// 引入封装的axios文件
import request from '@/utils/request';

// 获取品牌列表接口
//GET /admin/product/baseTrademark/{page}/{limit}   请求方式：get

export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, methods: 'get' });
// 处理添加品牌
// 新增品牌：/admin/product/baseTrademark/save  POST  携带参数： "logoUrl": "string", "tmName": "string
// 切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID由服务器生成

// 修改品牌：/admin/product/baseTrademark/update  PUT  携带参数：  "id": 0, "logoUrl": "string",  "tmName": "string"
// 切记：对于修改某一品牌的操作，前端携带的参数需要带上id，需要告诉服务器修改的是哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
        // 判断：带给服务器的参数携带ID
        if (tradeMark.id) {
            // 如果携带参数：---修改品牌
            return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark });
        } else {
            // 如果没有携带参数：---新增品牌
            return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark });
        }
    }
    // 删除品牌
    // /admin/acl/permission/remove/{id}   delete  
export const reqDeleteTradeMark = (id) => request({ url: `/admin/acl/permission/remove/${id}`, method: 'delete' })