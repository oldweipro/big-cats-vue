<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="设备名称">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleLogin(record)">登录</a>
            <a-divider type="vertical" />
            <a @click="handleClean(record)">退出</a>
            <a-divider type="vertical" />
            <a @click="handleSetupAlarm(record)">布防</a>
            <a-divider type="vertical" />
            <a @click="handleCloseAlarm(record)">撤防</a>
            <a-divider type="vertical" />
            <a @click="handlePush(record)">推流</a>
            <a-divider type="vertical" />
            <a @click="handleExistPush(record)">停止</a>
            <a-divider type="vertical" />
            <a @click="handleStream(record)">播流</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </s-table>

      <device-form
        ref="deviceModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import {
  getDevicePage,
  addDevice,
  modifyDevice,
  getCategoryList,
  deviceLogin,
  deviceStartPushStream,
  deviceClean,
  deviceStreamList,
  deviceExistPushStream, deviceSetupAlarm, deviceCloseAlarm
} from '@/api/api'

import StepByStepModal from './StepByStepModal'
import DeviceForm from './DeviceForm'

const columns = [
  {
    title: '设备名称',
    dataIndex: 'title'
  },
  {
    title: 'IP',
    dataIndex: 'ip'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '密码',
    dataIndex: 'password',
    sorter: true
  },
  {
    title: '端口',
    dataIndex: 'port'
  },
  {
    title: '登录状态',
    dataIndex: 'loginStatus'
  },
  {
    title: '布防状态',
    dataIndex: 'alarmStatus'
  },
  {
    title: '推流状态',
    dataIndex: 'pushStatus'
  },
  {
    title: '更新时间',
    dataIndex: 'createTime',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'Device',
  components: {
    STable,
    Ellipsis,
    DeviceForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getDevicePage(requestParameters)
          .then(res => {
            return res.result
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    getCategoryList().then(res => {
      this.$refs.deviceModal.categoryList = res.result
    })
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleLogin (record) {
      if (record.id > 0) {
        // 登录接口
        new Promise((resolve, reject) => {
          deviceLogin(record).then(response => {
            console.log(response)
            // 获取返回的结果
            const result = response.result
            this.$message.info('登录成功')
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
        }
    },
    handleClean (record) {
      if (record.id > 0) {
        // 登录接口
        new Promise((resolve, reject) => {
          deviceClean(record).then(response => {
            console.log(response)
            // 获取返回的结果
            const result = response.result
            this.$message.info('退出成功')
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
        }
    },
    handleSetupAlarm (record) {
      if (record.id > 0) {
        // 登录接口
        new Promise((resolve, reject) => {
          deviceSetupAlarm(record).then(response => {
            console.log(response)
            // 获取返回的结果
            const result = response.result
            this.$message.info('布防成功')
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
        }
    },
    handleCloseAlarm (record) {
      if (record.id > 0) {
        // 登录接口
        new Promise((resolve, reject) => {
          deviceCloseAlarm(record).then(response => {
            console.log(response)
            // 获取返回的结果
            const result = response.result
            this.$message.info('撤防成功')
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
        }
    },
    handlePush (record) {
      if (record.id > 0) {
        // 推流接口
        new Promise((resolve, reject) => {
          deviceStartPushStream(record).then(response => {
            // 获取返回的结果
            const result = response.data.flv
            this.$message.info(result)
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
      }
    },
    handleExistPush (record) {
      if (record.id > 0) {
        // 推流接口
        new Promise((resolve, reject) => {
          deviceExistPushStream(record).then(response => {
            // 获取返回的结果
            const result = response
            this.$message.info(result)
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
      }
    },
    handleStream (record) {
      if (record.id > 0) {
        // 推流接口
        new Promise((resolve, reject) => {
          deviceStreamList(record).then(response => {
            // 获取返回的结果
            const result = response.data
            this.$message.info(result.flv + '\n' + result.hls)
            resolve(result)
          }).catch(error => {
            reject(error)
          })
        }).then(res => {
          // do something..
          this.$refs.table.refresh()
        })
      }
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.deviceModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              modifyDevice(values).then(response => {
                // 获取返回的结果
                const result = response.result
                resolve(result)
              }).catch(error => {
                reject(error)
              })
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              addDevice(values).then(response => {
                // 获取返回的结果
                const result = response.result
                resolve(result)
              }).catch(error => {
                reject(error)
              })
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.deviceModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleDel (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
