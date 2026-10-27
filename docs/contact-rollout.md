# Contact form rollout

The published NuxtJP contact-form module owns form behavior and the shared Rust Worker. This site owns its content, origin, site identity and public policy link. HAT Inc. is the information controller; its central policy is referenced rather than copied. Reply email is optional. The public configuration contains no delivery recipient or credentials.

The release candidate uses the existing same-origin `/v1/submissions` path. Production admission requires a matching server-side siteKey/origin/fixed-recipient policy, Turnstile hostname registration and route, and disabled automatic analytics injection. Do not mark delivery accepted until a real browser submission and owned-mailbox receipt are confirmed. Never replay an unknown send result automatically. Existing unrelated product holds remain unchanged.

Track all sites at https://github.com/nuxtjp/contact-form/issues/5 . Deployment must preserve existing DNS, custom domains and credentials. Secrets are never part of this repository or public runtime configuration.
