<template>
  <el-container>
    <el-header>
      <el-link href="/index" :underline="false" style="font-size: larger">woodwhales-code-generator</el-link>
    </el-header>
    <el-main>
      <el-menu mode="horizontal" :default-active="$route.path" router>
        <el-menu-item index="/codeGenerator">代码生成</el-menu-item>
        <el-menu-item index="/connection">链接管理</el-menu-item>
      </el-menu>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {}
  }
}
</script>

<style>
.el-header, .el-footer {
  background-color: #fff;
  color: #000;
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  min-height: 100%;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
