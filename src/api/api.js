import { getAction, postAction, putAction } from '@/api/manage'

// 设备管理
export const getDevicePage = (params) => getAction('/hik/device', params)
// 从局域网扫描出来的设备列表
export const getDeviceSearchPage = (params) => getAction('/hik/device/search', params)
export const addDevice = (params) => postAction('/hik/device', params)
export const modifyDevice = (params) => putAction('/hik/device', params)

// 区域管理
export const getCategoryPage = (params) => getAction('/hik/category', params)
export const getCategoryList = (params) => getAction('/hik/category/list', params)
export const addCategory = (params) => postAction('/hik/category', params)
export const modifyCategory = (params) => putAction('/hik/category', params)

// hik接口
export const deviceLogin = (params) => postAction('/hik/api/deviceLogin', params)
export const deviceClean = (params) => postAction('/hik/api/deviceClean', params)
export const deviceSetupAlarm = (params) => postAction('/hik/api/deviceSetupAlarm', params)
export const deviceCloseAlarm = (params) => postAction('/hik/api/deviceCloseAlarm', params)
export const deviceStartPushStream = (params) => postAction('/hik/api/deviceStartPushStream', params)
export const deviceExistPushStream = (params) => postAction('/hik/api/deviceExistPushStream', params)
export const deviceStreamList = (params) => postAction('/hik/api/deviceStreamList', params)
