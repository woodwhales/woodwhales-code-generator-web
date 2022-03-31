<template>
  <div class="main-body">
    <el-row>
      <el-form ref="form" :model="dbConfig" label-width="120px">
        <!-- 数据库类型 -->
        <el-row>
          <el-col :span="6">
            <el-form-item label="数据库类型" prop="dbType">
              <el-radio v-model="dbConfig.dbType" label="MYSQL" @change="changeDbType($event)">MYSQL</el-radio>
              <el-radio v-model="dbConfig.dbType" label="ORACLE" @change="changeDbType($event)">Oracle</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="驱动类名" prop="driverClassName">
              <el-input v-model="dbConfig.driverClassName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <!-- 文件配置 -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件配置" prop="dbType">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="生成代码" prop="generateCode">
                    <el-switch v-model="dbConfig.generateCode" active-color="#13ce66"
                               inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="覆盖代码" prop="overCode">
                    <el-switch v-model="dbConfig.overCode" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="覆盖文档" prop="overMarkdown">
                    <el-switch v-model="dbConfig.overMarkdown" active-color="#13ce66"
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
                <el-switch v-model="dbConfig.generateMarkdown" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="controller" prop="generateController">
                <el-switch v-model="dbConfig.generateController" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="service" prop="generateService">
                <el-switch v-model="dbConfig.generateService" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="batchMapper" prop="generateBatchMapper">
                <el-switch v-model="dbConfig.generateBatchMapper" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- 链接配置1 -->
        <el-row>
          <el-form-item label="链接配置">
            <el-row>
              <el-col :span="8">
                <el-form-item label="IP地址" prop="ip">
                  <el-input v-model="dbConfig.ip" placeholder="请输入主机名或IP地址"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="端口" prop="port">
                  <el-input-number v-model="dbConfig.port" :min="1" :max="25535" placeholder="端口号"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="dbConfig.dbType === 'ORACLE'">
                <el-form-item label="SID" prop="sid">
                  <el-input v-model="dbConfig.sid" placeholder="请输入SID"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <!-- 链接配置2 -->
        <el-row>
          <el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="dbConfig.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="密码" prop="password">
                  <el-input v-model="dbConfig.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
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
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style scoped>

</style>
