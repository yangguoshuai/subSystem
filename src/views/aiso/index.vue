<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="6">
        <span>aiso名称：</span>
        <el-input v-model="query.aisoName" clearable style="width: 200px;" placeholder="模糊查询" @keyup.enter.native="handleAisoInstituteQueryFilter" @input="handleAisoInstituteQueryFilter" />
      </el-col>
      <el-col :span="6">
        <span>类别：</span>
        <el-select v-model="query.category" clearable placeholder="请选择" @change="chooseCategory">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span>来源：</span>
        <el-select v-model="query.source" clearable placeholder="请选择" @change="chooseSource">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-col>
      <div class="filter-container">
        <el-button type="primary" @click="showAisoAddDialog">添加数据</el-button>
        <el-button type="primary" @click="downloadData">导出数据</el-button>
        <el-button type="primary" @click="searchData">接口搜索</el-button>
      </div>
      <div>
        <el-upload
          :before-upload="beforeUpload"
          :auto-upload="true"
          class="upload-demo"
          action="1"
          multiple
          accept=".xlsx,"
          style="margin-left: 1480px;    margin-top: -2.7%;">
          <el-button v-loading.fullscreen.lock="fullscreenLoading" style="padding: 11px 15px;" element-loading-text="导入数据中..." size="small" type="primary">导入Excel文件</el-button>
        </el-upload>
      </div>
    </div>

    <el-table v-loading.body="listLoading" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="aisoCode" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aisoName" label="aiso名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="instituteCode" label="研究院Code" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.instituteCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="instituteName" label="研究院名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.instituteName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="对应研究类别" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.category === 1 ? '类型' : scope.row.category === 2 ? '品牌' : scope.row.category === 3 ? '风味' : '标签' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="来源" label="source" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.source ===1 ? '原始':'人工添加' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button style="margin-top: 5px;" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="query.pageNum" :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!-- 添加aiso数据与研究院数据 弹出框 -->
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form :rules="addFormRules" label-width="150px">
            <el-form-item label="aiso数据" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.aiso.name" clearable placeholder="请选择aiso数据" @focus="chooseAiso()" />
              </el-col>
            </el-form-item>
            <el-form-item label="请选择研究院数据" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.institute.name" clearable placeholder="请选择institute类型" @focus="chooseInstitute()"/>
              </el-col>
            </el-form-item>
          </el-form>
          <el-col :span="15">
            <span>类别：</span>
            <el-select v-model="dataAddForm.aiso.category" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-col>
          <!--这个是为了调整格式增加的div-->
          <pre>
            <div/>
          </pre>
          <el-button type="primary" @click="makeSureAdd">确认添加</el-button>
        </div>
      </template>
    </el-dialog>
    <!--  选择aiso 数据 对话框  -->
    <el-dialog :title="textMap.aisotitle" :visible.sync="aisoDialogVisible" :before-close="handleAisoClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="aisoQuery.search" size="mini" clearable style="width: 300px" class="filter-item" placeholder="aiso名称模糊查询" @keyup.enter.native="handleAisoQueryFilter" @input="handleAisoQueryFilter"/>
      <el-button type="primary" @click="closeSelectDialog">清除选中</el-button>
      <el-table v-loading.body="aisoListLoading" :key="tableKey" :data="aisoQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column label="序号" type="index" show-overflow-tooltip width="50"/>
        <el-table-column prop="name" label="aiso名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="aisoCode" >
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="对应aiso类别" >
          <template slot-scope="scope">
            <span>{{ scope.row.category == 0 ? '类型' : (scope.row.category == 1 ? '品牌' : (scope.row.category == 2 ? '风味' : '标签')) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleAisoChoice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="aisoQuery.listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="aisoQuery.listQuery.pageSize" :total="aisoQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleAisoSizeChange" @current-change="handleAisoCurrentChange"/>
      </div>
    </el-dialog>
    <!--  选择 Institute数据对话框  -->
    <el-dialog :title="textMap.institutetitle" :visible.sync="instituteDialogVisible" :before-close="handleClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="instituteQuery.search" size="mini" clearable style="width: 300px" class="filter-item" placeholder="institute名称模糊查询" @keyup.enter.native="handleInstituteQueryFilter" @input="handleInstituteQueryFilter"/>
      <el-button type="primary" @click="closeSelectInstituteDialog">清除选中</el-button>
      <el-button v-if="instituteListButtom" type="primary" @click="handleInstituteAdd">添加</el-button>
      <el-table v-loading.body="instituteListLoading" :key="tableKey" :data="instituteQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column label="序号" type="index" show-overflow-tooltip width="50"/>
        <el-table-column prop="name" label="institute名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="instituteCode" >
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
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
    <!--编辑弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="研究院code" prop="instituteCode">
          <el-input v-model="form.instituteCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="研究院名称" prop="instituteName">
          <el-input v-model="form.instituteName" placeholder="请输入研究院名称"/>
        </el-form-item>

        <el-form-item label="对应类型" prop="category">
          <el-select v-model="categorys" class="filter-item" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!--接口搜索弹出框-->
    <el-dialog :title="textMap[searchdialogStatus]" :visible.sync="searchdialogFormVisible" :close-on-click-modal="false" :show-close="false" width="1000px" style="height:800px">

      <el-form ref="form" :model="form" style="margin-top: 20px;" label-width="100px">
        <span>名称:</span>
        <el-input v-model="search_name" placeholder="请输入名称" required: true style="width:200px"/>

        <span>类别:</span>
        <el-select v-model="search_categoryList" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>

        <span>城市:</span>
        <el-input v-model="search_city" placeholder="请输入城市" style="width:200px"/>

        <div style="text-align: right" >
          <el-button class="filter-item" type="primary" icon="search" @click="handleNameFilter()" >搜索</el-button>
          <el-button @click="cancel('form')">关 闭</el-button>
        </div>
      </el-form>

      <el-table v-loading.lock="searchNameLoading" ref="searchTab" :data="delList" border fit highlight-current-row style="width: 100%;height:350px;margin-top: 20px;overflow:auto">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="品牌">
          <template slot-scope="scope">
            <span>{{ scope.row.brand }}</span>
          </template>
        </el-table-column>

        <el-table-column label="风味/标签" min-width="120%">
          <template slot-scope="scope">
            <span>{{ scope.row.tag }}</span>
          </template>
        </el-table-column>

        <el-table-column label="省/市/区" min-width="120%">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}/{{ scope.row.city }}/{{ scope.row.district }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { page, pageAiso, pageInstitute, addAisoInstituteData, downloadAll, delObj, getObj, addObj, selectByName, uploadExcel } from '@/api/aiso/index'
export default {
  name: 'AisouInstituteData',
  data() {
    return {
      list: null,
      fullscreenLoading: false,
      listLoading: false,
      searchNameLoading: false,
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
        id: null,
        code: null,
        name: null,
        englishName: null,
        isSupportSceen: null,
        category: null,
        isParent: null,
        parentCode: null,
        parentName: null,
        parentEnglishName: null
      },
      // aiso
      aisoQuery: {
        // 类型 query
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: undefined
        },
        search: '',
        listLoading: false,
        list: null,
        total: null
      },
      // Institute
      instituteQuery: {
        // 类型 query
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          name: undefined
        },
        search: '',
        listLoading: false,
        list: null,
        total: null
      },
      // datatAddForm 包含aiso数据和研究院数据之后再api中区分取出
      dataAddForm: {
        aiso: {
          id: null,
          code: null,
          name: null,
          englishName: null,
          isSupportSceen: null,
          category: null,
          isParent: null,
          parentCode: null,
          parentName: null,
          parentEnglishName: null
        },
        institute: {
          id: null,
          code: null,
          name: null,
          eName: null,
          pCode: null,
          pName: null,
          pEName: null,
          isParent: null,
          status: null
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
        aisoName: undefined,
        category: null,
        source: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加aiso数据与研究院数据',
        aisotitle: 'aiso数据',
        institutetitle: '研究院数据'
      },
      // 类型品牌风味下拉框
      options: [{
        value: '1',
        label: '类型'
      }, {
        value: '2',
        label: '品牌'
      }, {
        value: '3',
        label: '风味'
      }, {
        value: '4',
        label: '标签'
      }],
      options2: [{
        value: '1',
        label: '原始'
      }, {
        value: '2',
        label: '人工'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取所有的数据 aiso--institute数据
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
    handleAisoInstituteQueryFilter() {
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
      this.aisoQuery.listQuery.name = this.aisoQuery.search
      pageAiso(this.aisoQuery.listQuery).then(response => {
        this.aisoQuery.list = response.data.data.list
        this.aisoQuery.total = response.data.data.total
        this.aisoQuery.listLoading = false
      })
    },
    // aiso名称模糊查询  数据的分页查询
    getPageInstituteList() {
      this.instituteQuery.listLoading = true
      this.instituteQuery.listQuery.name = this.instituteQuery.search
      pageInstitute(this.instituteQuery.listQuery).then(response => {
        this.instituteQuery.list = response.data.data.list
        this.instituteQuery.total = response.data.data.total
        this.instituteQuery.listLoading = false
        if (response.data.data.list.length === 0) {
          this.instituteListButtom = true
        } else {
          this.instituteListButtom = false
        }
      })
    },
    chooseCategory() {
      this.getList()
    },
    chooseSource() {
      this.getList()
    },
    makeSureAdd() {
      if (this.dataAddForm.aiso.name === null || this.dataAddForm.institute.name === null || this.dataAddForm.aiso.category === null) {
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
    chooseInstitute() {
      // 显示所有的数据
      this.getPageInstituteList()
      this.instituteDialogVisible = true
    },
    // 选择 aiso数据
    // 此处将aiso数据的 category 去掉 单独提出进行选择
    handleAisoChoice(row) {
      this.dataAddForm.aiso.id = row.id
      this.dataAddForm.aiso.code = row.code
      this.dataAddForm.aiso.name = row.name
      this.dataAddForm.aiso.englishName = row.englishName
      this.dataAddForm.aiso.isSupportSceen = row.isSupportSceen
      this.dataAddForm.aiso.isParent = row.isParent
      this.dataAddForm.aiso.parentCode = row.parentCode
      this.dataAddForm.aiso.parentName = row.parentName
      this.dataAddForm.aiso.parentEnglishName = row.parentEnglishName
      // 关闭类型弹框
      this.aisoDialogVisible = false
      return
    },
    // 选择 institute数据
    handleInstituteChoice(row) {
      this.dataAddForm.institute.id = row.id
      this.dataAddForm.institute.code = row.code
      this.dataAddForm.institute.name = row.name
      this.dataAddForm.institute.eName = row.eName
      this.dataAddForm.institute.pCode = row.pCode
      this.dataAddForm.institute.pName = row.pName
      this.dataAddForm.institute.pEName = row.pEName
      this.dataAddForm.institute.isParent = row.isParent
      this.dataAddForm.institute.status = row.status
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
    // 导出aiso与 Institute关系数据
    downloadData(scheduleType) {
      this.listLoading = true
      downloadAll().then(response => {
        this.ct_month = new Date().getTime()
        // 创建一个blob对象,file的一种
        const blob = new Blob([response.data], { type: 'application/x-xls' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // 配置下载的文件名
        // this.curDateTime()
        link.download = 'aiso-institute.csv'
        this.listLoading = false
        link.click()
      })
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
      this.dataAddForm.aiso.id = null
      this.dataAddForm.aiso.code = null
      this.dataAddForm.aiso.name = null
      this.dataAddForm.aiso.englishName = null
      this.dataAddForm.aiso.isSupportSceen = null
      this.dataAddForm.aiso.category = null
      this.dataAddForm.aiso.isParent = null
      this.dataAddForm.aiso.parentCode = null
      this.dataAddForm.aiso.parentName = null
      this.dataAddForm.aiso.parentEnglishName = null
    },
    // 清空 dataAddForm中的institute
    clearinstitute() {
      this.dataAddForm.institute.id = null
      this.dataAddForm.institute.code = null
      this.dataAddForm.institute.name = null
      this.dataAddForm.institute.eName = null
      this.dataAddForm.institute.pCode = null
      this.dataAddForm.institute.pName = null
      this.dataAddForm.institute.pEName = null
      this.dataAddForm.institute.isParent = null
      this.dataAddForm.institute.status = null
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
    // 编辑弹框
    handleUpdate(row) {
      getObj(row.id).then(response => {
        if (response.data.code !== 200) {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }

        if (response.data.data.category === 1) {
          this.categorys = '类型'
        } else if (response.data.data.category === 2) {
          this.categorys = '品牌'
        } else {
          this.categorys = '风味'
        }

        this.form = response.data.data
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    // 编辑保存
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false

          if (this.categorys === '类型') {
            this.form.category = 1
          } else if (this.categorys === '品牌') {
            this.form.category = 2
          } else if (this.categorys === '风味') {
            this.form.category = 3
          } else {
            this.form.category = this.categorys
          }

          addObj(this.form).then((response) => {
            this.dialogFormVisible = false
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
        } else {
          return false
        }
      })
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
    // 接口搜索框弹出
    searchData(row) {
      this.searchdialogFormVisible = true
      this.search_categoryList = '类型'
    },
    // 接口搜索查询
    handleNameFilter() {
      this.searchNameLoading = true
      if (this.search_categoryList === '类型') {
        this.category = 1
      } else if (this.search_categoryList === '品牌') {
        this.category = 2
      } else if (this.search_categoryList === '风味') {
        this.category = 3
      } else {
        this.category = this.search_categoryList
      }

      selectByName(this.search_name, this.category, this.search_city, 0).then(response => {
        if (response.data.code === 200) {
          this.delList = response.data.data
          this.searchNameLoading = false
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          this.searchNameLoading = false
        }
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
