<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FileObject } from '@supabase/storage-js'
import type { Database } from '~~/types/database.types'

definePageMeta({
  middleware: 'auth',
})

const client = useSupabaseClient<Database>()
const user = $(useSupabaseUser())

const message = useMessage()
let loading = $ref(false)
const { copied, copy } = useClipboard()
const bucket = $ref<'public' | 'images'>('public')

// let viewType = $ref<'list' | 'grid'>('grid')

const { data: publicImages, refresh } = await useAsyncData('publicImages', async () => {
  const { data } = await client.storage
    .from(bucket)
    .list(undefined, {
      sortBy: { column: 'created_at', order: 'desc' },
    })

  return data
})

const images = $computed(() => publicImages.value?.filter(i => i.metadata))

async function copyUrl(url: string) {
  await copy(url)
  copied.value && message.success('Copied')
}

// function swtichViewType() {
//   viewType = viewType === 'list' ? 'grid' : 'list'
// }

function getFileIcon(file: FileObject) {
  if (file.metadata.mimetype.startsWith('image/'))
    return 'carbon:image'

  return 'carbon:document-unknown'
}

function getPublicUrl(file: FileObject) {
  return client.storage.from(bucket).getPublicUrl(file.name).data.publicUrl
}

async function upload(e: Event) {
  const file = (e.target as HTMLInputElement)!.files?.[0]
  if (!file)
    return

  loading = true

  try {
    const { data, error } = await client.storage
      .from(bucket)
      .upload(`${Date.now()}-${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      })
    loading = false

    if (error)
      message.error(error.message)

    await refresh()
    message.success('Image uploaded')
  }
  catch (error) {
    message.error((error as any).message)
  }
  finally {
    loading = false
  }
}

async function download(file: FileObject) {
  const { data, error } = await client.storage
    .from(bucket)
    .download(file.name)

  if (!data)
    return

  const url = URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  message.success('Image downloaded')
}

async function remove(file: FileObject) {
  const { data, error } = await client.storage
    .from(bucket)
    .remove([file.name])

  if (error) {
    message.error(error.message)

    return
  }

  if (data.length === 0) {
    message.error('Image delete failed')
    return
  }

  publicImages.value = publicImages.value?.filter(i => i.name !== file.name)
  message.success('Image removed')
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <div class="flex-1 inline-flex justify-center items-center gap-2">
        <h2 font-montserrat font-blod text-2xl>
          Image List
        </h2>
        <label for="file-input" class="upload-button">
          <Icon name="icon-park-outline:inbox-upload-r" size="24" color="#31ac73" class="cursor-pointer" />
        </label>
        <input id="file-input" type="file" class="hidden" @change="upload">
      </div>

      <div class="inline-flex items-center gap-2 self-end">
        <SignOut />

      <!-- <Icon :name="viewType === 'list' ? 'carbon:list-boxes' : 'carbon:grid' " size="24" @click="swtichViewType()" /> -->
      </div>
    </div>
    <ClientOnly>
      <template #fallback>
        <div class="op50 italic">
          <span animate-pulse>Loading...</span>
        </div>
      </template>
      <TransitionGroup v-if="images?.length > 0" tag="ul" name="list" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
        <li
          v-for="image in images"
          :key="image.id"
          class="relative group border border-gray-200 dark:border-gray-800 transition duration-500 rounded-md shadow-sm hover:shadow-md cursor-pointer"
        >
          <Icon name="carbon:close-filled" size="24" class="absolute -top-[12px] -right-[12px] transition text-red-500 opacity-0 group-hover:opacity-100" @click="remove(image)" />

          <n-image
            class="w-full h-[150px] overflow-hidden object-cover"
            object-fit="cover"
            :src="getPublicUrl(image)"
          />
          <div class="p-2 flex items-center">
            <Icon :name="getFileIcon(image)" class="text-gray-500" size="24" />
            <span class="flex-1 ml-2 truncate" @click="copyUrl(getPublicUrl(image))"> {{ image.name }} </span>
            <Icon name="carbon:save-image" size="24" class="items-end text-left transition text-gray-500 opacity-0 group-hover:opacity-100" @click="download(image)" />
          </div>
        </li>
      </TransitionGroup>

      <div v-else>
        <div class="mt-4 text-center">
          <Icon name="carbon:no-image" size="48" class="text-gray-500" />
          <div class="text-gray-500">
            No images
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.n-image > img {
  @apply w-full h-full object-cover;
}
</style>
