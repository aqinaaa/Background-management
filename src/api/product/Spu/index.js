// spu模块的数据请求
import request from '@/utils/request'

// 获取spu基本信息: get /admin/product/{page}/{limit}   params:category3Id (注意这里是params参数,不是query参数)
export const reqSpuProduct = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })
    // 获取spuform信息
    // /admin/product/getSpuById/{spuId}  get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });
// 获取品牌信息
// /admin/product/baseTrademark/getTrademarkList  get
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })
    // 获取spu图标的接口
    // GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
    // 获取平台全部销售属性--整个平台的销售属性一共三个
    // /admin/product/baseSaleAttrList  get
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })
    // 修改spu||添加spu:对于修改或者添加，携带给服务器参数大致一样的，唯一的区别就是携带的参数时候带有id
export const reqAddOrUpdateSpu = (spuInfo) => {
        // 携带的参数带有id----修改spu
        if (spuInfo.id) {
            return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
        } else {
            // 携带的参数不带id----添加spu
            return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
        }
    }
    // 删除spu行操作
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})