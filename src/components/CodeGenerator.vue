<template>
  <div class="main-body">
    <el-row>
      <el-form ref="ruleForm" :model="dbForm" label-width="120px" :rules="rules">
        <!-- 数据库类型 -->
        <el-row>
          <el-form-item label="基础配置" prop="dbType">
            <el-col :span="6">
              <el-form-item label="驱动类型" prop="generateCode">
                <el-radio-group v-model="dbForm.dbConfig.dbType" @change="changeDbType($event)">
                  <el-radio label="MYSQL">MYSQL</el-radio>
                  <el-radio label="ORACLE">Oracle</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="驱动类名" prop="driverClassName">
                <el-input v-model="dbForm.dbConfig.driverClassName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-form-item>
        </el-row>
        <!-- 文件配置 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件配置" prop="dbType">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="生成代码" prop="generateCode">
                    <el-switch v-model="dbForm.dbConfig.generateCode" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="覆盖代码" prop="overCode">
                    <el-switch v-model="dbForm.dbConfig.overCode" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="覆盖文档" prop="overMarkdown">
                    <el-switch v-model="dbForm.dbConfig.overMarkdown" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <!-- 代码配置 -->
        <el-row>
          <el-form-item label="代码配置">
            <el-col :span="4">
              <el-form-item label="markdown" prop="generateMarkdown">
                <el-switch v-model="dbForm.dbConfig.generateMarkdown" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="controller" prop="generateController">
                <el-switch v-model="dbForm.dbConfig.generateController" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="service" prop="generateService">
                <el-switch v-model="dbForm.dbConfig.generateService" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="batchMapper" prop="generateBatchMapper">
                <el-switch v-model="dbForm.dbConfig.generateBatchMapper" active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- 链接配置1 -->
        <el-row>
          <el-form-item label="链接配置">
            <el-row>
              <el-col :span="6">
                <el-form-item label="IP地址" prop="dbConfig.ip">
                  <el-input v-model="dbForm.dbConfig.ip" placeholder="请输入主机名或IP地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="端口" prop="dbConfig.port">
                  <el-input-number v-model="dbForm.dbConfig.port" :min="1" :max="25535"
                                   placeholder="端口号"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dbForm.dbConfig.dbType === 'ORACLE'">
                <el-form-item label="SID" prop="dbConfig.sid">
                  <el-input v-model="dbForm.dbConfig.sid" placeholder="请输入SID"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6"></el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <!-- 链接配置2 -->
        <el-row>
          <el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="用户名" prop="dbConfig.username">
                  <el-input v-model="dbForm.dbConfig.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="密码" prop="dbConfig.password">
                  <el-input v-model="dbForm.dbConfig.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <!-- schema -->
        <el-row v-if="dbForm.system.process === 2 || dbForm.system.process === 3">
          <el-form-item>
            <el-col :span="6">
              <el-form-item label="schema" prop="dbConfig.schema">
                <el-select v-model="dbForm.dbConfig.schema" filterable placeholder="请选择">
                  <el-option v-for="schema in dbForm.temp.schemas" :key="schema" :label="schema" :value="schema">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="库版本号">
                <span v-text="dbForm.temp.dbVersion" style="color: #606266"></span>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-form-item>
        </el-row>
        <!-- 生成代码 -->
        <el-row v-if="dbForm.system.process === 3">
          <el-form-item label="生成配置">
            <el-col :span="6">
              <el-form-item label="项目路径" prop="dbConfig.generateDir">
                <el-input v-model="dbForm.dbConfig.generateDir" placeholder="请指定要生成的项目路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目包名" prop="dbConfig.packageName">
                <el-input v-model="dbForm.dbConfig.packageName" placeholder="请输入要生成的项目包名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="项目作者" prop="dbConfig.author">
                <el-input v-model="dbForm.dbConfig.author" placeholder="请输入项目作者"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"></el-col>
          </el-form-item>
        </el-row>
        <!-- ORM框架 -->
        <el-row v-if="dbForm.system.process === 3">
          <el-form-item>
            <el-col :span="6">
              <el-form-item label="ORM框架" prop="dbConfig.orm">
                  <el-radio v-model="dbForm.dbConfig.orm" label="MyBatis">My Batis</el-radio>
                  <el-radio v-model="dbForm.dbConfig.orm" label="MyBatisPlus">My BatisPlus</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="18"></el-col>
          </el-form-item>
        </el-row>

        <!-- 父类、接口 -->
        <el-row v-if="dbForm.system.process === 3">
          <el-form-item>
            <el-col :span="6">
              <el-form-item label="父类类名">
                <el-input v-model="dbForm.dbConfig.superClass" placeholder="请指定要生成的目录路径"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18"></el-col>
          </el-form-item>
        </el-row>

        <el-row v-if="dbForm.system.process === 3">
          <el-form-item>
            <el-col :span="24">
              <el-form-item label="接口类名">
              <el-tag
                :key="interfaceName"
                v-for="interfaceName in dbForm.dbConfig.interfaceList"
                closable
                :disable-transitions="false"
                @close="handleClose(interfaceName)">
                {{interfaceName}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="dbForm.temp.inputVisible"
                v-model="dbForm.temp.interfaceName"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" @click="showInput">+ 添加</el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-text="dbForm.system.btnTxt"
                       :type="dbForm.system.btnType"></el-button>
            <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CodeGenerator",
  data() {
    return {
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      dbForm: {
        system: {
          btnTxt: '测试',
          btnType: '',
          process: 1
        },
        temp: {
          schemas: [],
          dbVersion: '',
          interfaceName: '',
          inputVisible: false
        },
        dbConfig: {
          dbType: 'MYSQL',
          driverClassName: "com.mysql.cj.jdbc.Driver",
          generateCode: true,
          overCode: true,
          overMarkdown: true,
          generateMarkdown: false,
          generateController: false,
          generateService: false,
          generateBatchMapper: true,
          ip: '127.0.0.1',
          port: '3306',
          sid: 'orcl',
          username: 'root',
          password: 'root1234',
          schema: '',
          generateDir: 'D:\\temp',
          packageName: '111',
          author: '',
          orm: '',
          superClass: '',
          interfaceList: []
        }
      },
      rules: {
        dbConfig: {
          ip: [
            {required: true, message: '请输入 ip', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入 username', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入 password', trigger: 'blur'}
          ],
          schema: [
            {required: true, message: '请选择 schema', trigger: 'blur'}
          ],
          generateDir: [
            {required: true, message: '请输入项目目录', trigger: 'blur'}
          ],
          packageName: [
            {required: true, message: '请输入项目包名', trigger: 'blur'}
          ],
          orm: [
            {required: true, message: '请选择 orm 框架', trigger: 'blur'}
          ]
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.dbForm.dbConfig.dbType = 'MYSQL';
      this.dbForm.dbConfig.driverClassName = "com.mysql.cj.jdbc.Driver";
      this.dbForm.dbConfig.generateCode = true;
      this.dbForm.dbConfig.overCode = true;
      this.dbForm.dbConfig.overMarkdown = true;
      this.dbForm.dbConfig.generateMarkdown = false;
      this.dbForm.dbConfig.generateController = false;
      this.dbForm.dbConfig.generateService = false;
      this.dbForm.dbConfig.generateBatchMapper = true;
      this.dbForm.dbConfig.ip = '127.0.0.1';
      this.dbForm.dbConfig.port = '3306';
      this.dbForm.dbConfig.sid = 'orcl';
      this.dbForm.dbConfig.username = '';
      this.dbForm.dbConfig.password = '';
      this.dbForm.dbConfig.schema = '';
      this.dbForm.dbConfig.generateDir = '';
      this.dbForm.dbConfig.packageName = '';
      this.dbForm.dbConfig.author = null;
      this.dbForm.dbConfig.orm = null;
      this.dbForm.dbConfig.interfaceList = [];
      this.dbForm.dbConfig.superClass = '';
      this.dbForm.system.btnType = '';
      this.dbForm.system.btnTxt = '测试';
    },
    changeDbType($event) {
      if ($event === 'MYSQL') {
        this.dbForm.dbConfig.driverClassName = 'com.mysql.cj.jdbc.Driver';
        this.dbForm.dbConfig.port = '3306';
      }
      if ($event === 'ORACLE') {
        this.dbForm.dbConfig.driverClassName = 'oracle.jdbc.OracleDriver'
        this.dbForm.dbConfig.port = 1521
        this.dbForm.dbConfig.sid = 'orcl'
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dbForm.system.process === 1) {
            this.$axios.post('/generate/buildConnection', this.dbForm.dbConfig)
              .then(res => {
                this.proccess2();
                this.dbForm.temp.schemas = res.schemas;
                this.dbForm.temp.dbVersion = res.dbVersion;
              });
          }

          if (this.dbForm.system.process === 2) {
            this.$axios.post('/generate/buildTableInfos', this.dbForm.dbConfig)
              .then(res => {
                this.proccess3();

              });
          }

          if (this.dbForm.system.process === 3) {
            this.$axios.post('/generate/process', this.dbForm.dbConfig);
          }

        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (this.dbForm.system.process === 1) {
        this.init();
      }

      if (this.dbForm.system.process === 2) {
        this.proccess1();
      }

      if (this.dbForm.system.process === 3) {
        this.proccess2();
      }
    },
    proccess1() {
      this.dbForm.system.process = 1;
      this.dbForm.system.btnType = 'primary';
      this.dbForm.system.btnTxt = '测试';
      this.dbForm.dbConfig.schema = '';
      this.dbForm.temp.dbVersion = '';
    },
    proccess2() {
      this.dbForm.system.process = 2;
      this.dbForm.system.btnType = 'warning';
      this.dbForm.system.btnTxt = '提交';
      this.dbForm.dbConfig.orm = null;
      this.dbForm.dbConfig.interfaceList = [];
    },
    proccess3() {
      this.dbForm.system.process = 3;
      this.dbForm.system.btnType = 'success';
      this.dbForm.system.btnTxt = '生成';
    },
    handleClose(interfaceName) {
      this.dbForm.dbConfig.interfaceList.splice(this.dbForm.dbConfig.interfaceList.indexOf(interfaceName), 1);
    },

    showInput() {
      this.dbForm.temp.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.dbForm.temp.interfaceName;
      if (inputValue) {

        let set = new Set(this.dbForm.dbConfig.interfaceList);
        if(!set.has(inputValue)) {
          this.dbForm.dbConfig.interfaceList.push(inputValue);
        } else {
          this.$message.warning('重复添加接口类名');
        }
      }
      this.dbForm.temp.inputVisible = false;
      this.dbForm.temp.interfaceName = '';
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 180px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
