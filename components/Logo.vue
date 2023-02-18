<script setup>
const colorMode = useColorMode()
</script>

<template>
  <div inline-flex text-2xl font-300 cursor-default>
    <div flex flex-col children:mx-auto>
      <div>
        <Icon
          text="3xl gray4"
          m="x-4 y-auto"
          :name="colorMode.preference === 'dark' ? 'skill-icons:supabase-dark' : 'skill-icons:supabase-light'" size="50"
        />
        <Icon name="carbon:add" text-gray />
        <Icon
          text="3xl gray4"
          m="x-4 y-auto"
          name="vscode-icons:file-type-image"
        />
        <Icon name="carbon:add" text-gray />
        <Icon
          text="3xl gray4"
          m="x-4 y-auto"
          :name="colorMode.preference === 'dark' ? 'skill-icons:nuxtjs-dark' : 'skill-icons:nuxtjs-light'" size="50"
        />
      </div>
    </div>
  </div>
</template>
