<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="text-fg-container-1">
    <div class="flex flex-wrap gap-2">
      <div class="flex flex-col gap-1">
        <div
          class="flex items-center gap-1 font-bold text-brand-text md:text-xl"
        >
          <Icon
            class="text-xl text-brand-icon md:text-3xl"
            name="game-icons:tower-fall"
          />
          <span>{{ t("general.siteIndexMetaTitle") }}</span>
        </div>
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
      </div>
      <div
        class="ml-auto flex flex-col items-end gap-1 text-sm md:gap-2 md:text-base"
      >
        <div class="flex items-center gap-1">
          <span>{{ t("ui.madeWithTechnologiesPrefix") }}</span>
          <a class="flex items-center" href="https://nuxt.com/" target="_blank">
            <Icon class="text-lg" name="logos:nuxt-icon" />
          </a>
          <a
            class="flex items-center"
            href="https://vuejs.org/"
            target="_blank"
          >
            <Icon class="text-lg" name="logos:vue" />
          </a>
          <a
            class="flex items-center"
            href="https://tailwindcss.com/"
            target="_blank"
          >
            <Icon class="text-lg" name="logos:tailwindcss-icon" />
          </a>
          <Icon class="text-lg" name="emojione:red-heart" />
        </div>
        <div class="flex items-center gap-1">
          <span>{{ t("ui.viewRepositoryPrefix") }}</span>
          <a
            class="flex items-center"
            href="https://github.com/MusicOnline/AK-Dataknights"
            target="_blank"
          >
            <Icon class="text-lg" name="logos:github-icon" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
