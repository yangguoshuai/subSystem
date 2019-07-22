import request from '@/utils/request'
export function page(query) {
  var pageNum = query.pageNum
  var pageSize = query.pageSize
  var cnId = query.cnId
  var cnInfo = query.cnInfo
  var tableName = 'gas_fuel_type_mapbar'
  const data = {
    pageNum,
    pageSize,
    cnId,
    cnInfo,
    tableName
  }
  return request({
    url: '/mapbarGas/selectMapbarGas',
    method: 'post',
    data
  })
}

export function insertData(query) {
  var tableName = 'gas_fuel_type_mapbar'
  var cnId = query.cnId
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  const data = {
    cnId,
    cnInfo,
    tableName
  }
  return request({
    url: '/mapbarGas/addMapbar',
    method: 'post',
    data
  })
}

export function updateData(query) {
  var tableName = 'gas_fuel_type_mapbar'
  var cnId = query.cnId
  var cnInfo
  if (query.cnInfo != null) {
    cnInfo = query.cnInfo.trim()
  } else {
    cnInfo = query.cnInfo
  }
  const data = {
    cnId,
    cnInfo,
    tableName
  }
  return request({
    url: '/mapbarGas/updateMapbar',
    method: 'post',
    data
  })
}

export function downloadData() {
  var tableName = 'gas_fuel_type_mapbar'
  return request({
    url: '/mapbarGas/exportMapbarData?tableName=' + tableName,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function uploadFile(obj) {
  var tableName = 'gas_fuel_type_mapbar'
  return request({
    url: '/mapbarGas/importFile?tableName=' + tableName,
    method: 'post',
    data: obj
  })
}
