<template>
  <div class="main-body">
    <el-row>
      <el-form ref="ruleForm" :model="dbForm" label-width="120px" :rules="rules">
        <!-- 驱动配置 -->
        <el-row>
          <el-form-item label="驱动配置" prop="dbType">
            <el-col :span="12">
              <el-form-item label="驱动类型" prop="generateCode">
                <el-radio-group v-model="dbForm.dbConfig.dbType" @change="changeDbType($event)"
                                :disabled="dbForm.system.process !== 1">
                  <el-radio label="MYSQL" border>MYSQL</el-radio>
                  <el-radio label="ORACLE" border>Oracle</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="false">
              <el-form-item label="驱动类名" prop="driverClassName">
                <el-input v-model="dbForm.dbConfig.driverClassName" :disabled="true"></el-input>
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
                  <el-input v-model="dbForm.dbConfig.ip" placeholder="请输入主机名或IP地址"
                            :disabled="dbForm.system.process !== 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="端口号" prop="dbConfig.port">
                  <el-input-number v-model="dbForm.dbConfig.port" :min="1" :max="25535"
                                   placeholder="端口号" :disabled="dbForm.system.process !== 1"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dbForm.dbConfig.dbType === 'ORACLE'">
                <el-form-item label="SID" prop="dbConfig.sid">
                  <el-input v-model="dbForm.dbConfig.sid" placeholder="请输入SID"
                            :disabled="dbForm.system.process !== 1"></el-input>
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
                  <el-input v-model="dbForm.dbConfig.username" placeholder="请输入用户名"
                            :disabled="dbForm.system.process !== 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="密码" prop="dbConfig.password">
                  <el-input v-model="dbForm.dbConfig.password" type="password" placeholder="请输入密码"
                            :disabled="dbForm.system.process !== 1"></el-input>
                  <el-button type="success" @click="dbForm.temp.saveConfigFormVisible = true" size="mini" plain
                             v-if="dbForm.system.process !== 1">保存配置
                  </el-button>
                  <el-button type="info" @click="dbForm.temp.loadConfigFormVisible = true" size="mini" plain
                             v-if="dbForm.system.process === 1">加载配置
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <!-- schema -->
        <el-row v-if="dbForm.system.process === 2 || dbForm.system.process === 3">
          <el-form-item>
            <el-col :span="6">
              <el-form-item label="schema" prop="dbConfig.schema">
                <el-select v-model="dbForm.dbConfig.schema" filterable placeholder="请选择"
                           :disabled="dbForm.system.process === 3">
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
            <el-col :span="12">
              <el-form-item label="ORM框架" prop="dbConfig.orm">
                <el-radio-group v-model="dbForm.dbConfig.orm" @change="changeOrm($event)">
                  <el-radio label="MyBatis" border>My Batis</el-radio>
                  <el-radio label="MyBatisPlus" border>My BatisPlus</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12"></el-col>
          </el-form-item>
        </el-row>
        <!-- 文件配置 -->
        <el-row v-if="dbForm.system.process === 3">
          <el-form-item label="文件配置" prop="dbType">
            <el-row>
              <el-col :span="4">
                <el-form-item label="生成代码" prop="generateCode">
                  <el-switch v-model="dbForm.dbConfig.generateCode" active-color="#13ce66"
                             inactive-color="#ff4949"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="覆盖代码" prop="overCode">
                  <el-switch v-model="dbForm.dbConfig.overCode" active-color="#13ce66"
                             inactive-color="#ff4949"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="覆盖文档" prop="overMarkdown">
                  <el-switch v-model="dbForm.dbConfig.overMarkdown" active-color="#13ce66"
                             inactive-color="#ff4949"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <!-- 代码配置 -->
        <el-row v-if="dbForm.system.process === 3">
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
              <el-form-item label="batchMapper" prop="generateBatchMapper"
                            v-show="dbForm.dbConfig.orm === 'MyBatisPlus'">
                <el-switch v-model="dbForm.dbConfig.generateBatchMapper" active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
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
                  {{ interfaceName }}
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

        <el-row v-if="dbForm.system.process === 3">
          <el-col :span="24">
            <el-form-item label="数据库表">
              <el-table ref="multipleTable" :data="dbForm.temp.tableInfoList" style="width: 100%"
                        @selection-change="selectTableInfo">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="dbName" label="表名"></el-table-column>
                <el-table-column prop="name" label="类名"></el-table-column>
                <el-table-column prop="comment" label="注释"></el-table-column>
                <el-table-column prop="keys" label="主键">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.keys.join(',') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button @click="showDetailTable(scope.row.tableKey)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-text="dbForm.system.btnTxt"
                       :type="dbForm.system.btnType"
                       :disabled="dbForm.system.process === 3 && dbForm.temp.tableInfoList.length === 0"></el-button>
            <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>

    <!-- 保存配置 -->
    <el-dialog title="保存配置" :visible.sync="dbForm.temp.saveConfigFormVisible" @open="saveConfigDialogOpen" center width="80%">
      <el-form :model="saveConfigForm" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置名称" label-width="80px" prop="dbConfigName" required>
              <el-input v-model="saveConfigForm.dbConfigName" placeholder="请输入配置名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置备注" label-width="80px" prop="dbConfigName">
              <el-input type="textarea" :rows="3" v-model="saveConfigForm.dbConfigMemo" placeholder="请输入配置备注" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="驱动类型" prop="baseDbConfig.dbType" label-width="80px" required>
              <el-input v-model="saveConfigForm.baseDbConfig.dbType" placeholder="请输入驱动类型" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驱动类名" prop="baseDbConfig.driverClassName" label-width="80px" v-show="false">
              <el-input v-model="saveConfigForm.baseDbConfig.driverClassName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="IP地址" prop="baseDbConfig.ip" label-width="80px" required>
              <el-input v-model="saveConfigForm.baseDbConfig.ip" placeholder="请输入主机名或IP地址" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口号" prop="baseDbConfig.port" label-width="80px" required>
              <el-input v-model="saveConfigForm.baseDbConfig.port" :min="1" :max="25535" placeholder="端口号"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SID" prop="baseDbConfig.sid" label-width="80px"
                          v-if="saveConfigForm.baseDbConfig.dbType === 'ORACLE'" required>
              <el-input v-model="saveConfigForm.baseDbConfig.sid" placeholder="请输入SID" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" prop="baseDbConfig.username" label-width="80px" required>
              <el-input v-model="saveConfigForm.baseDbConfig.username" placeholder="请输入用户名" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="baseDbConfig.password" label-width="80px" required>
              <el-input v-model="saveConfigForm.baseDbConfig.password" type="password" placeholder="请输入密码"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConfigFun" size="small">保 存</el-button>
        <el-button @click="dbForm.temp.saveConfigFormVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 更新配置 -->
    <el-dialog title="更新配置" :visible.sync="dbForm.temp.editConfigFormVisible" @open="saveConfigDialogOpen" center width="80%">
      <el-form :model="editConfigForm" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置名称" label-width="80px" prop="dbConfigName" required>
              <el-input v-model="editConfigForm.dbConfigName" placeholder="请输入配置名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置备注" label-width="80px" prop="dbConfigName">
              <el-input type="textarea" :rows="3" v-model="editConfigForm.dbConfigMemo" placeholder="请输入配置备注" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="驱动类型" prop="baseDbConfig.dbType" label-width="80px" required>
              <el-input v-model="editConfigForm.baseDbConfig.dbType" placeholder="请输入驱动类型" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="驱动类名" prop="baseDbConfig.driverClassName" label-width="80px" v-show="false">
              <el-input v-model="editConfigForm.baseDbConfig.driverClassName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="IP地址" prop="baseDbConfig.ip" label-width="80px" required>
              <el-input v-model="editConfigForm.baseDbConfig.ip" placeholder="请输入主机名或IP地址" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口号" prop="baseDbConfig.port" label-width="80px" required>
              <el-input v-model="editConfigForm.baseDbConfig.port" :min="1" :max="25535" placeholder="端口号"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SID" prop="baseDbConfig.sid" label-width="80px"
                          v-if="editConfigForm.baseDbConfig.dbType === 'ORACLE'" required>
              <el-input v-model="editConfigForm.baseDbConfig.sid" placeholder="请输入SID" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户名" prop="baseDbConfig.username" label-width="80px" required>
              <el-input v-model="editConfigForm.baseDbConfig.username" placeholder="请输入用户名" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="baseDbConfig.password" label-width="80px" required>
              <el-input v-model="editConfigForm.baseDbConfig.password" type="password" placeholder="请输入密码"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small">更 新</el-button>
        <el-button @click="dbForm.temp.editConfigFormVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 加载配置 -->
    <el-dialog title="加载配置" :visible.sync="dbForm.temp.loadConfigFormVisible" @open="loadConfigDialogOpen" center width="80%">
      <el-table
        ref="singleTable"
        :data="loadConfig.configTableList"
        highlight-current-row
        @current-change="selectLoadConfig">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="configName" label="配置名称"></el-table-column>
        <el-table-column property="configIp" label="ip"></el-table-column>
        <el-table-column property="configPort" label="port"></el-table-column>
        <el-table-column property="configUsername" label="username"></el-table-column>
        <el-table-column property="configSid" label="sid"></el-table-column>
        <el-table-column property="configMemo" label="配置描述"></el-table-column>
        <el-table-column property="gmtModified" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editConfig(scope.row.configCode)" type="warn" size="mini">编辑</el-button>
            <el-button @click="deleteConfig(scope.row.configCode)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loadConfigFun" size="small">加 载</el-button>
        <el-button @click="dbForm.temp.loadConfigFormVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CodeGenerator",
  data() {
    return {
      loadConfig: {
        configTableList: [],
        configCode: '',
        driverClassName: '',
        databaseType: '',
        ip: '',
        port: null,
        username: '',
        password: '',
        sid: ''
      },
      saveConfigForm: {
        dbConfigName: null,
        dbConfigMemo: null,
        baseDbConfig: {
          dbType: null,
          driverClassName: null,
          ip: null,
          port: null,
          sid: null,
          username: null,
          password: null
        },
        extraFileDbConfig: {
          generateCode: false,
          overCode: false,
          overMarkdown: false,
          generateMarkdown: false
        },
        extraCodeDbConfig: {
          generateController: false,
          generateService: false,
          generateBatchMapper: false
        }
      },
      editConfigForm: {
        configCode: null,
        dbConfigName: null,
        dbConfigMemo: null,
        baseDbConfig: {
          dbType: null,
          driverClassName: null,
          ip: null,
          port: null,
          sid: null,
          username: null,
          password: null
        },
        extraFileDbConfig: {
          generateCode: false,
          overCode: false,
          overMarkdown: false,
          generateMarkdown: false
        },
        extraCodeDbConfig: {
          generateController: false,
          generateService: false,
          generateBatchMapper: false
        }
      },
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
          inputVisible: false,
          tableInfoList: [],
          saveConfigFormVisible: false,
          loadConfigFormVisible: false,
          editConfigFormVisible: false
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
          generateBatchMapper: false,
          ip: '127.0.0.1',
          port: '3306',
          sid: null,
          username: null,
          password: null,
          schema: null,
          generateDir: null,
          packageName: null,
          author: '',
          orm: null,
          superClass: '',
          interfaceList: [],
          dbNameList: [],
          tableKey: null,
          selectAll: false
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
  methods: {
    resetToProcess1() {
      this.dbForm.dbConfig.dbType = 'MYSQL';
      this.dbForm.dbConfig.driverClassName = "com.mysql.cj.jdbc.Driver";
      this.dbForm.dbConfig.ip = '127.0.0.1';
      this.dbForm.dbConfig.port = '3306';
      this.dbForm.dbConfig.sid = null;
      this.dbForm.dbConfig.username = '';
      this.dbForm.dbConfig.password = '';
      this.dbForm.temp.schemas = [];
      this.proccess1();
    },
    resetToProcess2() {
      this.dbForm.dbConfig.schema = null;
      this.dbForm.temp.dbVersion = null;
      this.proccess1();
    },
    resetToProcess3() {
      this.dbForm.dbConfig.generateDir = '';
      this.dbForm.dbConfig.packageName = '';
      this.dbForm.dbConfig.author = null;
      this.dbForm.dbConfig.orm = null;
      this.dbForm.dbConfig.generateCode = true;
      this.dbForm.dbConfig.overCode = true;
      this.dbForm.dbConfig.overMarkdown = true;
      this.dbForm.dbConfig.generateMarkdown = false;
      this.dbForm.dbConfig.generateController = false;
      this.dbForm.dbConfig.generateService = false;
      this.dbForm.dbConfig.generateBatchMapper = true;
      this.dbForm.dbConfig.interfaceList = [];
      this.dbForm.dbConfig.superClass = '';
      this.dbForm.dbConfig.dbNameList = [];
      this.dbForm.dbConfig.tableKey = '';
      this.dbForm.temp.interfaceName = null;
      this.dbForm.temp.inputVisible = false;
      this.dbForm.temp.tableInfoList = [];
      this.proccess2();
    },
    changeDbType($event) {
      if ($event === 'MYSQL') {
        this.dbForm.dbConfig.driverClassName = 'com.mysql.cj.jdbc.Driver';
        this.dbForm.dbConfig.port = '3306';
        this.dbForm.dbConfig.sid = null;
      }
      if ($event === 'ORACLE') {
        this.dbForm.dbConfig.driverClassName = 'oracle.jdbc.OracleDriver'
        this.dbForm.dbConfig.port = 1521;
        this.dbForm.dbConfig.sid = 'orcl';
      }
    },
    changeOrm($event) {
      if ($event === 'MyBatis') {
        this.dbForm.dbConfig.generateBatchMapper = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dbForm.system.process === 1) {
            this.$axios.post('/api/generate/buildConnection', this.dbForm.dbConfig)
              .then(res => {
                this.proccess2();
                this.dbForm.temp.schemas = res.schemas;
                this.dbForm.temp.dbVersion = res.dbVersion;
              });
          }

          if (this.dbForm.system.process === 2) {
            this.$axios.post('/api/generate/buildTableInfos', this.dbForm.dbConfig)
              .then(res => {
                this.proccess3();
                this.dbForm.dbConfig.interfaceList = [];
                this.dbForm.temp.tableInfoList = res.tableInfos;
                this.dbForm.dbConfig.tableKey = res.dataBaseInfoKey;
              });
          }

          if (this.dbForm.system.process === 3) {
            this.$axios.post('/api/generate/process', this.dbForm.dbConfig)
              .then(res => {
              });
          }

        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (this.dbForm.system.process === 1) {
        this.resetToProcess1();
      }

      if (this.dbForm.system.process === 2) {
        this.resetToProcess2();
      }

      if (this.dbForm.system.process === 3) {
        this.resetToProcess3();
      }

      if (this.dbForm.system.process === 4) {
        this.resetToProcess2();
      }
    },
    proccess1() {
      this.dbForm.system.process = 1;
      this.dbForm.system.btnType = 'primary';
      this.dbForm.system.btnTxt = '测试';

    },
    proccess2() {
      this.dbForm.system.process = 2;
      this.dbForm.system.btnType = 'warning';
      this.dbForm.system.btnTxt = '提交';
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
      if (inputValue !== '') {
        let set = new Set(this.dbForm.dbConfig.interfaceList);
        if (!set.has(inputValue)) {
          this.dbForm.dbConfig.interfaceList.push(inputValue);
        } else {
          this.$message.warning('重复添加接口类名');
        }
      }
      this.dbForm.temp.inputVisible = false;
      this.dbForm.temp.interfaceName = '';
    },
    selectTableInfo: function (val) {
      let dbNameList = [];

      val.map((item) => {
        dbNameList.push(item.dbName)
      });

      if (val.length > 0 && val.length === this.dbForm.temp.tableInfoList.length) {
        this.dbForm.dbConfig.selectAll = true
      }

      this.dbForm.dbConfig.dbNameList = dbNameList;
    },
    showDetailTable(tableKey) {
      this.$router.push({
        path: '/tableDetail',
        query: {
          tableKey: tableKey
        }
      })
    },
    saveConfigDialogOpen() {
      this.saveConfigForm.dbConfigName = this.dbForm.dbConfig.dbType + "_" + this.dbForm.dbConfig.ip + "_" + this.dbForm.dbConfig.port;
      this.saveConfigForm.baseDbConfig.ip = this.dbForm.dbConfig.ip;
      this.saveConfigForm.baseDbConfig.port = this.dbForm.dbConfig.port;
      this.saveConfigForm.baseDbConfig.username = this.dbForm.dbConfig.username;
      this.saveConfigForm.baseDbConfig.password = this.dbForm.dbConfig.password;
      this.saveConfigForm.baseDbConfig.sid = this.dbForm.dbConfig.sid;
      this.saveConfigForm.baseDbConfig.dbType = this.dbForm.dbConfig.dbType;
      this.saveConfigForm.baseDbConfig.driverClassName = this.dbForm.dbConfig.driverClassName;
    },
    saveConfigFun() {
      this.$axios.post('/api/databaseConfig/create', this.saveConfigForm)
        .then(res => {
          this.dbForm.temp.saveConfigFormVisible = false;
        });
    },
    loadConfigDialogOpen() {
      this.initLoadConfig();
      this.$axios.get('/api/databaseConfig/page?page=1&limit=10')
        .then(res => {
          this.loadConfig.configTableList = res;
        });
    },
    selectLoadConfig(row) {
      if(row) {
        this.loadConfig.configCode = row.configCode;
        this.loadConfig.driverClassName = row.databaseDriverClassName;
        this.loadConfig.databaseType = row.databaseType;
        this.loadConfig.ip = row.configIp;
        this.loadConfig.port = row.configPort;
        this.loadConfig.username = row.configUsername;
        this.loadConfig.password = row.configPassword;
        this.loadConfig.sid = row.configSid;
      }
    },
    loadConfigFun() {
      this.dbForm.dbConfig.databaseType = this.loadConfig.databaseType;
      this.dbForm.dbConfig.ip = this.loadConfig.ip;
      this.dbForm.dbConfig.port = this.loadConfig.port;
      this.dbForm.dbConfig.username = this.loadConfig.username;
      this.dbForm.dbConfig.password = this.loadConfig.password;
      this.dbForm.dbConfig.sid = this.loadConfig.sid;
      this.initLoadConfig();
      this.dbForm.temp.loadConfigFormVisible = false;
    },
    initLoadConfig() {
      this.loadConfig.configTableList = [];
      this.loadConfig.configCode = null;
      this.loadConfig.driverClassName = null;
      this.loadConfig.databaseType = null;
      this.loadConfig.ip = null;
      this.loadConfig.port = null;
      this.loadConfig.username = null;
      this.loadConfig.password = null;
      this.loadConfig.sid = null;
    },
    deleteConfig(configCode) {
      this.$axios.post('/api/databaseConfig/delete', { configCode: configCode })
        .then(res => {
        });
      this.loadConfigDialogOpen();
    },
    editConfig(configCode) {
      this.$axios.post('/api/databaseConfig/get', { configCode: configCode })
        .then(res => {
          this.editConfigForm.configCode = res.configCode;
          this.editConfigForm.dbConfigName = res.configName;
          this.editConfigForm.configMemo = res.configMemo;
          this.editConfigForm.baseDbConfig.ip = res.configIp;
          this.editConfigForm.baseDbConfig.port = res.configPort;
          this.editConfigForm.baseDbConfig.username = res.configUsername;
          this.editConfigForm.baseDbConfig.password = res.configPassword;
          this.editConfigForm.baseDbConfig.sid = res.configSid;
          this.editConfigForm.baseDbConfig.dbType = res.databaseType;
          this.editConfigForm.baseDbConfig.driverClassName = res.databaseDriverClassName;
        });
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
