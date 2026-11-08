# AI Assistance Log — GudangKu Tugas 2

## Scope of Assistance

AI was used to assist with:
- Reviewing authentication and role-based access control implementation.
- Designing Argon2id password hashing and database-backed sessions.
- Preparing SSH hardening configuration.
- Designing Dockerfile and Docker Compose security controls.
- Interpreting Lynis and Trivy findings.
- Preparing access-test and hardening documentation.

## Human Verification

The student executed the commands, configured the environment,
ran the tests and scanners, and reviewed the results.

Verified results include:
- Argon2id password hash verification for ADMIN and PETUGAS.
- Six positive and six negative access tests.
- SSH public-key login succeeded; password and root login were rejected.
- Lynis scores: 59 before and 62 after hardening.
- Docker application UID 1001 and database UID 999.
- Read-only filesystem, dropped capabilities, and no-new-privileges.
- Trivy image scanning and CycloneDX SBOM generation.

## Limitations

The Lynis target score of 70 has not been reached.
Trivy findings include residual HIGH and MEDIUM vulnerabilities.
One CRITICAL finding was suppressed after package-specific triage;
it was not fixed through a package update.

## Responsibility

AI provided advisory and drafting assistance only.
All local execution, verification, Git commits, tags, pushes,
and final submission are performed by the student.
