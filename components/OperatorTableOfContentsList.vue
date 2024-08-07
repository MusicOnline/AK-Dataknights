<script setup lang="ts">
import type { VerticalNavigationLink } from "@nuxt/ui/dist/runtime/types"
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"

const { operator } = defineProps<{
  operator: GeneratedOperatorData
}>()

const i18n = useI18n()
const { t } = i18n
await useOperatorLocale(i18n, operator.key)

const route = useRoute()

function getModuleAnchorId(module: GeneratedModuleData): string {
  if (!module.typeName2) return `#module-${module.typeName1}`.toLowerCase()
  return `#module-${module.typeName1}-${module.typeName2}`.toLowerCase()
}

function getCombinedModuleTypeName(module: GeneratedModuleData): string {
  let { typeName1: branchCode, typeName2: moduleCode } = module
  switch (moduleCode) {
    case null:
      return branchCode
    case "D":
      moduleCode = "Δ"
      break
  }
  return `${branchCode}-${moduleCode}`
}

function getModuleName(module: GeneratedModuleData): string {
  if (module.type === "INITIAL")
    return t(`operator.module.originalModuleName`, {
      name: t(`${operator.key}.name`),
    })
  return `${getCombinedModuleTypeName(module)}: ${t(
    `${operator.key}.modules.${module.id}.name`,
  )}`
}

const items = computed(() => [
  {
    slot: "operator",
    label: t(`${operator.key}.name`),
    icon: "i-heroicons-list-bullet",
  },
])

const links = computed<VerticalNavigationLink[]>(() => {
  const linksList: any[] = [
    {
      label: t("operator.ui.introduction"),
      to: "#introduction",
      "exact-hash": true,
    },
    {
      label: t("operator.ui.profile"),
      to: "#profile",
      "exact-hash": true,
    },
    {
      label: t("operator.ui.attributes"),
      to: "#stats",
      "exact-hash": true,
    },
    {
      label: t("operator.ui.talents"),
      to: "#talents",
      "exact-hash": true,
    },
  ]
  if (operator.skills.filter((skill) => skill).length)
    linksList.push({
      label: t("operator.ui.skills"),
      destination: "#skills",
      childLinks: operator.skills.flatMap((skill, index) => {
        if (!skill) return []
        return {
          label: t(
            `${operator.key}.skills.${skill.id
              .replace(/\[/g, "<")
              .replace(/\]/g, ">")}.1.name`,
          ),
          to: `#skill-${index + 1}`,
          "exact-hash": true,
        }
      }),
    })

  if (operator.modules?.length)
    linksList.push({
      label: t("operator.ui.modules"),
      destination: "#modules",
      childLinks: operator.modules.map((mod) => ({
        label: getModuleName(mod),
        to: getModuleAnchorId(mod),
        "exact-hash": true,
      })),
    })

  if (operator.riicBaseSkills.length)
    linksList.push({
      label: t("operator.ui.riicBaseSkills"),
      to: "#riic-base-skills",
      "exact-hash": true,
    })

  return linksList
})

const ui = /*ui*/ {
  wrapper: "border-s-2 border-gray-300 dark:border-gray-600 space-y-2",
  base: "block border-s-2 ms-[-2px] lg:leading-6 before:hidden",
  padding: "p-0 ps-4",
  rounded: "",
  font: "font-bold",
  ring: "",
  active: "text-primary-500 dark:text-primary-400 border-current font-bold",
  inactive:
    "border-transparent text-gray-700 hover:border-gray-400 hover:text-gray-900 focus-visible:border-gray-400 focus-visible:text-gray-900 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300 dark:focus-visible:border-gray-500 dark:focus-visible:text-gray-300",
}

const innerUi = /*ui*/ {
  ...ui,
  wrapper: "space-y-2",
  base: "block border-s -mspx lg:leading-6 before:hidden",
  font: "font-normal",
  label: "block",
}
</script>

<template>
  <nav>
    <UAccordion
      :items="items"
      default-open
      multiple
      size="xl"
      variant="solid"
      :ui="{ default: { class: 'font-bold text-left' } }"
    >
      <template #operator>
        <UVerticalNavigation :links="links" :ui="ui">
          <template #default="{ link }">
            <div
              class="text-left"
              :class="{
                'border-primary-500 dark:border-primary-400':
                  route.hash === link.destination,
                'border-transparent': route.hash !== link.destination,
                'ml-[calc(-1rem-2px)] border-l-2 pl-4': link.destination,
              }"
            >
              <div class="mb-1" v-if="link.to">
                {{ link.label }}
              </div>
              <ULink
                class="mb-1 block w-full"
                v-else
                active-class="text-primary-500 dark:text-primary-400"
                :to="link.destination"
                exact-hash
              >
                {{ link.label }}
              </ULink>
              <UVerticalNavigation
                v-if="link.childLinks"
                :ui="innerUi"
                :links="link.childLinks"
                :key="link.destination"
              />
            </div>
          </template>
        </UVerticalNavigation>
      </template>
    </UAccordion>
  </nav>
</template>
