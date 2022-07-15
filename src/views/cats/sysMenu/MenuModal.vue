<template>
  <a-modal
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="父级ID"
        >
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeData"
            :replaceFields="{ children:'children', title:'title', key:'id', value: 'id' }"
            placeholder="请选择"
            v-decorator="['parentId', { initialValue: 0 }]"
          />
        </a-form-item>

        <a-form-item
          label="菜单名称"
        >
          <a-input v-decorator="['title', {}]" />
        </a-form-item>
        <a-form-item
          label="名字"
        >
          <a-input v-decorator="['name', {}]" />
        </a-form-item>
        <a-form-item
          label="组件"
        >
          <a-input v-decorator="['component', {}]" />
        </a-form-item>
        <a-form-item
          label="图标"
        >
          <a-input v-decorator="['icon', {}]" />
        </a-form-item>
        <a-form-item
          label="重定向"
        >
          <a-input v-decorator="['redirect', {}]" />
        </a-form-item>
        <a-form-item
          label="path"
        >
          <a-input v-decorator="['path', {}]" />
        </a-form-item>
        <a-form-item
          label="target"
        >
          <a-input v-decorator="['target', {}]" />
        </a-form-item>
        <a-form-item
          label="是否隐藏"
        >
          <a-input v-decorator="['hidden', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { addMenu } from '@/api/manage'
export default {
  name: 'MenuModal',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      treeData: []
    }
  },
  watch: {
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
  },
  methods: {
    add (id) {
      this.edit({ parentId: id })
    },
    edit (record) {
      this.visible = true
      this.form.setFieldsValue({ ...record })
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          // 模拟后端请求 2000 毫秒延迟
          new Promise((resolve, reject) => {
            console.log(values)
            addMenu(values).then(response => {
              // 获取返回的结果
              const result = response.result
              resolve(result)
            }).catch(error => {
              reject(error)
            })
          }).then(() => {
            // Do something
            _this.$message.success('保存成功')
            _this.$emit('ok')
          }).catch(() => {
            // Do something
          }).finally(() => {
            _this.confirmLoading = false
            _this.close()
          })
        }
      })
      this.form.resetFields()
    },
    handleCancel () {
      this.close()
    }
  }
}
</script>
