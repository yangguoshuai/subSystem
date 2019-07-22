<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" clearable style="width: 200px;" class="filter-item" placeholder="用户名" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="userManager_btn_add" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit" @click="handleCreate">添加</el-button>
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="userName" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="loginName" label="登录名">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="telPhone" label="联系方式">
        <template slot-scope="scope">
          <span>{{ scope.row.telPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="loginTime" label="登陆时间">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="lastLoginTime" label="最后登陆时间">
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handlePermission(scope.row)">管理</el-button>
          <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.status == 1" style="margin-left: 1px;" size="small" type="success" @click="handleStatus(scope.row,0)">禁用</el-button>
          <el-button v-else-if="scope.row.status == 0" style="margin-left: 1px;" size="small" type="success" @click="handleStatus(scope.row,1)">启用</el-button>
          <el-button v-if="userManager_btn_del" style="margin-top: 5px;" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="登录名" prop="loginName">
          <el-input v-model="form.loginName" placeholder="请输入登录名" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="登录名" prop="loginName">
          <el-input v-model="form.loginName" :disabled="true" placeholder="请输入登录名"/>
        </el-form-item>

        <el-form-item label="联系方式" prop="telPhone">
          <el-input v-model="form.telPhone" placeholder="请输入联系方式"/>
        </el-form-item>

        <!-- <el-form-item label="角色"  prop="roleName">
              <el-select class="filter-item" multiple clearable v-model="form.roleName" placeholder="请选择">
                <el-option v-for="item in  roleList" :key="item.dataName" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
             -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="titleTxt" :visible.sync="dialogVisible">
      <el-button type="primary" @click="cancel('')">返 回</el-button>
      <el-table ref="authTable" :data="authList" border fit highlight-current-row style="width: 100%;margin-top: 20px;" @select-all="selectAll" @select="handleSelectionChange">
        <el-table-column type="selection" width="55"/>

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

        <!-- <el-table-column prop="isAdd" label="新增">
              <template slot-scope="scope">
                <span>{{ scope.row.isAdd }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="isDel" label="删除">
              <template slot-scope="scope">
                <span>{{ scope.row.isDel }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="isEdit" label="修改">
              <template slot-scope="scope">
                <span>{{ scope.row.isEdit }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="isSelect" label="查询">
              <template slot-scope="scope">
                <span>{{ scope.row.isSelect }}</span>
              </template>
            </el-table-column> -->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, getObj, delObj } from '@/api/admin/user/index'
import { getAuthList, getUserAuthority, addUserAuthority, removeUserAuthority } from '@/api/admin/permission/index'
export default {
  name: 'Usermanager',

  data() {
    return {
      form: {
        userName: undefined,
        loginName: undefined,
        password: undefined,
        telPhone: undefined,
        status: undefined
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        loginName: [
          {
            required: true,
            message: '请输入登录名',
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
      authList: null,
      total: null,
      listLoading: true,
      selectSize: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined
      },
      titleTxt: '权限管理',
      currentUseId: null,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      userManager_btn_edit: '1',
      userManager_btn_del: '1',
      userManager_btn_add: '1',
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
    // 获取该用户所属的权限
    handlePermission(row) {
      this.currentUseId = row.userId
      this.resetTemp
      this.dialogVisible = true
      getAuthList().then(response => {
        this.authList = response.data.data
        getUserAuthority(row.userId).then(data => {
          if (data.data.data.length !== 0) {
            const obj = {}
            for (let i = 0; i < this.authList.length; i++) {
              obj[this.authList[i].systemPageId] = this.authList[i]
            }
            const toggle = {}
            for (let i = 0; i < data.data.data.length; i++) {
              const id = data.data.data[i].systemPageId
              const toggleObj = data.data.data[i]
              if (obj[id] !== undefined && toggle[toggleObj] === undefined) {
                this.$refs.authTable.toggleRowSelection(obj[data.data.data[i].systemPageId], true)
              }
            }
          }
        })
      })
    },
    // 编辑权限
    handleSelectionChange(val, row) {
      let flag = true
      for (let i = 0; i < val.length; i++) {
        if (val[i].systemPageId === row.systemPageId) {
          addUserAuthority(row.systemPageId, this.currentUseId).then(response => {
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
          flag = false
          break
        }
      }
      if (flag) {
        removeUserAuthority(row.systemPageId, this.currentUseId).then(response => {
          if (response.data.code === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 新增弹框
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 新增保存
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(response => {
            this.dialogFormVisible = false
            this.getList()
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 修改弹框
    handleUpdate(row) {
      getObj(row.userId).then(response => {
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
          addObj(this.form).then(response => {
            this.dialogFormVisible = false
            this.getList()
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const status = 2
        delObj(row.userId, status).then((response) => {
          this.getList()
          this.resetTemp()
          if (response.data.code === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'error'
            })
          }
          this.cancel('')
        })
      }).catch(() => {
        // 点击“取消后操作”
        this.cancel('')
      })
    },
    // 更新状态
    handleStatus(row, status) {
      delObj(row.userId, status).then((response) => {
        this.getList()
        this.resetTemp()
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
        this.cancel('')
      })
    },
    // 全选
    selectAll(selection) {
      if (selection.length > 0) {
        // 全选
        if (selection.length === this.authList.length) {
          // 全选
          const id_array = []
          for (var i in selection) {
            id_array.push(selection[i].systemPageId)
          }
          const idstr = id_array.join(',')
          addUserAuthority(idstr, this.currentUseId).then(response => {
            // this.handleSelectTypeGroup()
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        }
      } else {
        // 取消全选

        const id_array = []
        for (var j in this.authList) {
          id_array.push(this.authList[j].systemPageId)
        }
        const idstr = id_array.join(',')
        removeUserAuthority(idstr, this.currentUseId).then(response => {
          if (response.data.code === 200) {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: response.data.msg,
              type: 'error'
            })
          }
        })
      }
    },
    // 取消
    cancel(formName) {
      this.dialogFormVisible = false
      this.dialogVisible = false
      if (formName !== '') {
        this.$refs[formName].resetFields()
      }
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
        userName: undefined,
        loginName: undefined,
        password: undefined,
        telPhone: undefined,
        status: undefined
      }
    }
  }
}
</script>
