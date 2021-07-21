import request from '@/utils/request'

const api = {
  user: '/sys/user',
  addUser: '/sys/user',
  modifyUser: '/sys/user',
  deleteUser: '/sys/user/',
  role: '/sys/role',
  service: '/other/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function addUser (parameter) {
  return request({
    url: api.addUser,
    method: 'post',
    params: parameter
  })
}

export function modifyUser (parameter) {
  return request({
    url: api.modifyUser,
    method: 'put',
    params: parameter
  })
}

export function deleteUser (parameter) {
  return request({
    url: api.deleteUser + parameter,
    method: 'delete'
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
