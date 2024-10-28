<template>
  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button>
  <template v-for="ss in userDetailFetch.data.value">
    {{ ss }}
  </template>
</template>
<script setup lang="ts">

const useListRequest = useCustomRequest(async () => {
  const res = await $fetch("/api/user/list", {
    params: {
      id: 1
    },
    immediate: false,
  });
  return res;
})

const userDetailFetch = await useFetch("/api/user/detail", {
  params: {
    id: 1
  },
  immediate: false,
});


const userListFetch = await useFetch("/api/user/list", {
  params: {
    id: 1
  },
  immediate: false,
});

onMounted(() => {
  userDetailFetch.refresh();
  // userListFetch.refresh()
  useListRequest.refresh()
});
</script>
