<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { GeneratedSkillData } from "~~/tools/generate-data/operator/skill";

const { operator } = defineProps<{
  operator: GeneratedOperatorData;
  skill: GeneratedSkillData;
}>();

const { t, locale } = useI18n();
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li v-for="level in skill.levels" :key="level.level">
      <div class="font-bold">
        {{
          t(
            `${operator.key}.skills.${skill.id
              .replace(/\[/g, "<")
              .replace(/\]/g, ">")}.${level.level}.name`
          )
        }}
        Lv. {{ level.level }}
      </div>
      <div class="flex gap-x-2 gap-y-1 text-sm text-white">
        <div class="bg-primary-main px-1">
          {{ t(`operator.skill.skillType.${level.skillType}`) }}
        </div>
        <template v-if="level.skillType !== 'PASSIVE'">
          <div class="bg-primary-main px-1">
            {{ t(`operator.skill.spType.${level.spData.spType}`) }}
          </div>
          <div class="bg-primary-main px-1">
            {{ level.spData.spCost }} SP Cost
          </div>
          <div class="bg-primary-main px-1" v-if="level.spData.initSp">
            {{ level.spData.initSp }} Init SP
          </div>
        </template>
        <div class="bg-primary-main px-1" v-if="level.duration > 0">
          {{
            level.duration.toLocaleString(locale, {
              style: "unit",
              unit: "second",
            })
          }}
        </div>
      </div>
      <div
        v-html="
          convertRichText(
            t(
              `${operator.key}.skills.${skill.id
                .replace(/\[/g, '<')
                .replace(/\]/g, '>')}.${level.level}.description`
            ),
            { replace: level.variables }
          )
        "
      />
    </li>
  </ul>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
