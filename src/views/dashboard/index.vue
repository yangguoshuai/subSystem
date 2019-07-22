<template>
  <div class="dashboard-container">
    <!-- <img :src="mapPng" width="313" height="428"  :alt="欢迎登录运维系统" > -->
    <div
      style="font-size: 40px;
    margin-top: 48px;
    margin-left: 597px;">欢迎登录运维系统</div>

    <!-- <component :is="currentRole"/>  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :show-close="false" :close-on-click-modal="false" width="35%" >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword" >
          <el-input v-model="form.oldPassword" placeholder="请输入原密码" style="width: 92%;"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input :type="passwordType" v-model="form.password" auto-complete="on" placeholder="请输入新密码" style="width: 92%;"/>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" >
          <el-input :type="rePasswordType" v-model="form.rePassword" placeholder="请确认密码" style="width: 92%;" @keyup.enter.native="create('form')"/>
          <span class="show-pwd" @click="showRePwd"> <svg-icon icon-class="eye" /></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="visible" :disabled="true" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="create('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import { getUserId, removeToken } from '@/utils/auth'
import { updatePassword } from '@/api/login'
export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // mapPng: mapPng + '?' + +new Date(),
      currentRole: 'adminDashboard',
      dialogFormVisible: false,
      visible: false,
      passwordType: 'password',
      rePasswordType: 'password',
      textMap: {
        update: '修改密码'
      },
      dialogStatus: '',
      form: {
        oldPassword: undefined,
        password: undefined,
        rePassword: undefined,
        userId: undefined
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 16,
            message: '长度在 5 到 16 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 16,
            message: '长度在 5 到 16 个字符',
            trigger: 'blur'
          }
        ],
        rePassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
    this.getList()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    showRePwd() {
      if (this.rePasswordType === 'password') {
        this.rePasswordType = ''
      } else {
        this.rePasswordType = 'password'
      }
    },
    getList() {
      if (this.$route.query.dialogFormVisible) {
        this.dialogFormVisible = this.$route.query.dialogFormVisible
        this.dialogStatus = 'update'
      }
    },
    // 新增保存
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.form.userId = getUserId()
          updatePassword(this.form).then((response) => {
            this.dialogFormVisible = true
            if (response.data.code === 200) {
              this.$message({
                showClose: true,
                message: '修改密码成功，请重新登录',
                type: 'success'
              })
              // 清空token  返回登录页面
              removeToken()
              this.$router.push({
                path: '/login',
                name: 'Login'
              })
            } else {
              this.$message({
                showClose: true,
                message: response.data.msg,
                type: 'error'
              })
            }
          })
          // }).catch((e) => {
          //   console.log(e)
          //   this.dialogFormVisible = false
          // })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      //  this.$router.push({
      //   path: '/dashboard',
      //   name: 'Dashboard',
      // })
      this.$router.push({ path: '/login' })
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .show-pwd {
    position: absolute;
    right: 50px;
    top: 7px;
    font-size: 16px;
    color: dark_gray;
    cursor: pointer;
    user-select: none;
  }
</style>
