<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色ID">
                <a-input placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">查询</a-button>
                <a-button style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>
      <a-table
        rowKey="id"
        :columns="columns"
        :data-source="menuTree"
        :row-selection="rowSelection"
        :expanded-row-keys.sync="expandedRowKeys"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </template>
        </span>
      </a-table>
      <menu-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { deleteMenu, getMenuTree } from '@/api/manage'
import MenuModal from '@/views/cats/sysMenu/MenuModal'
const columns = [
  {
    title: '名称',
    dataIndex: 'title',
    key: 'title',
    width: '18%'
  },
  {
    title: 'uri',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    width: '12%'
  },
  {
    title: '组件',
    dataIndex: 'component',
    key: 'component'
  },
  {
    title: '重定向',
    dataIndex: 'redirect',
    width: '20%',
    key: 'redirect'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  name: 'SysMenu',
  components: { MenuModal },
  comments: {
    MenuModal
  },
  data () {
    return {
      columns,
      rowSelection,
      expandedRowKeys: [],
      menuTree: []
    }
  },
  created () {
    getMenuTree().then(res => {
      this.menuTree = res.result
      console.log(res.result)
      const topMenu = {
        'id': 0,
        'title': '顶级菜单'
      }
      const dateTree = Object.assign([], res.result)
      dateTree.push(topMenu)
      this.$refs.modal.treeData = dateTree
    })
  },
  methods: {
    handleAdd () {
      this.$refs.modal.add(0)
    },
    handleSaveOk () {

    },
    handleSaveClose () {

    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleDel (record) {
      new Promise((resolve, reject) => {
        console.log(record.id)
        deleteMenu(record.id).then(response => {
          // 获取返回的结果
          const result = response.result
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      }).then(res => {
        // 刷新表格
        this.$refs.modal.refresh()
        this.$message.info('删除成功')
      })
    }
  }
}
</script>
