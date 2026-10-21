<script setup lang="ts">
import { ref } from 'vue'
import { installationCommand, release } from '../installer.mts'
import type { Locale } from '../types'
defineProps<{ locale: Locale; icon: string; local: (path: string) => string }>()
const command = installationCommand()
const state = ref<'idle' | 'copied' | 'manual'>('idle')
async function copy() {
  try { await navigator.clipboard.writeText(command); state.value = 'copied' }
  catch { state.value = 'manual' }
}
</script>
<template>
  <section class="install-card" :aria-label="locale === 'ja' ? 'Hatterのインストール' : 'Install Hatter'">
    <img :src="icon" alt="" width="72" height="72" />
    <p class="install-channel">{{ locale === 'ja' ? '安定版' : 'Stable release' }}</p>
    <h2>Hatter <span>v{{ release.version }}</span></h2>
    <p>{{ release.platform }}</p>
    <p class="install-requirement">{{ locale === 'ja' ? '事前にNode 22.23.4以降または24.22.1以降が必要です。Ubuntu 24.04で検証済み。' : 'Requires an existing Node 22.23.4+ or 24.22.1+. Tested on Ubuntu 24.04.' }}</p>
    <div class="install-terminal">
      <div class="install-terminal-bar"><span aria-hidden="true">$</span><span>Terminal · Bash</span><button type="button" @click="copy">{{ locale === 'ja' ? 'コマンドをコピー' : 'Copy command' }}</button></div>
      <pre tabindex="0" :aria-label="locale === 'ja' ? 'インストールコマンド' : 'Installation command'"><code>{{ command }}</code></pre>
    </div>
    <p class="install-feedback" role="status" aria-live="polite">{{ state === 'copied' ? (locale === 'ja' ? 'コピーしました。端末に貼り付けて実行してください。' : 'Copied. Paste into your terminal to run.') : state === 'manual' ? (locale === 'ja' ? 'コピーできませんでした。上のコマンドを選択してコピーしてください。' : 'Select and copy the command above manually.') : (locale === 'ja' ? 'コピーだけでは実行されません。実行後に配置先を確認して「install」と入力します。' : 'Copying does not execute it. Review the locations and type “install” when prompted.') }}</p>
    <p>{{ locale === 'ja' ? '管理者権限は不要です。既存データや保存キー、シェル設定は変更しません。' : 'No administrator privileges. Existing data, saved credentials and shell settings are preserved.' }}</p>
    <nav class="install-help" :aria-label="locale === 'ja' ? '導入の補足' : 'Installation help'">
      <NuxtLink :to="local('/docs/getting-started')">{{ locale === 'ja' ? '導入ガイド' : 'Setup guide' }}</NuxtLink>
      <a :href="`https://github.com/hathq/hatter-releases/releases/tag/v${release.version}`">{{ locale === 'ja' ? 'リリースノート' : 'Release notes' }}</a>
    </nav>
    <details><summary>{{ locale === 'ja' ? 'その他の導入方法・利用条件' : 'Manual installation and terms' }}</summary>
      <p>{{ locale === 'ja' ? 'Windowsネイティブ・macOSは未対応です。既存のhatterコマンドがある場合は上書きせず停止します。自動更新・自動復旧は行いません。' : 'Native Windows and macOS are not supported. Existing hatter commands are never overwritten. Updates and rollback are manual.' }}</p>
      <p><a href="https://github.com/hathq/hatter-releases/blob/main/INSTALL.md">{{ locale === 'ja' ? '手動取得・検証と削除の手順' : 'Manual download, verification and removal' }}</a> · <a href="https://github.com/hathq/hatter-releases/blob/main/BINARY-TERMS.md">{{ locale === 'ja' ? '利用条件' : 'Usage terms' }}</a></p>
      <p>SHA256 · {{ release.archiveSha256 }}</p>
    </details>
  </section>
</template>
<style scoped>
.install-card { max-width: 900px; margin: 0 auto 4rem; padding: clamp(1.2rem, 4vw, 3rem); text-align: center; border: 1px solid color-mix(in srgb, var(--site-accent) 35%, transparent); border-radius: 28px; background: radial-gradient(ellipse at top, color-mix(in srgb, var(--site-accent) 14%, transparent), transparent 70%); }
.install-card img { display: block; margin: 0 auto 1rem; object-fit: contain; }
.install-channel { text-transform: uppercase; font-size: .8rem; letter-spacing: .1em; }
.install-card h2 { font-size: clamp(1.8rem, 5vw, 2.8rem); margin: .5rem 0; }
.install-card h2 span { color: var(--site-accent); white-space: nowrap; }
.install-requirement { font-size: .9rem; }
.install-terminal { text-align: left; background: #111827; color: #e5e7eb; border: 1px solid #334155; border-radius: 16px; overflow: hidden; margin: 1.5rem 0 1rem; }
.install-terminal-bar { display: flex; align-items: center; gap: .65rem; padding: .85rem 1rem; border-bottom: 1px solid #334155; flex-wrap: wrap; }
.install-terminal-bar button { margin-left: auto; background: #e2e8f0; color: #111827; border: 0; border-radius: 8px; padding: .6rem .85rem; cursor: pointer; font: inherit; }
.install-terminal-bar button:focus-visible, pre:focus-visible { outline: 3px solid #38bdf8; outline-offset: -3px; }
.install-terminal pre { margin: 0; padding: 1.2rem; overflow-x: auto; font-size: .8rem; line-height: 1.8; white-space: pre; }
.install-feedback { min-height: 3em; font-size: .9rem; }
.install-help { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; padding: 1rem; }
.install-card details { margin-top: 1.5rem; text-align: left; font-size: .9rem; overflow-wrap: anywhere; }
.install-card summary { cursor: pointer; padding: .75rem 0; }
</style>
