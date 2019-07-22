<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="6">
        <span>cnId：</span>
        <el-input v-model="query.cnId" clearable style="width: 200px;" placeholder="cnId" @keyup.enter.native="queryFilter" @input="queryFilter" />
      </el-col>
      <el-col :span="6">
        <span>名称：</span>
        <el-input v-model="query.cnInfo" clearable style="width: 200px;" placeholder="cnInfo" @keyup.enter.native="queryFilter" @input="queryFilter" />
      </el-col>
      <div class="filter-container">
        <el-button type="primary" @click="showAisoAddDialog">添加数据</el-button>
        <el-button type="primary" @click="downloadData">数据导出</el-button>
      </div>
      <div>
        <el-upload
          :before-upload="beforeUpload"
          :auto-upload="true"
          class="upload-demo"
          action="1"
          multiple
          accept=".txt,"
          style="margin-left: 1100px;    margin-top: -2.7%;">
          <el-button v-loading.fullscreen.lock="fullscreenLoading" style="padding: 11px 15px;" element-loading-text="导入数据中..." size="small" type="primary">导入txt文件</el-button>
        </el-upload>
      </div>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="cnId" label="编码" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.cnId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cnInfo" label="名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.cnInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="enInfo" label="英文名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.enInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可用" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="query.pageNum" :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!--更新的弹出框-->
    <el-dialog :title="textMap.update" :visible.sync="updateLoading" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialogUpdate">
      <div class="addAlias-div" style="padding-top: 20px;">
        <el-form ref="dataAddForm" :model="dataAddForm" label-width="150px">
          <el-form-item label="cnId" prop="cnId" width="300">
            <el-col :span="12">
              <el-input v-model="dataAddForm.cnId" :disabled="true" clearable placeholder="cnId" />
            </el-col>
          </el-form-item>
          <el-form-item label="cnInfo" prop="cnInfo" >
            <el-col :span="12">
              <el-input v-model="dataAddForm.cnInfo" clearable placeholder="cnInfo" />
            </el-col>
          </el-form-item>
          <el-form-item label="enInfo" prop="enInfo" >
            <el-col :span="12">
              <el-input v-model="dataAddForm.enInfo" clearable placeholder="enInfo" />
            </el-col>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="makeSureUpdate()">确认更新</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹出框 -->
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form ref="dataAddForm" :model="dataAddForm" :rules="addFormRules" label-width="150px">
            <el-form-item label="cnId" prop="cnId" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.cnId" clearable placeholder="输入cnId" />
              </el-col>
            </el-form-item>
            <el-form-item label="请输入中文名称" prop="cnInfo" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.cnInfo" clearable placeholder="cnInfo" />
              </el-col>
            </el-form-item>
            <el-form-item label="请输入英文名称" prop="enInfo" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.enInfo" clearable placeholder="enInfo" />
              </el-col>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="makeSureAdd('dataAddForm')">确认添加</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { page, insertData, updateData, downloadData, uploadFile } from '@/api/youke/gasBrand/youkeGasBrand'
export default {
  name: 'YoukeGasBrandManager',
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      mainAddForm: false,
      updateLoading: false,
      list: null,
      total: null,
      query: {
        cnInfo: null,
        cnId: null,
        pageNum: 1,
        pageSize: 10
      },
      dataAddForm: {
        cnId: null,
        cnInfo: null,
        enInfo: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加油客网数据',
        update: '更新油客网数据'
      },
      addFormRules: {
        cnId: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        cnInfo: [
          {
            required: true,
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // 钩子
  created() {
    this.getList()
  },
  methods: {
    getList() {
      page(this.query).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    // aisoInstituteData 模糊查询
    queryFilter() {
      debugger
      this.getList()
    },
    reload() {
      this.getList()
    },
    // 选择当前显示页数
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.getList()
    },
    // 分页页数跳转
    handleSizeChange(val) {
      this.query.pageSize = val
      this.getList()
    },
    // 关闭弹出框之后的操作
    closeDialog() {
      // 这个是为了消除关掉弹窗后 由于输入的不符合rules输入框的提示不消失的问题
      this.$refs['dataAddForm'].resetFields()
      // 清空数据
      this.clearDataAddForm()
    },
    closeDialogUpdate() {
      // 这个是为了消除关掉弹窗后 由于输入的不符合rules输入框的提示不消失的问题
      this.$refs['dataAddForm'].resetFields()
      // 清空数据
      this.clearDataAddForm()
    },
    makeSureAdd(dataAddForm) {
      this.$refs[dataAddForm].validate((valid) => {
        if (valid) {
          insertData(this.dataAddForm).then(response => {
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'success'
              })
              // 成功后关闭弹窗
              this.mainAddForm = false
              // 清除dataAddForm 中的数据
              this.clearDataAddForm()
              this.getList()
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '请按照规则填写数据',
            type: 'info'
          })
          return false
        }
      })
    },
    // 更新的函数
    makeSureUpdate() {
      updateData(this.dataAddForm).then(response => {
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'success'
          })
          // 成功后关闭弹窗
          this.updateLoading = false
          // 清除dataAddForm 中的数据
          this.clearDataAddForm()
          this.getList()
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 显示添加数据的弹框
    showAisoAddDialog() {
      this.mainAddForm = true
    },
    // 更新操作
    handleUpdate(val) {
      this.updateLoading = true
      this.dataAddForm.cnId = val.cnId
      this.dataAddForm.cnInfo = val.cnInfo
      this.dataAddForm.enInfo = val.enInfo
    },
    // 清除dataAddForm数据
    clearDataAddForm() {
      this.dataAddForm.cnId = null
      this.dataAddForm.cnInfo = null
      this.dataAddForm.enInfo = null
    },
    // 导出数据
    downloadData(scheduleType) {
      downloadData().then(response => {
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'youkeGasBrand.csv'
        link.click()
      })
    },
    // 上传文件
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      uploadFile(fd).then(response => {
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
