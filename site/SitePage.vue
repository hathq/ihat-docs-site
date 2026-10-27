<script setup lang="ts">
import data from './.generated-documents/content.json'
import documents from './.generated-documents/components.mjs'
import experiences from './experience.json'
import type { ServiceSiteData, ServiceExperiences } from '@nuxtjp/localized-site/service-site'
const siteData = data as ServiceSiteData
const siteExperiences = experiences as ServiceExperiences
</script>
<template>
  <NuxtJpServiceSite :data="siteData" :documents="documents" :experiences="siteExperiences" :downloads="false">
    <template #after-document="{ path, locale }">
      <NuxtContactForm v-if="path === '/contact'" :key="locale" :locale="locale" heading-tag="h2" privacy-url="https://hat-tech.co.jp/privacy" :texts="{ heading: locale === 'ja' ? 'お問い合わせフォーム' : 'Contact form' }" />
    </template>
  </NuxtJpServiceSite>
</template>
