<template>
  <div class="main-body">
    <el-row>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="24">
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
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
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
        dbType: 'MYSQL'
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
