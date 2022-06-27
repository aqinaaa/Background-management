// sku模块的数据请求
import request from '@/utils/request'

// 获取数据展示sku
// ----获取图片的接口：/admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
    // ----获取销售属性的接口：/admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
    // ----获取平台属性的接口:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
    //保存sku:/admin/product/saveSkuInfo
export const reqSaveSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo });
// 点击查看sku列表数据的接口
// /admin/product/findBySpuId/{spuId}    method:get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });
// --------------------------------sku组件----------------------------------------------------------------------------
// 在sku页面获取sku列表的接口
// GET /admin/product/list/{page}/{limit}
export const reqSkuLists = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });
// 上架和下架接口请求
// 上架：GET /admin/product/onSale/{skuId}
export const reqonSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });
// 下架：GET /admin/product/cancelSale/{skuId}
export const reqcancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });
// 获取sku详情页
// GET /admin/product/getSkuById/{skuId}   get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });