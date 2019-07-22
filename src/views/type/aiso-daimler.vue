<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <span>名称：</span>
      <el-input v-model="listQuery.searchName" clearable style="width: 200px;" class="filter-item" placeholder="名称" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>Code：</span>
      <el-input v-model="listQuery.searchCode" clearable style="width: 150px;" class="filter-item" placeholder="Code" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>类别：</span>
      <el-select v-model="listQuery.aisoCategory" clearable style="width: 150px;" placeholder="请选择" filterable @change="getList" >
        <el-option :value="0" label="类型"/>
        <el-option :value="1" label="品牌"/>
        <el-option :value="2" label="风味"/>
      </el-select>
      <el-button class="filter-item" style="margin-left: 80px;margin-top: -0.1%;" type="primary" icon="search" @click="downloadRelation">导出对应关系</el-button>
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="aisoName" label="aiso名称">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aisoCode" label="aisoCode">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoCode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="daimlerName" label="daimler名称">
        <template slot-scope="scope">
          <span>{{ scope.row.daimlerName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="daimlerCode" label="daimlerCode">
        <template slot-scope="scope">
          <span>{{ scope.row.daimlerCode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aisoCategory" label="aiso对应类别">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoCategory == 0 ? '类型' : (scope.row.aisoCategory == 1 ? '品牌' : '风味') }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { page, downloadRelation } from '@/api/type/aiso-daimler'
export default {
  name: 'AisoDaimlerRelationManager',

  data() {
    return {
      form: {
        aisoName: undefined,
        aisoCode: undefined,
        daimlerName: undefined,
        daimlerCode: undefined,
        aisoCategory: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      selectSize: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        searchName: undefined,
        searchCode: undefined,
        aisoCategory: undefined
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
    // 导出关系
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
        link.download = 'aisoDaimlerRelation.csv'
        this.listLoading = false
        link.click()
      })
    }
  }
}
</script>
