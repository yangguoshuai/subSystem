<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="6">
        <span>Gas名称(中文名称)：</span>
        <el-input v-model="query.cnInfo" clearable style="width: 200px;" placeholder="模糊查询" @keyup.enter.native="handleAisoGasInfoAllQueryFilter" @input="handleAisoGasInfoAllQueryFilter" />
      </el-col>
      <el-col :span="6">
        <span>id：</span>
        <el-input v-model="query.dataId" clearable style="width: 200px;" placeholder="查询" @keyup.enter.native="handleAisoGasInfoAllQueryFilter" @input="handleAisoGasInfoAllQueryFilter" />
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
      <el-table-column prop="dataId" label="id" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.dataId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cnInfo" label="中文名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.cnInfo }}</span>
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
    <!--编辑的弹出框-->
    <el-dialog :title="textMap.update" :visible.sync="updateLoading" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialogUpdate">
      <div class="addAlias-div" style="padding-top: 20px;">
        <el-form ref="dataAddForm" :model="dataAddForm" label-width="150px">
          <el-form-item label="id" prop="dataId" width="300">
            <el-col :span="12">
              <el-input v-model="dataAddForm.dataId" :disabled="true" clearable placeholder="输入Id" />
            </el-col>
          </el-form-item>
          <el-form-item label="请输入中文名称" prop="cnInfo" >
            <el-col :span="12">
              <el-input v-model="dataAddForm.cnInfo" clearable placeholder="cnInfo" />
            </el-col>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="makeSureUpdate()">确认添加</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form ref="dataAddForm" :model="dataAddForm" :rules="addFormRules" label-width="150px">
            <el-form-item label="id" prop="dataId" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.dataId" clearable placeholder="输入Id" />
              </el-col>
            </el-form-item>
            <el-form-item label="请输入中文名称" prop="cnInfo" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.cnInfo" clearable placeholder="cnInfo" />
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
import { page, insertData, updateData, downloadData, uploadFile } from '@/api/aiso/gas/aisoGasInfoAll'
export default {
  name: 'AisoGasPaymentManager',
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      mainAddForm: false,
      updateLoading: false,
      fullscreenLoading: false,
      list: null,
      total: null,
      query: {
        id: null,
        dataId: null,
        cnInfo: null,
        enInfo: null,
        pageNum: 1,
        pageSize: 10,
        tableName: 'aiso_gas_payment'
      },
      dataAddForm: {
        id: null,
        dataId: null,
        cnInfo: null,
        enInfo: null,
        tableName: 'aiso_gas_payment'
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加aisoGasPayment数据',
        update: '更新aisoGasPayment数据'
      },
      addFormRules: {
        dataId: [
          { required: true, message: '请填入数字' },
          { validator(rule, value, callback, source, options) {
            var errors = []
            if (!/^[0-9]+$/.test(value)) {
              callback('输入值必须为数字')
            }
            callback(errors)
          }
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
    // 模糊查询
    handleAisoGasInfoAllQueryFilter() {
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
      this.getList()
    },
    closeDialogUpdate() {
      // 这个是为了消除关掉弹窗后 由于输入的不符合rules输入框的提示不消失的问题
      this.$refs['dataAddForm'].resetFields()
      // 清空数据
      this.clearDataAddForm()
      this.getList()
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
      this.dataAddForm.dataId = val.dataId
      this.dataAddForm.cnInfo = val.cnInfo
    },
    // 清除dataAddForm数据
    clearDataAddForm() {
      this.dataAddForm.dataId = null
      this.dataAddForm.cnInfo = null
    },
    // 导出aiso与 Institute关系数据
    downloadData() {
      downloadData(this.query).then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'aiso-gas-Payment.csv'
        this.listLoading = false
        link.click()
      })
    },
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('tableName', 'aiso_gas_payment')
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
