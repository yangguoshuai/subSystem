<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <span>名称：</span>
      <el-input v-model="listQuery.name" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>国标编码：</span>
      <el-input v-model="listQuery.code" clearable style="width: 100px;" class="filter-item" placeholder="国标编码" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>城市编码：</span>
      <el-input v-model="listQuery.areaCode" clearable style="width: 100px;" class="filter-item" placeholder="城市编码" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>级别：</span>
      <el-select v-model="listQuery.type" clearable style="width: 150px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="1" label="省"/>
        <el-option :value="2" label="直辖市"/>
        <el-option :value="3" label="市"/>
        <el-option :value="4" label="区"/>
      </el-select>

      <el-button size="small" style="margin-left: 500px; margin-top: -44px;" type="primary" @click="downloadFile">导出文件</el-button>
      <el-upload
        :before-upload="beforeUpload"
        :auto-upload="true"
        class="upload-demo"
        action="123"
        multiple
        accept=".csv,"
        style="margin-left: 1100px;   margin-top: -40px;">
        <el-button v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="导入数据中..." size="small" type="primary">导入行政区</el-button>
      </el-upload>
    </div>

    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="code" label="国标编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="type" label="级别">
        <template slot-scope="scope">
          <span>{{ scope.row.type == '1' ? '省': (scope.row.type == '2' ? '直辖市' : (scope.row.type == '3' ? '市' :'区')) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="prName" label="所属省">
        <template slot-scope="scope">
          <span>{{ scope.row.prName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="cityName" label="所属市">
        <template slot-scope="scope">
          <span>{{ scope.row.cityName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="areaCode" label="城市编码">
        <template slot-scope="scope">
          <span>{{ scope.row.areaCode }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { page, uplaodCSV, selectAll } from '@/api/district/district'
export default {
  name: 'DistrictManager',
  data() {
    return {
      form: {
        code: undefined,
        name: undefined,
        prName: undefined,
        cityName: undefined,
        type: undefined,
        areaCode: undefined
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
        areaCode: undefined,
        type: undefined
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
    // 上传文件
    beforeUpload(file) {
      this.fullscreenLoading = true
      const fd = new FormData()
      fd.append('file', file)
      uplaodCSV(fd).then(response => {
        this.fullscreenLoading = false
        this.getList()
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: '文件名为:' + file.name + ' 导入成功',
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
      return true
    },
    // 导出文件
    downloadFile() {
      // 获取所有的 list数据 用来给之后的进行下载
      selectAll(this.listQuery).then(response => {
        if (response.data.code === 200) {
          import('@/vendor/Export2Excel').then(excel => {
            // 表头
            const tHeader = ['编码', '名称', '级别', '区号', 'cityCode', 'cityName', 'cityPy', 'latitude', 'longitude', 'prCode', 'prName', 'prPy', 'py', 'scityPy', 'sprPy', 'spy', 'sname', 'scityName', 'sprName']
            // 对应字段
            const filterVal = ['code', 'name', 'type', 'areaCode', 'cityCode', 'cityName', 'cityPy', 'latitude', 'longitude', 'prCode', 'prName', 'prPy', 'py', 'scityPy', 'sprPy', 'spy', 'sname', 'scityName', 'sprName']
            const list = response.data.data.list
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'district',
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
          })
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
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
