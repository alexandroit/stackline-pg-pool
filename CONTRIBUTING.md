# Contributing

Contributions should preserve the `pg-pool@3.14.0` compatibility contract and
must not introduce an unreviewed production dependency.

Before opening a pull request:

1. Run the upstream and Stackline tests against PostgreSQL.
2. Run `npm run verify`.
3. Confirm a clean source install and zero full audit.
4. Document compatibility, security, or dependency changes.
5. Keep the original MIT attribution intact.

Security reports belong in GitHub private vulnerability reporting, not public
issues.
