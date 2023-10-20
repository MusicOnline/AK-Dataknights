<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="text-container-1-fg">
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1 font-bold md:text-xl">
          <UIcon
            class="text-xl text-brand-icon md:text-3xl"
            name="i-game-icons-tower-fall"
          />
          <span class="text-brand-text">{{
            t("general.siteIndexMetaTitle")
          }}</span>
        </div>
        <div>
          <ul class="flex gap-2 text-sm underline md:gap-4 md:text-base">
            <li>
              <a
                href="https://github.com/MusicOnline/AK-Dataknights#special-thanks"
                target="_blank"
              >
                {{ t("ui.credits") }}
              </a>
            </li>
          </ul>
          <GitStatus class="text-xs" />
        </div>
      </div>
      <div
        class="ml-auto flex flex-col items-end gap-1 text-sm md:gap-2 md:text-base"
      >
        <div class="flex items-center gap-1">
          <span>{{ t("ui.madeWithTechnologiesPrefix") }}</span>
          <a class="flex items-center" href="https://nuxt.com/" target="_blank">
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-nuxt-icon"
            />
          </a>
          <a
            class="flex items-center"
            href="https://vuejs.org/"
            target="_blank"
          >
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-vue"
            />
          </a>
          <a
            class="flex items-center"
            href="https://tailwindcss.com/"
            target="_blank"
          >
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-tailwindcss-icon"
            />
          </a>
          <UIcon
            class="bg-contain bg-center text-xl md:text-2xl"
            name="i-emojione-red-heart"
          />
        </div>
        <div>
          <a
            class="flex items-center gap-1"
            href="https://github.com/MusicOnline/AK-Dataknights"
            target="_blank"
          >
            <span>{{ t("ui.viewRepositoryPrefix") }}</span>
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-mdi-github"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
