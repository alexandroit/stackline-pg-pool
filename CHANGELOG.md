# Changelog

## [1.0.1] - 2026-09-28

- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


## 1.0.0 - 2026-08-30

- Forked the `pg-pool@3.14.0` runtime and public API.
- Prevented npm from auto-installing the historical `pg` dependency chain by
  removing the install-time peer edge while preserving runtime Client lookup.
- Added direct and legacy-alias packed-install regression gates.
- Replaced the vulnerable legacy test-tool chain with a dependency-free,
  sequential compatibility harness while preserving all upstream cases.
- Added dependency, compatibility, migration, security, provenance, and
  verification documentation.

The pooling implementation is unchanged from the reviewed upstream baseline.
