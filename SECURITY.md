# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 🔒 Private Disclosure

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues to:
- **Email**: security@lifereachchurch.org
- **Subject**: [SECURITY] Brief description of the issue

### 📧 What to Include

Please provide:
1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)
5. **Your contact information** for follow-up

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: 90+ days

### 🏆 Recognition

We appreciate responsible disclosure. With your permission, we will:
- Credit you in our security acknowledgments
- Provide recognition in release notes
- Offer our sincere thanks

### 🛡️ Security Best Practices

#### For Users
- Keep dependencies updated
- Use strong authentication credentials
- Enable 2FA where available
- Regular security audits

#### For Developers
- Run `npm audit` regularly
- Review dependency updates carefully
- Follow secure coding practices
- Test security patches thoroughly

### 🔐 Known Security Features

- Security headers (HSTS, CSP, etc.)
- Environment variable validation
- Input validation with Zod
- CSRF protection
- Secure authentication (NextAuth.js)
- API rate limiting (recommended)

### 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/security)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Security Advisories
- Release notes
- Email notifications (for critical issues)

Thank you for helping keep our platform secure!
