<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <span>名称：</span>
      <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter" @input="handleFilter"/>
      <span>别名：</span>
      <el-input v-model="listQuery.aisoAlias" clearable style="width: 200px;" class="filter-item" placeholder="别名" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>编码：</span>
      <el-input v-model="listQuery.code" clearable style="width: 100px;" class="filter-item" placeholder="编码" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>是否是父节点：</span>
      <el-select v-model="listQuery.isParent" clearable style="width: 100px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="1" label="是"/>
        <el-option :value="0" label="否"/>
      </el-select>

      <span>是否支持筛选：</span>
      <el-select v-model="listQuery.isSupportSceen" clearable style="width: 100px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="1" label="支持"/>
        <el-option :value="0" label="不支持"/>
      </el-select>

      <span>类别：</span>
      <el-select v-model="listQuery.category" clearable style="width: 100px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="0" label="类型"/>
        <el-option :value="1" label="品牌"/>
        <el-option :value="2" label="风味"/>
        <el-option :value="3" label="标签"/>
      </el-select>

      <span>所属分类：</span>
      <el-select v-model="listQuery.type" clearable style="width: 100px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="0" label="无"/>
        <el-option :value="1" label="加油站所属"/>
      </el-select>

      <el-button class="filter-item" style="margin-left: 50px;margin-top: -0.1%;" type="primary" icon="search" @click="downloadAllData">导出</el-button>

      <div>
        <el-upload
          :before-upload="beforeUpload"
          :auto-upload="true"
          class="upload-demo"
          action="1"
          multiple
          accept=".xlsx,"
          style="margin-left: 1600px;    margin-top: -2.7%;">
          <el-button v-loading.fullscreen.lock="fullscreenLoading" style="padding: 11px 15px;" element-loading-text="导入数据中..." size="small" type="primary">导入Excel文件</el-button>
        </el-upload>
      </div>
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="code" label="编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isSupportSceen" label="分类筛选">
        <template slot-scope="scope">
          <span>{{ scope.row.isSupportSceen == 1 ? '支持' : '不支持' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="category" label="类别">
        <template slot-scope="scope">
          <span>{{ scope.row.category == 0 ? '类型' : (scope.row.category == 1 ? '品牌' : (scope.row.category == 2 ? '风味' : '标签')) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isParent" label="是否是父节点">
        <template slot-scope="scope">
          <span>{{ scope.row.isParent == 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="parentCode" label="父编码">
        <template slot-scope="scope">
          <span>{{ scope.row.parentCode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="parentName" label="父名称">
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aisoAliasStr" label="别名"/>

      <el-table-column align="center" label="操作 " min-width="90%">
        <template slot-scope="scope" min-width="90%">
          <el-button size="small" style="margin-top: 5px; margin-left: 21px;" type="success" @click="handleAisoAlias(scope.row)">別名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!--别名弹出框-->
    <el-dialog :visible.sync="dialogAliasVisible" :show-close="false" :before-close="handleClose" width="1300px" style="height:800px">
      <el-button class="filter-item" style="margin-left: 10px; margin-top: 18px;" type="primary" icon="edit" @click="handleAliasCreate">添加</el-button>
      <el-form v-show="dialogCreateAliasVisible" ref="aliasform" :model="aliasform" :rules="aliasRules" label-width="100px">
        <el-form-item label="别名" prop="aliasName">
          <el-input v-model="aliasform.aliasName" placeholder="请输入别名" style="width:200px"/>
          <el-button @click="cancel()">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createAlias('aliasform')">确 定</el-button>
          <el-button v-else type="primary" @click="updateAlias('aliasform')">确 定</el-button>
          <!--<el-button type="primary" @click="createAlias('aliasform')">确 定</el-button>-->
        </el-form-item>
      </el-form>

      <el-table v-loading.body="listLoading" :key="tableKey" :data="aliasNameList" border fit highlight-current-row style="width: 100%">
        <el-table-column label="aisoCode">
          <template slot-scope="scope">
            <span>{{ scope.row.aisoCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="别名">
          <template slot-scope="scope">
            <span>{{ scope.row.aisoAlias }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click= "updateAisoAlias(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click = "deleteAisoAlias(scope.row)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { page, downloadAll, uploadExcel } from '@/api/type/aisoData'
import { selectAisoAlias, insertAisoAlias, deleteAisoAliasById, updateAisoAliasById } from '@/api/aisoAlias/index'
export default {
  name: 'TypeDaimlerManager',

  data() {
    return {
      dialogAliasVisible: false,
      fullscreenLoading: false,
      dialogCreateAliasVisible: false,
      aliasNameList: null,
      dialogStatus: null,
      form: {
        code: undefined,
        name: undefined,
        isSupportSceen: undefined,
        category: undefined,
        isParent: undefined,
        parentCode: undefined,
        parentName: undefined
      },
      aliasform: {
        id: null,
        aisoCode: null,
        aliasName: null
      },
      list: null,
      total: null,
      listLoading: true,
      selectSize: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        isSupportSceen: undefined,
        category: undefined,
        isParent: undefined,
        aisoAlias: undefined,
        type: undefined
      },

      tableKey: 0,
      aliasRules: {
        aliasName: [
          {
            required: true,
            message: '请输入别名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
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
    // 跳转别名页面
    handleAisoAlias(row) {
      this.dialogStatus = 'create'
      this.dialogAliasVisible = true
      // 将code 放入 aliasform 中
      this.aliasform.aisoCode = row.code
      // 触发查询别名动作
      this.selectAlias(row.code)
    },
    // 查询别名
    selectAlias(val) {
      selectAisoAlias(val).then(response => {
        if (response.data.code === 200) {
          this.aliasNameList = response.data.data
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleAliasCreate() {
      this.dialogStatus = 'create'
      this.dialogCreateAliasVisible = true
      // 清除this.aliasform.aliasName
      this.aliasform.aliasName = null
    },
    // 取消操作
    cancel() {
      this.dialogCreateAliasVisible = false
      this.aliasform.aliasName = null
    },
    // 添加别名
    createAlias(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          if (this.aliasform.aliasName.trim() === '') {
            this.$message({
              showClose: true,
              message: '输入名称非法请检查',
              type: 'error'
            })
            return false
          }
          insertAisoAlias(this.aliasform).then(response => {
            this.dialogCreateAliasVisible = false
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
            // 再次查询别名
            this.selectAlias(this.aliasform.aisoCode)
            this.listQuery.pageNum = 1
            this.getList()
          })
          // 清除this.aliasform.aliasName
          this.aliasform.aliasName = null
        } else {
          return false
        }
      })
    },
    // 更新别名
    updateAlias(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          updateAisoAliasById(this.aliasform).then(response => {
            this.dialogCreateAliasVisible = false
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
            // 再次查询别名
            this.selectAlias(this.aliasform.aisoCode)
            this.listQuery.pageNum = 1
            this.getList()
          })
        }
      })
    },
    // 别名弹出框关闭时做的操作
    handleClose() {
      this.dialogCreateAliasVisible = false
      this.dialogAliasVisible = false
      // 这一步是为了将rules检测不合格的页面提示在关闭的时候去掉之后再重新进行检测
      this.$refs['aliasform'].resetFields()
    },
    // 删除 别名
    deleteAisoAlias(val) {
      deleteAisoAliasById(val).then(response => {
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
        // 再次查询别名
        this.selectAlias(this.aliasform.aisoCode)
        this.listQuery.pageNum = 1
        this.getList()
      })
    },
    updateAisoAlias(val) {
      this.dialogStatus = 'update'
      this.dialogCreateAliasVisible = true
      this.aliasform.aliasName = val.aisoAlias
      this.aliasform.id = val.id
    },
    // 过滤---条件查询
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
    // 导出所有
    downloadAllData(scheduleType) {
      this.listLoading = true
      downloadAll(this.listQuery).then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'aisoData.csv'
        this.listLoading = false
        link.click()
      })
    },
    // 上传文件
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      uploadExcel(fd).then(response => {
        this.fullscreenLoading = false
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: '文件名为:' + file.name + ' 导入成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            showClose: true,
            // message: '文件名为:' + file.name + ' 上传失败',
            message: response.data.msg,
            type: 'error'
          })
        }
      })
      return true
    }
  }
}
</script>
