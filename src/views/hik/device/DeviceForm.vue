<template>
  <a-modal
    title="设备信息"
    :width="996"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.id > 0" label="主键ID">
          <a-input v-decorator="['id', {}]" disabled />
        </a-form-item>
        <a-form-item label="所属区域">
          <a-select
            show-search
            placeholder="请选择区域"
            option-filter-prop="children"
            style="width: 200px"
            :filter-option="filterOption"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            v-decorator="['categoryId', {rules: [{required: true, min: 1, message: '请输入设备名称！'}]}]"
          >
            <a-select-option v-for="d in categoryList" :key="d.id">
              {{ d.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="设备名称">
          <a-input v-decorator="['title', {rules: [{required: true, min: 1, message: '请输入设备名称！'}]}]" />
        </a-form-item>
        <a-form-item label="IP地址">
          <a-input v-decorator="['ip', {rules: [{required: true, message: '请输入IPv4地址！'}]}]" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-decorator="['username', {rules: [{required: true, message: '请输入用户名！'}]}]" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-decorator="['password', {rules: [{required: true, message: '请输入密码！'}]}]" />
        </a-form-item>
        <a-form-item label="端口">
          <a-input v-decorator="['port', {rules: [{required: true, message: '请输入端口，默认8000！'}]}]" />
        </a-form-item>
        <a-form-item label="设备序列号">
          <a-input v-decorator="['deviceSn']" />
        </a-form-item>
      </a-form>
    </a-spin>

    <page-header-wrapper>
      <s-table
        ref="table"
        size="default"
        rowKey="deviceSN"
        :columns="searchDeviceColumns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
        :scroll="{ x: true }"
        v-show="!model"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleAdd(record)">添加</a>
          </template>
        </span>
      </s-table>
    </page-header-wrapper>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { STable } from '@/components'
import { getDeviceSearchPage } from '@/api/api'

// 表单字段
const fields = ['categoryId', 'title', 'ip', 'username', 'password', 'port', 'id', 'deviceSn']

const searchDeviceColumns = [
  {
    title: '设备序列号',
    dataIndex: 'deviceSN'
  },
  {
    title: 'IP地址',
    dataIndex: 'ipv4Address'
  },
  {
    title: '端口',
    dataIndex: 'commandPort'
  },
  {
    title: 'HTTP端口',
    dataIndex: 'httpPort'
  },
  {
    title: '设备类型',
    dataIndex: 'deviceDescription'
  },
  {
    title: '开机时间',
    width: '180px',
    dataIndex: 'bootTime'
  },
  {
    title: '更新时间',
    dataIndex: 'modifyTime',
    width: '180px',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    STable
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.searchDeviceColumns = searchDeviceColumns
    return {
      categoryList: [],
      categoryId: 0,
      probeMatch: {},
      formLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
      },
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getDeviceSearchPage(requestParameters)
          .then(res => {
            return res.result
          })
      }
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
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    handleAdd (value) {
      // TODO 清除全选
      this.probeMatch.deviceSn = value.deviceSN
      this.probeMatch.ip = value.ipv4Address
      this.probeMatch.title = value.deviceDescription + value.ipv4Address
      this.probeMatch.username = 'admin'
      this.probeMatch.port = value.commandPort
      this.probeMatch.categoryId = value.categoryId
      this.form.setFieldsValue(pick(this.probeMatch, fields))
    }
  }
}
</script>
