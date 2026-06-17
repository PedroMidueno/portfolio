<template>
  <div class="w-full overflow-x-hidden">
    <UContainer class="sm:border-x border-default pt-10 md:pt-0">
      <AppHeader :links="navLinks" />
      <slot />
      <LazyAppFooter hydrate-on-visible />
    </UContainer>
  </div>
</template>
