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
      <el-col :span="3">
        <el-input v-model="query.aisoInfo" clearable style="width: 200px;" placeholder="aisoInfo模糊查询" @keyup.enter.native="handleAisoFlavorInfoQueryFilter" @input="handleAisoFlavorInfoQueryFilter" />
      </el-col>
      <el-col :span="3">
        <el-input v-model="query.autoInfo" clearable style="width: 200px;" placeholder="autoInfo模糊查询" @keyup.enter.native="handleAisoFlavorInfoQueryFilter" @input="handleAisoFlavorInfoQueryFilter" />
      </el-col>
      <el-col :span="3">
        <el-input v-model="query.aisoID" clearable style="width: 200px;" placeholder="aisoID查询" @keyup.enter.native="handleAisoFlavorInfoQueryFilter" @input="handleAisoFlavorInfoQueryFilter" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="query.autoID" clearable style="width: 200px;" placeholder="autoID查询" @keyup.enter.native="handleAisoFlavorInfoQueryFilter" @input="handleAisoFlavorInfoQueryFilter" />
      </el-col>
      <div class="filter-container">
        <el-button v-if="query.version !=null" type="primary" @click="showAisoAddDialog">添加数据</el-button>
        <el-button type="primary" @click="downloadData" >数据导出</el-button>
        <div style="float:right">
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
      <el-table-column prop="aisoID" label="aisoID" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoID }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="autoID" label="autoID" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.autoID }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="aisoInfo" label="aisoInfo" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.aisoInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="autoInfo" label="autoInfo" min-width="45%">
        <template slot-scope="scope">
          <span>{{ scope.row.autoInfo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination :current-page.sync="query.pageNum" :page-sizes="[10,20,30, 50]" :page-size="query.pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!--添加aisoFlavor与autoFlavor对应关系数据的弹出框-->
    <el-dialog :title="textMap.add" :visible.sync="mainAddForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form ref="dataAddForm" :model="dataAddForm" label-width="150px">
            <el-form-item label="id" prop="dataId" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.aisoID" clearable placeholder="请选择aisoID" @focus="chooseAisoID()" />
              </el-col>
            </el-form-item>
            <el-form-item label="请选择autoID" prop="cnInfo" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.autoID" clearable placeholder="cnInfo" @focus="chooseAutoID()" />
              </el-col>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="makeSureAdd()">确认添加</el-button>
        </div>
      </template>
    </el-dialog>
    <!--更新aisoFlavor与autoFlavor对应关系数据的弹出框-->
    <el-dialog :title="textMap.update" :visible.sync="mainUpdateForm" :close-on-click-modal="false" width="40%" custom-class="el_dialog2" align="center" @close="closeDialog">
      <template>
        <div class="addAlias-div" style="padding-top: 20px;">
          <el-form ref="dataAddForm" :model="dataAddForm" label-width="150px">
            <el-form-item label="id" prop="dataId" width="300">
              <el-col :span="12">
                <el-input v-model="dataAddForm.aisoID" clearable placeholder="请选择aisoID" @focus="chooseAisoID()" />
              </el-col>
            </el-form-item>
            <el-form-item label="请选择autoID" prop="cnInfo" >
              <el-col :span="12">
                <el-input v-model="dataAddForm.autoID" clearable placeholder="cnInfo" @focus="chooseAutoID()" />
              </el-col>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="makeSureUpdate()">确认修改</el-button>
        </div>
      </template>
    </el-dialog>
    <!--  选择aisoFlavor 数据 对话框  -->
    <el-dialog :title="textMap.aisoFlavor" :visible.sync="aisoDialogVisible" :before-close="handleAisoClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="aisoQuery.cnInfo" size="mini" clearable style="width: 300px" class="filter-item" placeholder="aisoFlavor名称模糊查询" @keyup.enter.native="handleAisoFlavorQueryFilter" @input="handleAisoFlavorQueryFilter"/>
      <el-button type="primary" @click="closeSelectDialog">清除选中</el-button>
      <el-table v-loading.body="aisoListLoading" :key="tableKey" :data="aisoQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column prop="code" label="code" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="中文名称" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="englishName" label="英文名称" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.englishName }}</span>
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
        <el-pagination :current-page.sync="aisoQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="aisoQuery.pageSize" :total="aisoQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleAisoSizeChange" @current-change="handleAisoCurrentChange"/>
      </div>
    </el-dialog>
    <!--  选择autoFlavor 数据 对话框  -->
    <el-dialog :title="textMap.autoFlavor" :visible.sync="autoFlavorDialogVisible" :before-close="handleClose" lock-scroll style="overflow: hidden;padding:10px 20px 30px 20px;">
      <el-input v-model="autoQuery.cnInfo" size="mini" clearable style="width: 300px" class="filter-item" placeholder="autoFlavor名称模糊查询" @keyup.enter.native="handleAutoFlavorQueryFilter" @input="handleAutoFlavorQueryFilter"/>
      <el-button type="primary" @click="closeSelectAutoFlavorDialog">清除选中</el-button>
      <el-table v-loading.body="autoFlavorListLoading" :key="tableKey" :data="autoQuery.list" fit highlight-current-row stripe min-height="300" max-height="500" size="mini" >
        <el-table-column prop="code" label="code" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cnInfo" label="中文名称" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cnInfo" label="英文名称" min-width="45%">
          <template slot-scope="scope">
            <span>{{ scope.row.ename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleAutoFlavorChoice(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination :current-page.sync="autoQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="autoQuery.pageSize" :total="autoQuery.total" layout="total, sizes, prev, pager, next" @size-change="handleAutoFlavorSizeChange" @current-change="handleAutoFlavorCurrentChange"/>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="isDeleteDialogVisible"
      title="提示"
      width="30%">
      <span>确定删除吗，删除之后无法恢复</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete()">取 消</el-button>
        <el-button type="primary" @click="isDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { page, insertData, uploadFile, getVersion, updateData, deleteData, downloadData } from '@/api/relationship/AisoAndSwFlavorMapping'
import { getFlavorByPage, pageAisoFlavor as pageAisoBrand } from '@/api/flavor/flavor'
export default {
  name: 'AisoFlavorAndAutoFlavorRelationManager',
  data() {
    return {
      tableKey: 0,
      isDeleteDialogVisible: false,
      listLoading: false,
      mainAddForm: false,
      mainUpdateForm: false,
      aisoDialogVisible: false,
      aisoListLoading: false,
      autoFlavorListLoading: false,
      autoFlavorDialogVisible: false,
      fullscreenLoading: false,
      list: null,
      total: null,
      versionList: null,
      query: {
        id: null,
        aisoID: null,
        autoID: null,
        aisoInfo: null,
        autoInfo: null,
        version: null,
        pageNum: 1,
        pageSize: 10
      },
      dataAddForm: {
        id: null,
        aisoID: null,
        autoID: null,
        version: null
      },
      // aiso查询的对象
      aisoQuery: {
        customID: undefined,
        cnInfo: null,
        enInfo: null,
        pageNum: 1,
        pageSize: 10,
        listLoading: false,
        list: null,
        total: null
      },
      autoQuery: {
        autoFlavorID: null,
        cnInfo: null,
        enInfo: null,
        version: null,
        pageNum: 1,
        pageSize: 10,
        listLoading: false,
        list: null,
        total: null
      },
      // 弹出框的 title 文本
      textMap: {
        add: '添加aisoFlavorBrand数据',
        update: '更新aisoFlavorBrand数据',
        aisoFlavor: 'aisoFlavor数据',
        autoFlavor: 'autoFlavor数据'
      }
    }
  },
  // 钩子
  created() {
    this.version()
  },
  methods: {
    version() {
      getVersion().then(response => {
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
    getAisoFlavorList() {
      pageAisoBrand(this.aisoQuery).then(response => {
        if (response.data.code === 200) {
          this.aisoQuery.list = response.data.data.list
          this.aisoQuery.total = response.data.data.total
        } else {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        }
      })
    },
    getAutoFlavorList() {
      getFlavorByPage(this.autoQuery).then(response => {
        if (response.data.code === 200) {
          this.autoQuery.list = response.data.data.list
          this.autoQuery.total = response.data.data.total
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
    handleAisoFlavorInfoQueryFilter() {
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
      // 清空数据
      this.clearDataAddForm()
      this.getList()
    },
    closeDialogUpdate() {
      // 清空数据
      this.clearDataAddForm()
      this.getList()
    },
    makeSureAdd() {
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
          this.mainUpdateForm = false
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
    deleteData() {
      deleteData(this.dataAddForm).then(response => {
        if (response.data.code === 200) {
          this.$message({
            showClose: true,
            message: response.data.msg,
            type: 'success'
          })
          // 成功后关闭弹窗
          this.mainUpdateForm = false
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
    // 显示可供选择的aisoFlavor的添加数据
    chooseAisoID() {
      // 分页查询数据
      this.getAisoFlavorList()
      this.aisoDialogVisible = true
    },
    // 显示可供选择的autoFlavor的添加数据
    chooseAutoID() {
      this.getAutoFlavorList()
      this.autoFlavorDialogVisible = true
    },
    // aisoFlavor弹出框关闭函数
    handleAisoClose() {
      // 清空输入框
      this.aisoQuery.cnInfo = null
      this.aisoDialogVisible = false
    },
    // autoFlavor弹出框关闭函数
    handleClose() {
      // 清空输入框
      this.autoQuery.cnInfo = null
      this.autoFlavorDialogVisible = false
    },
    // 选中aisoFlavor数据
    handleAisoChoice(val) {
      this.dataAddForm.aisoID = val.code
      // 清空输入框
      this.aisoQuery.cnInfo = null
      this.aisoDialogVisible = false
    },
    // 选中autoFlavor数据
    handleAutoFlavorChoice(val) {
      this.dataAddForm.autoID = val.code
      this.autoQuery.cnInfo = null
      this.autoFlavorDialogVisible = false
    },
    // 清除选中的aisoFlavor数据
    closeSelectDialog() {
      this.dataAddForm.aisoID = null
      this.aisoDialogVisible = false
    },
    // 清除选中的autoFlavor数据
    closeSelectAutoFlavorDialog() {
      this.dataAddForm.autoID = null
      this.autoFlavorDialogVisible = false
    },
    // aisoFlavor分页跳转
    handleAisoSizeChange(val) {
      this.aisoQuery.pageSize = val
      this.getAisoFlavorList()
    },
    // autoFlavor分页跳转
    handleAutoFlavorSizeChange(val) {
      this.autoQuery.pageSize = val
      this.getAutoFlavorList()
    },
    // aisoFlavor显示当前页数
    handleAisoCurrentChange(val) {
      this.aisoQuery.pageNum = val
      this.getAisoFlavorList()
    },
    // autoFlavor显示当前页数
    handleAutoFlavorCurrentChange(val) {
      this.autoQuery.pageNum = val
      this.getAutoFlavorList()
    },
    // 根据 cnInfo查询 aisoFlavor数据
    handleAisoFlavorQueryFilter() {
      this.getAisoFlavorList()
    },
    // 根据 cnInfo查询 autoFlavor数据
    handleAutoFlavorQueryFilter() {
      this.getAutoFlavorList()
    },
    // 显示添加数据的弹框
    showAisoAddDialog() {
      this.mainAddForm = true
    },
    // 更新操作
    handleUpdate(val) {
      this.mainUpdateForm = true
      this.dataAddForm.id = val.id
      this.dataAddForm.autoID = val.autoID
      this.dataAddForm.aisoID = val.aisoID
    },
    // 删除操作
    handleDelete(val) {
      this.dataAddForm.id = val.id
      this.dataAddForm.autoID = val.autoID
      this.dataAddForm.aisoID = val.aisoID
      this.isDeleteDialogVisible = true
    },
    // 取消删除
    cancelDelete() {
      this.isDeleteDialogVisible = false
      this.clearDataAddForm()
    },
    // 确认删除
    isDelete() {
      this.isDeleteDialogVisible = false
      this.deleteData(this.dataAddForm)
    },
    // 清除dataAddForm数据
    clearDataAddForm() {
      this.dataAddForm.id = null
      this.dataAddForm.aisoID = null
      this.dataAddForm.autoID = null
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
        link.download = this.dataAddForm.version + '_Flavor-Aiso-SW.csv'
        this.listLoading = false
        link.click()
      })
    },
    beforeUpload(file) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('tableName', 'flavor_aisoandauto_mapping')
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
      this.autoQuery.version = this.query.version
      this.getList()
    }
  }
}
</script>
