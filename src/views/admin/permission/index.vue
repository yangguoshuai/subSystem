<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.systemName" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="systemName" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.systemName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="systemUrl" label="url">
        <template slot-scope="scope">
          <span>{{ scope.row.systemUrl }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="permissionManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="systemName">
          <el-input v-model="form.systemName" placeholder="请输入名称" />
        </el-form-item>

        <el-form-item label="url" prop="systemUrl">
          <el-input v-model="form.systemUrl" :disabled="true" placeholder="请输入url"/>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, getObj, putObj } from '@/api/admin/permission/index'
export default {
  name: 'Permissionmanager',
  data() {
    return {
      form: {
        systemName: undefined,
        systemUrl: undefined
      },
      rules: {
        systemName: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      roleList: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        systemName: undefined
      },
      currentCode: null,
      dialogFormVisible: false,
      dialogStatus: '',
      permissionManager_btn_edit: '1',
      permissionManager_btn_del: '1',
      permissionManager_btn_add: '1',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取分页list
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          if (response.data.code === 2110) {
            this.$router.push({
              path: '/401'
            })
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'error'
            })
          }
        }
        this.listLoading = false
      })
    },
    // 过滤---条件查询
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },

    // 修改弹框
    handleUpdate(row) {
      getObj(row.systemId).then(response => {
        if (response.data.code !== 200) {
          this.$notify({
            title: '失败',
            message: response.data.msg,
            type: 'error',
            duration: 2000
          })
        }
        this.form = response.data.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    // 修改保存
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          putObj(this.form).then(response => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        } else {
          return false
        }
      })
    },
    // 取消
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    // 分页页数跳转
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    // 选择当前显示页数
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    // 重置form
    resetTemp() {
      this.form = {
        systemName: undefined,
        systemUrl: undefined
      }
    }
  }
}
</script>
