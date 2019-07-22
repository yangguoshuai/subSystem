<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="4">
        <span>版本：</span>
        <el-select v-model="query.version" placeholder="请选择" @change="chooseVersion">
          <el-option
            v-for="item in versionList"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span>中文名称:</span>
        <el-input v-model="query.cnInfo" clearable style="width: 200px;" placeholder="中文名称模糊查询" @keyup.enter.native="handleAutoGasInfoAllQueryFilter" @input="handleAutoGasInfoAllQueryFilter" />
      </el-col>
      <el-col :span="4">
        <span>id:</span>
        <el-input v-model="query.autoDataId" clearable style="width: 200px;" placeholder="查询" @keyup.enter.native="handleAutoGasInfoAllQueryFilter" @input="handleAutoGasInfoAllQueryFilter" />
      </el-col>
      <div class="filter-container">
        <el-button v-if="query.version !=null" type="primary" @click="showAutoAddDialog">添加数据</el-button>
        <el-button v-if="query.version !=null" type="primary" @click="downloadData">数据导出</el-button>
        <div style="float: right">
          <el-upload
            :before-upload="beforeUpload"
            :auto-upload="true"
            class="upload-demo"
            action="1"
            multiple
            accept=".txt,">
            <el-button v-loading.fullscreen.lock="fullscreenLoading" style="padding: 11px 15px;" element-loading-text="导入数据中..." size="small" type="primary">导入txt文件</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="autoDataId" label="ID" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.autoDataId }}</span>
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
    <!--更新的弹出框-->
    <el-dialog :title="textMap.update" :visible.sync="updateLoading" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialogUpdate">
      <div class="addAlias-div" style="padding-top: 20px;">
        <el-form ref="dataAddForm" :model="dataAddForm" label-width="150px">
          <el-form-item label="ID" prop="autoDataId" width="300">
            <el-col :span="12">
              <el-input v-model="dataAddForm.autoDataId" :disabled="true" clearable placeholder="输入ID" />
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
            <el-form-item label="ID" prop="autoDataId" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.autoDataId" clearable placeholder="输入autoDataId" />
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
import { page, insertData, updateData, downloadData, uploadFile, getVersion } from '@/api/auto/gas/autoGasInfoAll'
export default {
  name: 'AutoGasFuelTypeManager',
  data() {
    return {
      tableKey: 0,
      versionList: null,
      listLoading: false,
      mainAddForm: false,
      updateLoading: false,
      fullscreenLoading: false,
      list: null,
      total: null,
      query: {
        autoDataId: null,
        cnInfo: null,
        enInfo: null,
        tableName: 'auto_gas_fuel_type',
        version: null,
        pageNum: 1,
        pageSize: 10
      },
      dataAddForm: {
        autoDataId: null,
        tableName: 'auto_gas_fuel_type',
        version: null,
        cnInfo: null,
        enInfo: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加AutoGasInfo相关数据',
        update: '更新AutoGasInfo相关数据'
      },
      addFormRules: {
        autoDataId: [
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
    this.version()
  },
  methods: {
    version() {
      const tab = new FormData()
      tab.append('tableName', 'auto_gas_fuel_type')
      getVersion(tab).then(response => {
        if (response.data.code === 200) {
          this.versionList = response.data.data
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
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
    handleAutoGasInfoAllQueryFilter() {
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
    showAutoAddDialog() {
      this.mainAddForm = true
    },
    // 更新操作
    handleUpdate(val) {
      this.updateLoading = true
      this.dataAddForm.autoDataId = val.autoDataId
      this.dataAddForm.cnInfo = val.cnInfo
      this.dataAddForm.enInfo = val.enInfo
    },
    // 清除dataAddForm数据
    clearDataAddForm() {
      this.dataAddForm.autoDataId = null
      this.dataAddForm.cnInfo = null
      this.dataAddForm.enInfo = null
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
        link.download = this.dataAddForm.version + '_GasFuelType-SW.csv'
        this.listLoading = false
        link.click()
      })
    },
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('tableName', 'auto_gas_fuel_type')
      uploadFile(fd).then(response => {
        this.fullscreenLoading = false
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: '文件名为:' + file.name + ' 导入成功',
            type: 'success'
          })
          this.getList()
          this.version()
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
    },
    // 选择版本号
    chooseVersion() {
      // 对dataAddForm中的version赋值 保证之后的增加修改时版本号的正确
      this.dataAddForm.version = this.query.version
      this.getList()
    }
  }
}
</script>
