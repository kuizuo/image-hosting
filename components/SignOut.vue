<script setup lang="ts">
import { useMessage } from 'naive-ui'

let show = $ref(false)

const message = useMessage()
const client = useSupabaseClient()

const signOut = async () => {
  show = false
  const { error } = await client.auth.signOut()

  if (error)
    message.error(error.message)

  navigateTo('/')
}
</script>

<template>
  <n-popconfirm v-model:show="show">
    <template #icon>
      <Icon
        name="carbon:warning" size="24"
        class="text-red-600"
      />
    </template>
    <template #action>
      <n-button size="small" @click="signOut">
        Sure
      </n-button>
    </template>
    <template #trigger>
      <Icon
        name="carbon:logout" size="24"
        class="cursor-pointer transition hover:text-red-600"
        @click="show = true"
      />
    </template>
    Are you sure to logout?
  </n-popconfirm>
</template>

