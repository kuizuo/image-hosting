<script setup lang="ts">
const user = useSupabaseUser()
const { auth } = useSupabaseAuthClient()

watchEffect(() => {
  if (user.value)
    navigateTo('/images')
})
</script>

<template>
  <div class="flex flex-col justify-center">
    <h2 class="my-6 text-center text-3xl font-extrabold u-text-white">
      Sign in to your account
    </h2>
    <div>
      <NButton ba @click="auth.signInWithOAuth({ provider: 'github' })">
        <span mr-1 i-ri-github-line label="Github" />
        Login with GitHub
      </NButton>
    </div>
  </div>
</template>
