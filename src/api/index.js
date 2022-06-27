import * as trademark from './product/tradeMark'
import * as attr from './product/Attr'
import * as sku from './product/Sku'
import * as spu from './product/Spu'
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'
// 对外暴露
export default {
    trademark,
    attr,
    spu,
    sku,
    user,
    role,
    permission
}