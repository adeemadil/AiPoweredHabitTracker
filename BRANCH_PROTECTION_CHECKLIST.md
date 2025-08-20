# Branch Protection Checklist

## Required Setup (GitHub UI)

### 1. Protect `legacy/v1` branch
**Location**: GitHub → Repository → Settings → Branches → Add rule

**Settings**:
- [ ] Branch name pattern: `legacy/v1`
- [ ] ✅ Require a pull request before merging
  - [ ] Require approvals: 1
  - [ ] Dismiss stale PR approvals when new commits are pushed
- [ ] ✅ Require status checks to pass before merging
- [ ] ✅ Require branches to be up to date before merging
- [ ] ✅ Restrict pushes that create files larger than 100 MB
- [ ] ✅ Do not allow bypassing the above settings
- [ ] ✅ Restrict deletions
- [ ] ✅ Include administrators

### 2. Protect `main` branch
**Location**: GitHub → Repository → Settings → Branches → Add rule

**Settings**:
- [ ] Branch name pattern: `main`
- [ ] ✅ Require a pull request before merging
  - [ ] Require approvals: 1
  - [ ] Dismiss stale PR approvals when new commits are pushed
- [ ] ✅ Require status checks to pass before merging
- [ ] ✅ Require branches to be up to date before merging
- [ ] ✅ Restrict pushes that create files larger than 100 MB
- [ ] ✅ Do not allow bypassing the above settings
- [ ] ✅ Restrict deletions
- [ ] ✅ Include administrators

### 3. Protect `rewrite/v2` branch
**Location**: GitHub → Repository → Settings → Branches → Add rule

**Settings**:
- [ ] Branch name pattern: `rewrite/v2`
- [ ] ✅ Require a pull request before merging
  - [ ] Require approvals: 1
  - [ ] Dismiss stale PR approvals when new commits are pushed
- [ ] ✅ Require status checks to pass before merging
- [ ] ✅ Require branches to be up to date before merging
- [ ] ✅ Restrict pushes that create files larger than 100 MB
- [ ] ✅ Do not allow bypassing the above settings
- [ ] ✅ Restrict deletions
- [ ] ✅ Include administrators

## Status Checks to Enable
- [ ] TypeScript compilation (`npx tsc --noEmit --skipLibCheck`)
- [ ] ESLint checks
- [ ] Unit tests
- [ ] Build verification
- [ ] Database migration validation

## Branch Naming Conventions
- [ ] Feature branches: `feature/v2-<description>`
- [ ] Bug fixes: `fix/v2-<description>`
- [ ] Hotfixes: `hotfix/legacy-<description>`
- [ ] Documentation: `docs/<description>`

## PR Templates
Create `.github/pull_request_template.md` with:
- [ ] Description of changes
- [ ] Type of change (feature/fix/docs)
- [ ] Testing checklist
- [ ] Breaking changes section
- [ ] Screenshots (if applicable)

## Automated Actions
- [ ] Auto-assign reviewers
- [ ] Auto-label PRs based on branch name
- [ ] Auto-close stale PRs
- [ ] Dependency updates automation

---

**Last Updated**: $(date)
**Status**: Pending Setup
