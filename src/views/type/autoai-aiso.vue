<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <span>autoAiName：</span>
      <el-input v-model="listQuery.autoaiName" clearable style="width: 150px;" class="filter-item" placeholder="autoAiName" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>autoAiCode：</span>
      <el-input v-model="listQuery.autoaiCode" clearable style="width: 150px;" class="filter-item" placeholder="autoAiCode" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>aisoCode：</span>
      <el-input v-model="listQuery.aisoCode" clearable style="width: 150px;" class="filter-item" placeholder="aisoCode" @keyup.enter.native="handleFilter" @input="handleFilter"/>

      <span>aisoName：</span>
      <el-input v-model="listQuery.aisoName" clearable style="width: 150px;" class="filter-item" placeholder="aisoName" @keyup.enter.native="handleFilter" @input="handleFilter"/>
      <el-button class="filter-item" style="margin-left: 80px;margin-top: -0.1%;" type="primary" icon="search" @click="downloadRelation">导出对应关系</el-button>
    </div>
    <div class="filter-container"/>
    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column prop="autoaiCode" label="autoaiCode">
        <template slot-scope="scope">
          <span>{{ scope.row.autaoaiCode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="autoaiName" label="autoaiName">
        <template slot-scope="scope">
          <span>{{ scope.row.autoaiName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aisoCode" label="aisoCode">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoCode }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="aisoName" label="aisoName">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoName }}</span>
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { page, downloadRelation } from '@/api/type/autoai-aiso'
export default {
  name: 'AutoaiAisoRelationManager',

  data() {
    return {
      form: {
        autoaiCode: undefined,
        autoaiName: undefined,
        aisoCode: undefined,
        aisoName: undefined
      },
      list: null,
      total: null,
      listLoading: true,
      selectSize: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        autoaiCode: undefined,
        autoaiName: undefined,
        aisoCode: undefined,
        aisoName: undefined
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
      downloadRelation().then(response => {
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'autoaiAisoRelation.csv'
        link.click()
      })
    }
  }
}
</script>
