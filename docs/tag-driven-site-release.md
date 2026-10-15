# Independent product site release

The source contract owns `hatter.ihat.online` in the explicit parent zone
`ihat.online`. The immutable tag is `site/hatter/v<contract version>`.
Build and archive preparation run without Cloudflare credentials and bind the
exact source, target and every asset hash. This product target is independent
from the parent's other site and does not expose private CLI source.

The deployment job requires effective native Environment reviewers, its dedicated
secret and matching account/zone/production binding/rollback metadata. It cannot
create the initial Worker, domain binding or DNS records. Those prerequisites
and the first read-back remain coela-oss/coela-release#110. No tag, Environment,
credential or provider setting is created by this source change.

A shared install root is explicit. The application is typechecked/generated from
that owner's locked dependency tree; no sibling checkout is needed. Unknown
zone/host, path escapes, changed archive bytes and unverified replay are refused.

The new product target has `deploymentEnabled: false`. Even an already enabled
parent repository cannot enter its production Environment or deploy this target
until the initial provider/security acceptance is recorded and this flag is
reviewed. Candidate build/pack remains independent of that activation.
