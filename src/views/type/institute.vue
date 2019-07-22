<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <span>名称：</span>
      <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>编码：</span>
      <el-input v-model="listQuery.code" clearable style="width: 100px;" class="filter-item" placeholder="编码" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>父编码：</span>
      <el-input v-model="listQuery.pcode" clearable style="width: 100px;" class="filter-item" placeholder="父编码" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>是否是父节点：</span>
      <el-select v-model="listQuery.isParent" clearable style="width: 100px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="1" label="是"/>
        <el-option :value="0" label="否"/>
      </el-select>

      <el-button class="filter-item" style="margin-left: 900px;margin-top: -3.5%;" type="primary" icon="search" @click="downloadAllData">导出所有数据</el-button>

      <el-button class="filter-item" style="margin-left: 1050px;margin-top: -5.5%;" type="primary" icon="search" @click="downloadRelation">导出对应关系</el-button>

      <div>
        <el-upload
          :before-upload="beforeUpload"
          :auto-upload="true"
          class="upload-demo"
          action="1"
          multiple
          accept=".xlsx,"
          style="margin-left: 1200px;    margin-top: -4.6%;">
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

      <el-table-column prop="pcode" label="父编码">
        <template slot-scope="scope">
          <span>{{ scope.row.pcode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="pname" label="父名称">
        <template slot-scope="scope">
          <span>{{ scope.row.pname }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isParent" label="是否是父节点">
        <template slot-scope="scope">
          <span>{{ scope.row.isParent == 1 ? '是' : '否' }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { page, downloadRelation, downloadAll, uploadExcel } from '@/api/type/institute'
export default {
  name: 'TypeInstituteManager',

  data() {
    return {
      form: {
        code: undefined,
        name: undefined,
        pcode: undefined,
        pname: undefined,
        isParent: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      selectSize: null,
      fullscreenLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        code: undefined,
        pcode: undefined,
        isParent: undefined
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
    // 导出
    downloadRelation(scheduleType) {
      this.listLoading = true
      downloadRelation().then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'aisoInstitueType.csv'
        this.listLoading = false
        link.click()
      })
    },
    // 导出所有
    downloadAllData(scheduleType) {
      this.listLoading = true
      downloadAll().then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'institueType.csv'
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
