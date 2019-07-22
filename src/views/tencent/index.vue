<template>
  <div>
    <el-col :span="4">
      <el-input v-model="tencentForm.tencentName" clearable style="width: 200px;" placeholder="名称模糊查询" @keyup.enter.native="handleAisoInstituteQueryFilter" @input="handleAisoInstituteQueryFilter" />
    </el-col>
    <el-col :span="4">
      <el-input v-model="tencentForm.tencentCode" clearable style="width: 200px;" placeholder="编码查询" @keyup.enter.native="handleAisoInstituteQueryFilter" @input="handleAisoInstituteQueryFilter" />
    </el-col>
    <el-col :span="4">
      <el-input v-model="tencentForm.parentCode" clearable style="width: 200px;" placeholder="父编码查询" @keyup.enter.native="handleAisoInstituteQueryFilter" @input="handleAisoInstituteQueryFilter" />
    </el-col>
    <el-col :span="3">
      <el-button type="primary" @click="downloadData">导出所有数据</el-button>
    </el-col>
    <el-col :span="3">
      <el-button type="primary" @click="downloadRelation">导出对应关系</el-button>
    </el-col>
    <div>
      <el-upload
        :before-upload="beforeUpload"
        :auto-upload="true"
        class="upload-demo"
        action="1"
        multiple
        accept=".xlsx,"
        style="margin-left: 1200px;    margin-top: 0.8%;">
        <el-button v-loading.fullscreen.lock="fullscreenLoading" style="padding: 11px 15px;" element-loading-text="导入数据中..." size="small" type="primary">导入Excel文件</el-button>
      </el-upload>
    </div>

    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="tencentCode" label="编码" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.tencentCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tencentName" label="名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.tencentName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentCode" label="父编码" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.parentCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" label="父名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="等级" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="tencentForm.pageNum" :page-sizes="[10,20,30, 50]" :page-size="tencentForm.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>
<script>
import { page, uplaodCSV, downLoadAll, downLoadRelation } from '@/api/tencent/index'
export default {
  name: 'TencentData',
  data() {
    return {
      total: null,
      list: null,
      listLoading: false,
      tableKey: 0,
      fullscreenLoading: false,
      tencentForm: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        tencentCode: null,
        tencentName: null,
        parentCode: null,
        level: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      page(this.tencentForm).then(response => {
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
    // 分页页数跳转
    handleSizeChange(val) {
      this.tencentForm.pageSize = val
      this.getList()
    },
    // 选择当前显示页数
    handleCurrentChange(val) {
      this.tencentForm.pageNum = val
      this.getList()
    },
    // aisoInstituteData 模糊查询
    handleAisoInstituteQueryFilter() {
      this.getList()
    },
    // 上传文件
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      uplaodCSV(fd).then(response => {
        this.fullscreenLoading = false
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: '文件名为:' + file.name + ' 导入成功',
            type: 'success'
          })
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
    // 导出数据
    downloadData(scheduleType) {
      this.listLoading = true
      downLoadAll().then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'tencentData.csv'
        this.listLoading = false
        link.click()
      })
    },
    // 导出对应关系
    downloadRelation(scheduleType) {
      this.listLoading = true
      downLoadRelation().then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'aiso-tencent.csv'
        this.listLoading = false
        link.click()
      })
    }
  }
}
</script>
