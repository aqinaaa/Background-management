// 平台属性模块的管理文件
// 引入封装的axios文件
import request from '@/utils/request';
// 一级分类接口：/admin/product/getCategory1   methods: get
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: 'get' })
    // 二级分类接口：/admin/product/getCategory2/{category1Id}  methods: get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
    // 三级分类接口：/admin/product/getCategory3/{category2Id}   methods: get
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
    // 获取商品基础属性接口：url:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   method: 'get'
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
    // 添加属性接口  url:/admin/product/saveAttrInfo   post
export const reqAddOrUpdatedAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, data, method: 'post' })
    // {参数
    //     "attrName": "string",  属性名称
    //     "attrValueList": [     属性值
    //       {
    //         "attrId": 0,       属性id
    //         "valueName": "string"  属性值
    //       }
    //     ],
    //     "categoryId": 0,       categoryId3ID
    //     "categoryLevel": 0,    3
    //     "id": 0                
    //   }