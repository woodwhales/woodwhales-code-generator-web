<template>
  <div class="main-body">
    <el-row>
      <el-table
        ref="singleTable"
        :data="loadConfigSys.configTableList"
        highlight-current-row>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="configName" label="配置名称"></el-table-column>
        <el-table-column property="configIp" label="ip"></el-table-column>
        <el-table-column property="configPort" label="port"></el-table-column>
        <el-table-column property="configUsername" label="username"></el-table-column>
        <el-table-column property="configSid" label="sid"></el-table-column>
        <el-table-column property="configMemo" label="配置描述"></el-table-column>
        <el-table-column property="gmtModified" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <slot-scope slot-scope="scope">
            <el-button @click="editConfig(scope.row.configCode)" type="warn" size="mini">编辑</el-button>
            <el-popconfirm title="确认删除？" @confirm="deleteConfig(scope.row.configCode)">
              <el-button type="danger" slot="reference" size="mini">删除</el-button>
            </el-popconfirm>
          </slot-scope>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="loadConfigSys.total"
        :page-size="loadConfigSys.pageSize"
        @current-change="handleCurrentChange"
        :hide-on-single-page="true">
      </el-pagination>
    </el-row>

    <!-- 更新配置 -->
    <el-dialog title="更新配置" :visible.sync="dbForm.temp.editConfigFormVisible" @open="saveConfigDialogOpen" center
               width="80%">
      <el-form :model="editConfigForm" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置名称" label-width="80px" prop="configName" required>
              <el-input v-model="editConfigForm.configName" placeholder="请输入配置名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置备注" label-width="80px" prop="configMemo">
              <el-input type="textarea" :rows="3" v-model="editConfigForm.configMemo" placeholder="请输入配置备注"
                        resize="none"></el-input>
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
        <el-button type="primary" @click="updateConfigFun" size="small">更 新</el-button>
        <el-button @click="dbForm.temp.editConfigFormVisible = false" size="small">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Connection",
  data() {
    return {
      loadConfigSys: {
        total: null,
        currentPage: 1,
        pageSize: 5,
        configTableList: []
      },
      dbForm: {
        temp: {
          editConfigFormVisible: false
        }
      },
      editConfigForm: {
        configCode: null,
        configName: null,
        configMemo: null,
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
      }
    }
  },
  methods: {
    init() {
      this.$axios.get('/api/databaseConfig/page', {
        params: {
          page: this.loadConfigSys.currentPage,
          limit: this.loadConfigSys.pageSize
        }
      }).then(res => {
        this.loadConfigSys.total = res.count;
        this.loadConfigSys.configTableList = res.list;
      });
    },
    handleCurrentChange(current) {
      this.loadConfigSys.currentPage = current;
      this.queryConfig();
    },
    queryConfig() {
      this.$axios.get('/api/databaseConfig/page', {
        params: {
          page: this.loadConfigSys.currentPage,
          limit: this.loadConfigSys.pageSize
        }
      }).then(res => {
        this.loadConfigSys.total = res.count;
        this.loadConfigSys.configTableList = res.list;
      });
    },
    deleteConfig(configCode) {
      this.$axios.post('/api/databaseConfig/delete', {configCode: configCode})
        .then(res => {
          let totalPage = Math.ceil((this.loadConfigSys.total - 1) / this.loadConfigSys.pageSize);
          let currentPage = this.loadConfigSys.currentPage > totalPage ? totalPage : this.loadConfigSys.currentPage;
          this.loadConfigSys.currentPage = currentPage < 1 ? 1 : currentPage;
          this.queryConfig();
        });
    },
    editConfig(configCode) {
      this.$axios.post('/api/databaseConfig/get', {configCode: configCode})
        .then(res => {
          this.editConfigForm.configCode = res.configCode;
          this.editConfigForm.configName = res.configName;
          this.editConfigForm.configMemo = res.configMemo;
          this.editConfigForm.baseDbConfig.ip = res.configIp;
          this.editConfigForm.baseDbConfig.port = res.configPort;
          this.editConfigForm.baseDbConfig.username = res.configUsername;
          this.editConfigForm.baseDbConfig.password = res.configPassword;
          this.editConfigForm.baseDbConfig.sid = res.configSid;
          this.editConfigForm.baseDbConfig.dbType = res.databaseType;
          this.editConfigForm.baseDbConfig.driverClassName = res.databaseDriverClassName;
          this.dbForm.temp.editConfigFormVisible = true;
        });
    },
    updateConfigFun() {
      this.$axios.post('/api/databaseConfig/update', this.editConfigForm)
        .then(res => {
          this.dbForm.temp.editConfigFormVisible = false;
          this.dbForm.temp.loadConfigFormVisible = true;
          this.queryConfig();
        });
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>
