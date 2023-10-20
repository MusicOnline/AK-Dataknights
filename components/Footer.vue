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
              <UButton
                class="p-0"
                color="black"
                variant="link"
                to="https://github.com/MusicOnline/AK-Dataknights#special-thanks"
                target="_blank"
              >
                {{ t("ui.credits") }}
              </UButton>
            </li>
          </ul>
          <GitStatus class="text-xs" />
        </div>
      </div>
      <div class="ml-auto flex flex-col items-end gap-1 text-sm md:gap-2">
        <div class="flex items-center gap-1">
          <span>
            {{ t("ui.madeWithTechnologiesPrefix") }}
          </span>
          <UButton
            class="p-0"
            variant="ghost"
            color="gray"
            icon="i-logos-nuxt-icon"
            to="https://nuxt.com"
            target="_blank"
          />
          <UButton
            class="p-0"
            variant="ghost"
            color="gray"
            icon="i-logos-vue"
            to="https://vuejs.org"
            target="_blank"
          />
          <UButton
            class="p-0"
            variant="ghost"
            color="gray"
            icon="i-logos-tailwindcss-icon"
            to="https://tailwindcss.com"
            target="_blank"
          />
          <!-- TODO: Go to favorite operator page -->
          <UButton
            class="p-0"
            variant="ghost"
            color="gray"
            icon="i-emojione-red-heart"
          />
        </div>
        <div class="flex items-center gap-1">
          <span>
            {{ t("ui.viewRepositoryPrefix") }}
          </span>
          <UButton
            class="p-0"
            variant="ghost"
            color="gray"
            icon="i-mdi-github"
            to="https://github.com/MusicOnline/AK-Dataknights"
            target="_blank"
          />
        </div>
      </div>
    </div>
  </footer>
</template>
