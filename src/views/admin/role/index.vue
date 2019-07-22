<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" clearable style="width: 200px;" class="filter-item" placeholder="角色名" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <!-- <el-button v-if="roleManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button> -->
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="roleName" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作"> <template slot-scope="scope">
        <el-button v-if="roleManager_btn_edit" size="small" type="success" @click="handleAlias(scope.row)">修改</el-button>
      </template>
      </el-table-column> -->

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入用户名"/>
        </el-form-item>

        <el-form-item label="描述">
          <el-input :autosize="{ minRows: 3, maxRows: 5}" v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
import { page } from '@/api/admin/role/index'

export default {
  name: 'Rolemanager',
  data() {
    return {
      form: {
        roleName: undefined
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined
      },
      currentCode: null,
      dialogFormVisible: false,
      dialogStatus: '',
      roleManager_btn_edit: '1',
      roleManager_btn_del: '1',
      roleManager_btn_add: '1',
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
          this.list = response.data.data.data.list
          this.total = response.data.data.data.total
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
    // 新增弹框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
        roleName: undefined
      }
    }
  }
}
</script>
