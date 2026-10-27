<script setup lang="ts">
import data from './.generated-documents/content.json'
import documents from './.generated-documents/components.mjs'
import experiences from './experience.json'
import type { ServiceSiteData, ServiceExperiences } from '@nuxtjp/localized-site/service-site'
import InstallCommand from './components/InstallCommand.vue'
const siteData = data as ServiceSiteData
const siteExperiences = experiences as ServiceExperiences
</script>
<template>
  <NuxtJpServiceSite :data="siteData" :documents="documents" :experiences="siteExperiences" :hero-variants="{ '/download': 'install' }" :next-step-exclusions="['/download', '/contact', '/privacy', '/security', '/sitemap']">
    <template #document="{ path, locale, content, Document, local }">
      <InstallCommand v-if="path === '/download'" :locale="locale" :icon="content.icon" :local="local" />
      <component :is="Document" v-else />
    </template>
    <template #after-document="{ path, locale }">
      <NuxtContactForm v-if="path === '/contact'" :key="locale" :locale="locale" heading-tag="h2" privacy-url="https://hat-tech.co.jp/privacy" :texts="{ heading: locale === 'ja' ? 'お問い合わせフォーム' : 'Contact form' }" />
    </template>
  </NuxtJpServiceSite>
</template>
