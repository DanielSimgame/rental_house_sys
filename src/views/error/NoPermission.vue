<template>
  <header class="bg-transparent shadow">
    <div
      class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-start items-center"
    >
      <h1 class="error-text text-6xl font-bold leading-tight text-gray-900">
        <p class="text-9xl">403</p>
        <p>无访问权限</p>
        <p>Permission Denied</p>
      </h1>
      <div class="error-func">
        <el-button size="large" @click="$router.back()">返回上一页</el-button>
        <el-button type="primary" size="large" @click="$router.push('/')">返回首页</el-button>
      </div>
    </div>
  </header>
</template>

<style>
.error-text {
  text-align: center;
  font-weight: bold;
  font-style: italic;
}
</style>