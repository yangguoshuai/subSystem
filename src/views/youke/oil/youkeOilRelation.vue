<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="6">
        <span>油客网名称: </span>
        <el-input v-model="query.youkeName" clearable style="width: 200px;" @keyup.enter.native="handleQueryFilter" @input="handleQueryFilter" />
      </el-col>
      <el-col :span="6">
        <span>aiso名称: </span>
        <el-input v-model="query.aisoName" clearable style="width: 200px;" @keyup.enter.native="handleQueryFilter" @input="handleQueryFilter" />
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
      <el-table-column prop="youkeId" label="油客网编号" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.youkeId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="youkeName" label="油客网名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.youkeName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aisoId" label="aiso编号" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aisoName" label="aiso名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button style="margin-top: 5px;" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="query.pageNum" :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!-- 添加aiso数据与youke 弹出框 -->
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form :rules="addFormRules" label-width="150px">
            <el-form-item label="aiso数据" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.aiso.cnInfo" clearable @focus="chooseAiso()" />
              </el-col>
            </el-form-item>
            <el-form-item label="youke数据" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.institute.cnInfo" clearable @focus="chooseYouke()"/>
              </el-col>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="makeSureAdd">确认添加</el-button>
        </div>
      </template>
    </el-dialog>
    <!--  选择aiso 数据 对话框  -->
    <el-dialog :title="textMap.aisotitle" :visible.sync="aisoDialogVisible" :before-close="handleAisoClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="aisoQuery.search" size="mini" clearable style="width: 300px" class="filter-item" @keyup.enter.native="handleAisoQueryFilter" @input="handleAisoQueryFilter"/>
      <el-button type="primary" @click="closeSelectDialog">清除选中</el-button>
      <el-table v-loading.body="aisoListLoading" :key="tableKey" :data="aisoQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column prop="dataId" label="aiso编号" >
          <template slot-scope="scope">
            <span>{{ scope.row.dataId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cnInfo" label="aiso名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.cnInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleAisoChoice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="aisoQuery.listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="aisoQuery.listQuery.pageSize" :total="aisoQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleAisoSizeChange" @current-change="handleAisoCurrentChange"/>
      </div>
    </el-dialog>
    <!--  选择youke数据对话框 -->
    <el-dialog :title="textMap.institutetitle" :visible.sync="instituteDialogVisible" :before-close="handleClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="instituteQuery.search" size="mini" clearable style="width: 300px" class="filter-item" placeholder="名称模糊查询" @keyup.enter.native="handleInstituteQueryFilter" @input="handleInstituteQueryFilter"/>
      <el-button type="primary" @click="closeSelectInstituteDialog">清除选中</el-button>
      <el-button v-if="instituteListButtom" type="primary" @click="handleInstituteAdd">添加</el-button>
      <el-table v-loading.body="instituteListLoading" :key="tableKey" :data="instituteQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column prop="cnId" label="油客网编号" >
          <template slot-scope="scope">
            <span>{{ scope.row.cnId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cnInfo" label="油客网名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.cnInfo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleInstituteChoice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="instituteQuery.listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="instituteQuery.listQuery.pageSize" :total="instituteQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleInstituteSizeChange" @current-change="getPageInstituteList"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { page, pageAiso, pageInstitute, addAisoInstituteData, delObj, downloadData, uploadFile } from '@/api/youke/oil/youkeOilRelation'
export default {
  name: 'YoukeOilRelationManager',
  data() {
    return {
      list: null,
      listLoading: false,
      aisoDialogVisible: false,
      instituteDialogVisible: false,
      aisoListLoading: false,
      instituteListLoading: false,
      instituteListButtom: false,
      tableKey: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      instituteName: null,
      categorys: null,
      searchdialogFormVisible: false,
      delList: null,
      search_name: null,
      search_categoryList: null,
      search_city: null,
      searchdialogStatus: '',
      total: null,
      // aiso数据与研究院数据 弹出框 双向绑定
      mainAddForm: false,
      addFormRules: {
        name: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      rules: {
        instituteName: [
          {
            required: true,
            message: '请输入研究院名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      // aiso  对象
      aiso: {
        dataId: null,
        cnInfo: null
      },
      // aiso
      aisoQuery: {
        // 类型 query
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          cnInfo: undefined
        },
        search: '',
        listLoading: false,
        list: null,
        total: null
      },
      // youke
      instituteQuery: {
        // 类型 query
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          cnInfo: undefined
        },
        search: '',
        listLoading: false,
        list: null,
        total: null
      },
      // datatAddForm 包含aiso数据和youke之后再api中区分取出
      dataAddForm: {
        aiso: {
          dataId: null,
          cnInfo: null
        },
        institute: {
          cnId: null,
          cnInfo: null
        }
      },
      form: {
        id: null,
        poiName: null,
        poiId: null,
        status: null,
        versionId: null,
        names: null
      },
      // 查询 的数据
      query: {
        pageNum: 1,
        pageSize: 10,
        youkeName: null,
        aisoName: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加youke-aiso对应关系'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取所有的数据 aiso--youke数据
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
    handleQueryFilter() {
      this.getList()
    },
    // aiso 过滤---条件查询
    handleAisoQueryFilter() {
      this.getPageAisoList()
    },
    // institute 过滤---条件查询
    handleInstituteQueryFilter() {
      this.getPageInstituteList()
    },
    // aiso名称模糊查询  数据的分页查询
    getPageAisoList() {
      this.aisoQuery.listLoading = true
      this.aisoQuery.listQuery.cnInfo = this.aisoQuery.search
      pageAiso(this.aisoQuery.listQuery).then(response => {
        this.aisoQuery.list = response.data.data.list
        this.aisoQuery.total = response.data.data.total
        this.aisoQuery.listLoading = false
      })
    },
    // youke名称模糊查询  数据的分页查询
    getPageInstituteList() {
      this.instituteQuery.listLoading = true
      this.instituteQuery.listQuery.cnInfo = this.instituteQuery.search
      pageInstitute(this.instituteQuery.listQuery).then(response => {
        this.instituteQuery.list = response.data.data.list
        this.instituteQuery.total = response.data.data.total
        this.instituteQuery.listLoading = false
        // if (response.data.data.list.length === 0) {
        //   this.instituteListButtom = true
        // } else {
        //   this.instituteListButtom = false
        // }
      })
    },
    chooseCategory() {
      this.getList()
    },
    chooseSource() {
      this.getList()
    },
    makeSureAdd() {
      if (this.dataAddForm.aiso.cnInfo === null || this.dataAddForm.institute.cnInfo === null) {
        this.$message({
          showClose: true,
          message: '请选择数据',
          type: 'info'
        })
        return false
      }
      addAisoInstituteData(this.dataAddForm).then(response => {
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
      // 关闭弹窗 清空数据
      this.mainAddForm = false
      this.clearAisoTable()
      this.clearinstitute()
    },
    //  显示 添加aiso  数据  与研究院数据  的弹框 函数
    showAisoAddDialog() {
      this.mainAddForm = true
    },
    // 显示添加添加aiso数据与研究院数据的弹框 中 aiso数据的弹框函数
    chooseAiso() {
      // 显示所有的数据 分页查询
      this.getPageAisoList()
      this.aisoDialogVisible = true
    },
    // 显示添加添加aiso数据与研究院数据的弹框 中 institute数据的弹框函数
    chooseYouke() {
      // 显示所有的数据
      this.getPageInstituteList()
      this.instituteDialogVisible = true
    },
    // 选择 aiso数据
    handleAisoChoice(row) {
      this.dataAddForm.aiso.dataId = row.dataId
      this.dataAddForm.aiso.cnInfo = row.cnInfo
      // 关闭类型弹框
      this.aisoDialogVisible = false
      return
    },
    // 选择 institute数据
    handleInstituteChoice(row) {
      this.dataAddForm.institute.cnId = row.cnId
      this.dataAddForm.institute.cnInfo = row.cnInfo
      console.log(this.dataAddForm)
      // 关闭类型弹框
      this.instituteDialogVisible = false
      return
    },
    // 当未查询出研究院数据时 执行的添加操作
    handleInstituteAdd() {
      this.dataAddForm.institute.code = ''
      this.dataAddForm.institute.name = this.instituteQuery.search
      console.log(this.dataAddForm)
      // 关闭类型弹框
      this.instituteDialogVisible = false
      // 清除输入框
      this.instituteQuery.search = ''
      return
    },
    // 关闭对话框 清空数据
    closeSelectDialog() {
      this.aisoDialogVisible = false
      this.clearAisoTable()
    },
    closeSelectInstituteDialog() {
      this.instituteDialogVisible = false
      this.clearinstitute()
    },
    // 清空 dataAddForm中的aiso
    clearAisoTable() {
      this.dataAddForm.aiso.dataId = null
      this.dataAddForm.aiso.cnInfo = null
    },
    // 清空 dataAddForm中的institute
    clearinstitute() {
      this.dataAddForm.institute.cnId = null
      this.dataAddForm.institute.cnInfo = null
    },
    // 分页页数跳转
    handleSizeChange(val) {
      this.query.pageSize = val
      this.getList()
    },
    // aiso分页页数跳转
    handleAisoSizeChange(val) {
      this.aisoQuery.listQuery.pageSize = val
      this.getPageAisoList()
    },
    // institute分页页数跳转
    handleInstituteSizeChange(val) {
      this.instituteQuery.listQuery.pageSize = val
      this.getPageInstituteList()
    },
    // 选择当前显示页数
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.getList()
    },
    // aiso显示当前页数
    handleAisoCurrentChange(val) {
      this.aisoQuery.listQuery.pageNum = val
      this.getPageAisoList()
    },
    // institute显示当前页数
    handleInstituteCurrentChange(val) {
      this.instituteQuery.listQuery.pageNum = val
      this.getPageInstituteList()
    },
    // 关闭弹出框之后的操作
    closeDialog() {
      this.clearAisoTable()
      this.clearinstitute()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then((response) => {
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
      }).catch(() => {
        // 点击“取消后操作”
        this.cancel('')
      })
    },
    // 取消
    cancel(formName) {
      this.dialogFormVisible = false
      this.searchdialogFormVisible = false
      if (formName !== '') {
        this.$refs[formName].resetFields()
      }
      this.isHistoryNames = null
      this.search_name = null
      this.search_categoryList = null
      this.search_city = null
      this.delList = null
    },
    // 关闭弹窗 清除数据
    handleClose() {
      this.instituteDialogVisible = false
      this.instituteQuery.search = ''
    },
    // 关闭弹窗 清除数据
    handleAisoClose() {
      this.aisoDialogVisible = false
      this.aisoQuery.search = ''
    },
    // 导出数据
    downloadData(scheduleType) {
      downloadData().then(response => {
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'youke_aiso_oil_relation.csv'
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
