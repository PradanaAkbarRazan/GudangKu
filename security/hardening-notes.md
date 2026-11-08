# GudangKu — Hardening Notes

## 1. Environment

- Application: Next.js 16.4.2, React 19
- Runtime: Node.js 22 Bookworm Slim
- Database: PostgreSQL 16 Bookworm
- ORM: Prisma 7.10.1
- Container scanner: Trivy 0.76.2
- SBOM format: CycloneDX 1.7

## 2. OS Hardening

Environment: Ubuntu 22.04.1 LTS.

### SSH

- PermitRootLogin: no
- PasswordAuthentication: no
- KbdInteractiveAuthentication: no
- PubkeyAuthentication: yes
- MaxAuthTries: 3
- AllowUsers: pradana

SSH key authentication was tested successfully.
Password authentication and root login were rejected.

### Security Services

- UFW: active
- Default incoming: deny
- Default outgoing: allow
- SSH service: allowed
- Fail2ban: active, SSHD jail detected
- Auditd: active

### Lynis

| Audit | Hardening Index |
|---|---:|
| Before hardening | 59 |
| After hardening | 62 |
| Assignment target | 70 |

The target score has not been achieved.
One warning remained concerning package vulnerability detection (PKGS-7392).

## 3. Container Hardening

### Application

- Runtime user: UID 1001 (nextjs)
- Read-only root filesystem: enabled
- cap_drop: ALL
- no-new-privileges: enabled
- Application port 3000: not published to host

### Database

- PostgreSQL runtime user: UID 999 (postgres)
- Data volume ownership: 999:999
- Data directory permission: 700
- Read-only root filesystem: enabled
- cap_drop: ALL
- no-new-privileges: enabled
- Database port 5432: not published to host

### Migration Service

- Runtime user: UID 1000
- Read-only root filesystem: enabled
- cap_drop: ALL
- no-new-privileges: enabled

### Network and Persistence

- Internal Docker network: backend
- PostgreSQL data stored in named volume postgres_data
- No host-published application or database ports

### Deployment Verification

- PostgreSQL health check: healthy
- Prisma migrations: 2 migrations successfully applied
- Seed: 3 products and 4 stock history records
- Next.js application: healthy

## 4. Trivy Image Scan

Scanner version: 0.76.2

| Scan | OS findings | Node findings |
|---|---:|---:|
| Baseline | 215 | 23 |
| Hardened raw | 215 | 23 |
| Hardened after triage | 214 | 23 |

### Severity Before Triage

OS:
- UNKNOWN: 0
- LOW: 85
- MEDIUM: 95
- HIGH: 34
- CRITICAL: 1

Node:
- UNKNOWN: 0
- LOW: 1
- MEDIUM: 12
- HIGH: 10
- CRITICAL: 0

### Vulnerability Triage

CVE-2023-45853 was identified on Debian 12 package zlib1g version 1:1.2.13.dfsg-1.

The finding was suppressed using a package-specific Trivy ignore rule after reviewing Debian Bookworm security tracker information concerning MiniZip.

This is a documented triage exception, not a package update. The original raw scan remains preserved.

After triage:
- Active CRITICAL findings: 0
- Suppressed CRITICAL findings: 1
- HIGH findings remain and require further dependency review.

## 5. Software Bill of Materials

- File: sbom.cdx.json
- Format: CycloneDX
- Specification version: 1.7
- Components: 328
- Generated from: gudangku-app:hardened

## 6. Risk Mapping

| Risk ID | Control |
|---|---|
| P-04 / T-01 | Password hashing, database-backed sessions, SSH key authentication |
| T-11 | RBAC, non-root application and database users, dropped capabilities |
| T-08 | Restricted host access to services and local environment-file handling |

## 7. Outstanding Limitations

- Lynis score remains below the required target of 70.
- Trivy still reports HIGH and MEDIUM findings.
- The CRITICAL zlib finding is suppressed with a documented exception, not fixed by upgrading the package.
- Access-control test documentation and final risk-register updates must be completed.
