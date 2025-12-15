# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** open a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send an email to: **[your-email@example.com]**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity

### 4. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide a detailed response within 7 days
- We will work on a fix and keep you updated
- We will credit you in the security advisory (if desired)

## Security Best Practices

### For Users

1. **API Keys**
   - Never commit `.env` files
   - Use environment variables
   - Rotate keys regularly

2. **Dependencies**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Check for security advisories

3. **Deployment**
   - Use HTTPS in production
   - Enable CORS properly
   - Set secure headers

### For Developers

1. **Code Review**
   - Review all PRs for security issues
   - Use static analysis tools
   - Follow secure coding practices

2. **Testing**
   - Test input validation
   - Test authentication
   - Test authorization

3. **Monitoring**
   - Monitor for suspicious activity
   - Log security events
   - Set up alerts

## Known Security Considerations

### API Keys
- OpenAI API key required (keep secret)
- LI.FI API key required (keep secret)
- Store in `.env` file (not committed)

### CORS
- Currently allows all origins in development
- **Must restrict in production**
- Update `main.py` CORS settings

### Rate Limiting
- Not implemented yet
- Consider adding for production
- Prevents abuse

### Input Validation
- Implemented with Pydantic
- Validates all API inputs
- Prevents injection attacks

## Security Updates

We will announce security updates through:
- GitHub Security Advisories
- Release notes
- CHANGELOG.md

## Contact

For security concerns: **[your-email@example.com]**

For general issues: Use GitHub Issues

---

**Thank you for helping keep ChainCompass AI secure!**
