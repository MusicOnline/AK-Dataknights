<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { GeneratedModuleData } from "~/tools/generate-data/operator/module";

const { operator, module } = defineProps<{
  operator: GeneratedOperatorData;
  module: GeneratedModuleData;
}>();

const { t } = useI18n();

const combinedModuleTypeName = $computed(() => {
  if (!module.typeName2) return module.typeName1;
  return `${module.typeName1}-${module.typeName2}`;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Icon and name -->
    <div class="flex gap-2">
      <div
        class="h-12 w-12 bg-gray-800 bg-contain bg-center bg-no-repeat p-1"
        :style="{
          backgroundImage: `url('https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/shining/${module.shiningColor}_shining.png')`,
        }"
      >
        <img
          class="h-full w-full object-contain"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/type/${module.typeIcon}.png`"
        />
      </div>
      <div class="flex flex-col">
        <div class="text-sm font-bold">{{ combinedModuleTypeName }}</div>
        <div>
          {{ t(`${operator.key}.modules.${module.id}.name`) }}
        </div>
      </div>
    </div>
    <table class="mr-auto table-fixed border-hidden" v-if="module.stages">
      <thead>
        <tr>
          <th class="w-8 sm:w-16">Lv.</th>
          <th class="sm:w-28">Stats</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stage in module.stages" :key="stage.stage">
          <td>{{ stage.stage }}</td>
          <td>
            <ul>
              <li v-for="{ key, value } in stage.attributes" :key="key">
                {{ t(`operator.attribute.${String(key)}`) }} +{{ value }}
              </li>
            </ul>
          </td>
          <td class="description">
            <span
              v-if="stage.stage === 1"
              v-html="
                convertRichText(
                  t(
                    `${operator.key}.modules.${module.id}.stages.${stage.stage}.traitUpgrade.description`
                  )
                )
              "
            />
            <template
              v-else
              v-for="upgrade in stage.talentUpgrades"
              :key="upgrade.index"
            >
              <span
                v-html="
                  convertRichText(
                    t(
                      `${operator.key}.modules.${module.id}.stages.${stage.stage}.talentUpgrades.${upgrade.index}.candidates.0.description`
                    )
                  )
                "
              />
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
thead th,
tbody td {
  @apply border-2;
}

thead tr {
  @apply bg-primary-main text-white;
}

tbody td {
  @apply bg-gray-300 px-2;
}

tbody tr td:first-child {
  @apply bg-gray-800 font-bold text-white;
}

.description {
  min-width: 16rem;
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
