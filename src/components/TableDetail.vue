<template>
  <div class="main-body">
    <el-row :gutter="24">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22"><h3>库表详情</h3></el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <el-row>
      <el-form ref="ruleForm" :model="dbForm" label-width="120px">
        <el-row>
          <el-form-item label="建表语句" prop="temp.createTableSql">
            <el-input type="textarea" v-model="dbForm.temp.createTableSql" :rows="dbForm.temp.createTableSqlRow" readonly:true></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字段详情">
            <el-table ref="multipleTable" :data="dbForm.temp.columns" style="width: 100%"
                      @selection-change="selectTableInfo">
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

    <el-row :gutter="24">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22"><h3>自定义模板</h3></el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>
    <el-row>
      <el-form ref="ruleForm2" :model="genTemplateForm" label-width="120px">
        <el-form-item label="freemarker模板">
          <el-row :gutter="24">
            <el-col :span="18"><el-input type="textarea" v-model="genTemplateForm.freemarkerTemplate" :rows="6"></el-input></el-col>
            <el-col :span="6"></el-col>
          </el-row>

        </el-form-item>
        <el-form-item label="k-v键值对">
          <el-row :gutter="24">
            <el-col :span="6"><el-input v-model="temp.key"></el-input></el-col>
            <el-col :span="6"><el-input v-model="temp.value"></el-input></el-col>
            <el-col :span="6"><el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="addCustomerKey"></el-button></el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-row :gutter="24" v-show="temp.customKeyList.length > 0">
              <el-col :span="12">
                <el-table :data="temp.customKeyList" style="width: 100%">
                  <el-table-column
                    prop="key"
                    label="key">
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="value">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <i class="el-icon-delete" @click="deleteCustomKey(scope.row)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="6"></el-col>
              <el-col :span="6"></el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="genTemplate" size="mini">生成</el-button>
          <el-button @click="resetForm" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "TableDetail",
  data() {
    return {
      genTemplateForm: {
        tableKey: this.$route.query.tableKey,
        freemarkerTemplate: null,
        columnNameList: [],
        customKeyValueMap: null
      },
      temp: {
        key: null,
        value: null,
        customKeyList: []
      },
      dbForm: {
        temp: {
          createTableSqlRow: 20,
          createTableSql: null,
          columns: []
        },
        detail: {
          tableKey: this.$route.query.tableKey
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
      this.temp.key = null;
      this.temp.value = null;
      this.temp.customKeyList = [];
      this.genTemplateForm.customKeyValueMap = null;
      this.genTemplateForm.columnNameList = [];
      this.genTemplateForm.freemarkerTemplate = null;
    },
    selectTableInfo(rows) {
      let columnNameList = [];
      rows.map((item) => {
        columnNameList.push(item.dbName)
      });
      this.genTemplateForm.columnNameList = columnNameList;
    },
    genTemplate() {
      let map = {};
      this.temp.customKeyList.forEach(row => {
        map[row.key] = row.value;
      })
      this.genTemplateForm.customKeyValueMap = map
      if(this.genTemplateForm.columnNameList.length <= 0) {
        const h = this.$createElement;
        this.$notify({
          message: h('i', { style: 'color: red'}, '请选择库表字段')
        });
        return;
      }
      if(this.genTemplateForm.freemarkerTemplate === ""
          || this.genTemplateForm.freemarkerTemplate == null
          || this.genTemplateForm.freemarkerTemplate == undefined) {
        const h = this.$createElement;
        this.$notify({
          message: h('i', { style: 'color: red'}, '请填写模板')
        });
        return;
      }
      this.$axios.post('/generate/template', this.genTemplateForm)
        .then(res => {
          // TODO 展示出模板即可
          console.log(res)
        });
    },
    resetForm() {
      this.init()
    },
    addCustomerKey() {
      if(this.temp.key === "" || this.temp.key == null || this.temp.key == undefined) {
        const h = this.$createElement;
        this.$notify({
          message: h('i', { style: 'color: red'}, '请输入key')
        });
        return;
      }
      if(this.temp.value === "" || this.temp.value == null || this.temp.value == undefined) {
        const h = this.$createElement;
        this.$notify({
          message: h('i', { style: 'color: red'}, '请输入value')
        });
        return;
      }
      let find = this.temp.customKeyList.some(item => item.key === this.temp.key);
      if(find) {
        const h = this.$createElement;
        this.$notify({
          message: h('i', { style: 'color: red'}, '当前key已存在')
        });
        return;
      }
      this.temp.customKeyList.push({
        "key": this.temp.key,
        "value": this.temp.value
      })
      this.temp.key = null;
      this.temp.value = null;
    },
    clearCustomerKeyList() {
      this.temp.customKeyList = []
      this.temp.key = null;
      this.temp.value = null;
    },
    deleteCustomKey(row) {
      this.temp.customKeyList = this.temp.customKeyList.filter(function(item) {
        return item.key !== row.key
      })
    },
    concertPrimaryKey(row, column) {
      return column === true ? '是' : '否';
    },
    concertNullAble(row, column) {
      return column === true ? '允许' : '不允许';
    }
  },

}
</script>

<style scoped>


</style>
