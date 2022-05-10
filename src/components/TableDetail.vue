<template>
  <div class="main-body">
    <el-row>
      <el-form ref="ruleForm" :model="dbForm" label-width="120px" :rules="rules">
        <el-row>
          <el-form-item label="建表语句" prop="temp.createTableSql">
            <el-input type="textarea" v-model="dbForm.temp.createTableSql" :rows="dbForm.temp.createTableSqlRow" readonly:true></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字段详情">
            <el-table ref="multipleTable" :data="dbForm.temp.columns" style="width: 100%" @selection-change="selectTableInfo">
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="dbName" label="字段名称"></el-table-column>
              <el-table-column prop="name" label="属性名称"></el-table-column>
              <el-table-column prop="dbType" label="字段类型"></el-table-column>
              <el-table-column prop="type" label="属性类型"></el-table-column>
              <el-table-column prop="comment" label="注释"></el-table-column>
              <el-table-column prop="columnSize" label="大小"></el-table-column>
              <el-table-column prop="nullAble" :formatter="concertNullAble" label="允许为NULL"></el-table-column>
              <el-table-column prop="defaultValue" label="默认值"></el-table-column>
              <el-table-column prop="primaryKey" :formatter="concertPrimaryKey" label="是否主键"></el-table-column>
            </el-table>
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
          createTableSql: null,
          columns: []
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
      this.$axios.post('/generate/getTableInfo', this.dbForm.detail)
      .then(res => {
        this.dbForm.temp.createTableSql = res.createTableSql;
        this.dbForm.temp.createTableSqlRow = res.createTableSql.split("\n").length;
        this.dbForm.temp.columns = res.columns;
      });
    },
    concertPrimaryKey(row, column) {
      return column === true  ? '是': '否';
    },
    concertNullAble(row, column) {
      return column === true  ? '允许': '不允许';
    }
  },

}
</script>

<style scoped>


</style>
