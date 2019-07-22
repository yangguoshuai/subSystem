<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-col :span="4">
        <span>aiso名称：</span>
        <el-input v-model="query.aisoName" clearable style="width: 200px;" placeholder="模糊查询" @keyup.enter.native="handleAisoTencentQueryFilter" @input="handleAisoTencentQueryFilter" />
      </el-col>
      <el-col :span="5">
        <span>腾讯名称：</span>
        <el-input v-model="query.tencentName" clearable style="width: 200px;" placeholder="模糊查询" @keyup.enter.native="handleAisoTencentQueryFilter" @input="handleAisoTencentQueryFilter" />
      </el-col>
      <el-col :span="4">
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
          style="margin-left: 1550px;    margin-top: -2.7%;">
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
      <el-table-column prop="tencentCode" label="腾讯Code" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.tencentCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tencentName" label="腾讯名称" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.tencentName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="对应类别" min-width="45%">
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
    <!-- 添加aiso数据与腾讯数据 弹出框 -->
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form :rules="addFormRules" label-width="150px">
            <el-form-item label="aiso数据" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.aiso.name" clearable placeholder="请选择aiso数据" @focus="chooseAiso()" />
              </el-col>
            </el-form-item>
            <el-form-item label="请选择腾讯数据" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.tencent.name" clearable placeholder="请选择腾讯类型" @focus="chooseTencent()"/>
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
    <!--  选择 tencent数据对话框  -->
    <el-dialog :title="textMap.tencenttitle" :visible.sync="tencentDialogVisible" :before-close="handleClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="tencentQuery.search" size="mini" clearable style="width: 300px" class="filter-item" placeholder="腾讯名称模糊查询" @keyup.enter.native="handleTencentQueryFilter" @input="handleTencentQueryFilter"/>
      <el-button type="primary" @click="closeSelectTencentDialog">清除选中</el-button>
      <el-button v-if="tencentListButtom" type="primary" @click="handleTencentAdd">添加</el-button>
      <el-table v-loading.body="tencentListLoading" :key="tableKey" :data="tencentQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column label="序号" type="index" show-overflow-tooltip width="50"/>
        <el-table-column prop="tencentName" label="腾讯名称" >
          <template slot-scope="scope">
            <span>{{ scope.row.tencentName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tencentCode" label="腾讯Code" >
          <template slot-scope="scope">
            <span>{{ scope.row.tencentCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleTencentChoice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="tencentQuery.listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="tencentQuery.listQuery.pageSize" :total="tencentQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleTencentSizeChange" @current-change="handleTencentCurrentChange"/>
      </div>
    </el-dialog>
    <!--编辑弹出框-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="腾讯code" prop="tencentCode">
          <el-input v-model="form.tencentCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="腾讯名称" prop="tencentName">
          <el-input v-model="form.tencentName" placeholder="请输入腾讯名称"/>
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
import { page, pageAiso, pageTencent, addAisoTencentData, downloadAll, delObj, getObj, addObj, uploadExcel } from '@/api/tencent/aiso-tencent'
import { selectByName } from '@/api/aiso/index'
export default {
  name: 'TencentAisoRelationManager',
  data() {
    return {
      list: null,
      fullscreenLoading: false,
      listLoading: false,
      searchNameLoading: false,
      aisoDialogVisible: false,
      tencentDialogVisible: false,
      aisoListLoading: false,
      tencentListLoading: false,
      tencentListButtom: false,
      tableKey: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      tencentName: null,
      categorys: null,
      searchdialogFormVisible: false,
      delList: null,
      search_name: null,
      search_categoryList: null,
      search_city: null,
      searchdialogStatus: '',
      total: null,
      // aiso数据与腾讯数据 弹出框 双向绑定
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
        tencentName: [
          {
            required: true,
            message: '请输入腾讯名称',
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
      // tencent
      tencentQuery: {
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
      // datatAddForm 包含aiso数据和腾讯数据之后再api中区分取出
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
        tencent: {
          id: null,
          tencentCode: null,
          tencentName: null
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
        tencentName: undefined,
        category: null,
        source: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加aiso数据与腾讯数据',
        aisotitle: 'aiso数据',
        tencenttitle: '腾讯数据'
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
    handleAisoTencentQueryFilter() {
      this.getList()
    },
    // aiso 过滤---条件查询
    handleAisoQueryFilter() {
      this.getPageAisoList()
    },
    // tencent 过滤---条件查询
    handleTencentQueryFilter() {
      this.getPageTencentList()
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
    getPageTencentList() {
      this.tencentQuery.listLoading = true
      this.tencentQuery.listQuery.name = this.tencentQuery.search
      pageTencent(this.tencentQuery.listQuery).then(response => {
        this.tencentQuery.list = response.data.data.list
        this.tencentQuery.total = response.data.data.total
        this.tencentQuery.listLoading = false
        if (response.data.data.list.length === 0) {
          this.tencentListButtom = true
        } else {
          this.tencentListButtom = false
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
      if (this.dataAddForm.aiso.name === null || this.dataAddForm.tencent.name === null || this.dataAddForm.aiso.category === null) {
        this.$message({
          showClose: true,
          message: '请选择数据',
          type: 'info'
        })
        return false
      }
      addAisoTencentData(this.dataAddForm).then(response => {
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
      this.clearTencent()
    },
    //  显示 添加aiso  数据  与腾讯数据  的弹框 函数
    showAisoAddDialog() {
      this.mainAddForm = true
    },
    // 显示添加添加aiso数据与腾讯数据的弹框 中 aiso数据的弹框函数
    chooseAiso() {
      // 显示所有的数据 分页查询
      this.getPageAisoList()
      this.aisoDialogVisible = true
    },
    // 显示添加添加aiso数据与腾讯数据的弹框 中 institute数据的弹框函数
    chooseTencent() {
      // 显示所有的数据
      this.getPageTencentList()
      this.tencentDialogVisible = true
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
    // 选择 tencent 数据
    handleTencentChoice(row) {
      this.dataAddForm.tencent.id = row.id
      this.dataAddForm.tencent.code = row.tencentCode
      this.dataAddForm.tencent.name = row.tencentName
      console.log(this.dataAddForm)
      // 关闭类型弹框
      this.tencentDialogVisible = false
      return
    },
    // 当未查询出腾讯数据时 执行的添加操作
    handleTencentAdd() {
      this.dataAddForm.tencent.code = ''
      this.dataAddForm.tencent.name = this.tencentQuery.search
      console.log(this.dataAddForm)
      // 关闭类型弹框
      this.tencentDialogVisible = false
      // 清除输入框
      this.tencentQuery.search = ''
      return
    },
    // 导出aiso与 tencent 关系数据
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
        link.download = 'aiso-tencent-data.csv'
        this.listLoading = false
        link.click()
      })
    },
    // 关闭对话框 清空数据
    closeSelectDialog() {
      this.aisoDialogVisible = false
      this.clearAisoTable()
    },
    closeSelectTencentDialog() {
      this.tencentDialogVisible = false
      this.clearTencent()
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
    clearTencent() {
      this.dataAddForm.tencent.id = null
      this.dataAddForm.tencent.code = null
      this.dataAddForm.tencent.name = null
      this.dataAddForm.tencent.eName = null
      this.dataAddForm.tencent.pCode = null
      this.dataAddForm.tencent.pName = null
      this.dataAddForm.tencent.pEName = null
      this.dataAddForm.tencent.isParent = null
      this.dataAddForm.tencent.status = null
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
    handleTencentSizeChange(val) {
      this.tencentQuery.listQuery.pageSize = val
      this.getPageTencentList()
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
    // tencent显示当前页数
    handleTencentCurrentChange(val) {
      this.tencentQuery.listQuery.pageNum = val
      this.getPageTencentList()
    },
    // 关闭弹出框之后的操作
    closeDialog() {
      this.clearAisoTable()
      this.clearTencent()
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
      this.tencentDialogVisible = false
      this.tencentQuery.search = ''
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
