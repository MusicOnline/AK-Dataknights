<script setup lang="ts">
const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR
const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY
const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY

const {
  public: { commit },
} = useRuntimeConfig()

const { locale } = useI18n()

const commitUrl = computed(() =>
  commit.baseUrl
    ? new URL(
        commit.id,
        commit.baseUrl + (commit.baseUrl.endsWith("/") ? "" : "/"),
      ).toString()
    : null,
)
const relativeTime = computed(() => {
  const now = Date.now() / 1000 // Date.now() returns in milliseconds
  const diff = now - parseInt(commit.timestamp)

  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" })

  // negative = past
  if (diff < SECONDS_IN_MINUTE) {
    return rtf.format(-Math.round(diff), "second")
  } else if (diff < SECONDS_IN_HOUR) {
    return rtf.format(-Math.round(diff / SECONDS_IN_MINUTE), "minute")
  } else if (diff < SECONDS_IN_DAY) {
    return rtf.format(-Math.round(diff / SECONDS_IN_HOUR), "hour")
  } else if (diff < SECONDS_IN_WEEK) {
    return rtf.format(-Math.round(diff / SECONDS_IN_DAY), "day")
  } else if (diff < SECONDS_IN_MONTH) {
    return rtf.format(-Math.round(diff / SECONDS_IN_WEEK), "week")
  } else if (diff < SECONDS_IN_YEAR) {
    return rtf.format(-Math.round(diff / SECONDS_IN_MONTH), "month")
  } else {
    return rtf.format(-Math.round(diff / SECONDS_IN_YEAR), "year")
  }
})
</script>

<template>
  <div v-if="commit.id">
    <UButton
      class="p-0 flex-wrap"
      color="gray"
      variant="link"
      :to="commitUrl"
      target="_blank"
      :disabled="!Boolean(commitUrl)"
    >
      <span>{{ commit.id }}</span>
      <span>{{ commit.message }}</span>
      <ClientOnly>
        <span>({{ relativeTime }})</span>
      </ClientOnly>
      <UIcon v-if="commitUrl" name="i-heroicons-arrow-top-right-on-square" />
    </UButton>
  </div>
</template>
