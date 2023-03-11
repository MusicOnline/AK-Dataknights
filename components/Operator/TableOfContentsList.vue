<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { GeneratedModuleData } from "~/tools/generate-data/operator/module";

const { operator } = defineProps<{
  operator: GeneratedOperatorData;
}>();

const { t } = useI18n();

function getCombinedModuleTypeName(module: GeneratedModuleData): string {
  if (!module.typeName2) return module.typeName1.toLowerCase();
  return `${module.typeName1}-${module.typeName2}`.toLowerCase();
}
</script>

<template>
  <nav>
    <OCollapse animation="slide">
      <template #trigger="props">
        <button class="flex items-center gap-1">
          <div class="font-bold">
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
        <li v-if="operator.skills.length">
          <a class="item-primary-text" href="#skills">{{
            t("operator.ui.skills")
          }}</a>
          <ul class="item-secondary">
            <li v-for="(skill, index) in operator.skills" :key="skill.id">
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

.item-secondary-text {
  @apply text-gray-600;
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

  list-style-type: circle;
  list-style-position: inside;
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
