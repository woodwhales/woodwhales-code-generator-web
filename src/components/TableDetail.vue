<template>
  <div class="main-body">
    <el-row>
      <el-form ref="ruleForm" :model="dbForm" label-width="120px" :rules="rules">
        <el-row>
          <el-form-item label="建表语句" prop="temp.createTableSql">
            <el-input type="textarea" v-model="dbForm.temp.createTableSql" :rows="dbForm.temp.createTableSqlRow" readonly:true></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "TableDetail",
  data() {
    return {
      dbForm: {
        temp: {
          createTableSqlRow: 20,
          createTableSql: null
        },
        detail : {
          tableKey : this.$route.query.tableKey
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(this.dbForm);
      this.$axios.post('/api/generate/getTableInfo', this.dbForm.detail)
      .then(res => {
        this.dbForm.temp.createTableSql = res.createTableSql;
        this.dbForm.temp.createTableSqlRow = res.createTableSql.split("\n").length;
        console.log(res);
      });
    }
  },

}
</script>

<style scoped>


</style>
