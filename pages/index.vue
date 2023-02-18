<template>
  <div min-h-sm>
    <Logo mb-6 />
    <Suspense>
      <Login />
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
