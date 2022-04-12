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
          <template slot-scope="scope">
            <el-button @click="editConfig(scope.row.configCode)" type="warn" size="mini">编辑</el-button>
            <el-popconfirm title="确认删除？" @confirm="deleteConfig(scope.row.configCode)">
              <el-button type="danger" slot="reference" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
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
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>
