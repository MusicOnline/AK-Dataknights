<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"

const { operator } = defineProps<{
  operator: GeneratedOperatorData
}>()

const i18n = useI18n()
const { t } = i18n

function getCombinedModuleTypeName(module: GeneratedModuleData): string {
  if (!module.typeName2) return module.typeName1.toLowerCase()
  return `${module.typeName1}-${module.typeName2}`.toLowerCase()
}

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <nav>
    <OCollapse animation="slide">
      <template #trigger="props">
        <button class="flex items-center gap-1">
          <div class="text-left text-xl font-bold">
            {{ t(`${operator.key}.name`) }}
          </div>
          <Icon
            :name="
              props.open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
            "
          />
        </button>
      </template>
      <ul class="list-inside list-disc">
        <li>
          <a class="item-primary-text" href="#introduction">
            {{ t("operator.ui.introduction") }}
          </a>
        </li>
        <li>
          <a class="item-primary-text" href="#stats">
            {{ t("operator.ui.attributes") }}
          </a>
        </li>
        <li>
          <a class="item-primary-text" href="#talents">
            {{ t("operator.ui.talents") }}
          </a>
        </li>
        <li v-if="operator.skills.filter((skill) => skill).length">
          <a class="item-primary-text" href="#skills">{{
            t("operator.ui.skills")
          }}</a>
          <ul class="item-secondary">
            <template v-for="(skill, index) in operator.skills" :key="skill.id">
              <li v-if="skill">
                <a class="item-secondary-text" :href="`#skill-${index + 1}`">
                  {{
                    t(
                      `${operator.key}.skills.${skill.id
                        .replace(/\[/g, "<")
                        .replace(/\]/g, ">")}.1.name`
                    )
                  }}
                </a>
              </li>
            </template>
          </ul>
        </li>
        <li v-if="operator.modules?.length">
          <a class="item-primary-text" href="#modules">
            {{ t("operator.ui.modules") }}
          </a>
          <ul class="item-secondary">
            <li v-for="mod in operator.modules" :key="mod.id">
              <a
                class="item-secondary-text"
                :href="`#module-${getCombinedModuleTypeName(mod)}`"
              >
                {{ t(`${operator.key}.modules.${mod.id}.name`) }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </OCollapse>
  </nav>
</template>

<style scoped lang="scss">
.item-primary-text {
  @apply text-primary-main;
}

.item-primary-text,
.item-secondary-text {
  font-weight: bold;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
}

.item-secondary {
  @apply ml-4;

  list-style-position: inside;
  list-style-type: circle;
}
</style>
