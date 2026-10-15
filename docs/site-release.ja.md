# 所有リポジトリからのサイト公開

公開先: https://ihat.online、Worker `ihat-docs-site`。`.github/site-release.json` が責務・version・domain・build root・出力を束縛する正本。中央管理repoのcheckoutやcredentialは不要。

1. 対象siteのversionを更新するPRをmainへマージし、requiredWorkflowsの成功を待つ。
2. このrepoのmain commitへ `site/ihat-docs/v<version>` のタグを付けてpushする。versionは契約と完全一致させる。
3. `Release site from owned version tag` が無資格でbuildし、配信全fileのhashとsourceを持つarchiveを保存する。mainマージだけでは本番変更しない。
4. 有効化済みのproduction Environmentで承認後、同じarchiveを配備・全asset照合し、rollbackと受入receiptを残す。新しいレビューWorkerやworkers.dev公開は作らない。

## 有効化前の設定

`site-production-ihat-docs` Environmentに実効的なrequired reviewersと `site/**` tag制限を設定する。Environment secret `CLOUDFLARE_DEPLOY_TOKEN` は既存accountとこのdomainの必要権限だけを持つ専用tokenとし、本人用の広いaccount管理tokenをコピーしない。Cloudflareはこの経路でGitHub OIDC認証を提供するものとして扱わない。Workers Scripts Writeはaccount単位の権限であり、repo/Worker単位の隔離を保証しない。より強い隔離が必要な場合はcredential broker等の別経路を設計する。

設定と既存bindingを確認後、repo variable `SITE_DEPLOY_ENABLED=true` で有効化する。未設定ではarchive準備までに止まり、SummaryにNOT DEPLOYEDを表示する。必要なprovider/Environment設定をソース修正だけで完了扱いにしない。private repoではGitHub planによりrequired reviewersが使えない場合があり、実効的な承認が確認できるまで自動配備を有効にしない。

実行例（versionは契約から解決）:

```sh
release_tag=$(python3 -c 'import json; s=json.load(open(".github/site-release.json"))["sites"][0]; print("site/"+s["id"]+"/v"+s["version"])')
git tag "$release_tag"
git push origin "$release_tag"
```

初回tag pushだけがwrite可能。rerun/手動実行では既に同じsource/versionが配信されている場合のread-backのみ許可し、失敗を理由にdeployを自動再試行しない。古いversionへの切戻しは保存されたrollback versionとreceiptを確認した別操作として扱う。artifact/receiptは90日保存し、長期保存はこのrepoのRelease/保管経路へ移す。private sourceを公開に変更する操作は含まない。

参考: [Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)、[GitHub Environment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)。
