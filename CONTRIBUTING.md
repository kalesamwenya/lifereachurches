# Contributing to Lifereach Church Frontend

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/lifereachurches.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit: `git commit -m 'Add some feature'`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request

## 📝 Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add event registration form
fix: resolve mobile menu navigation issue
docs: update API documentation
```

## 🎯 Code Standards

### JavaScript/React
- Use functional components and hooks
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep components small and focused

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Keep consistent spacing and sizing
- Use design tokens from config

### File Organization
```
components/
  ComponentName/
    ComponentName.jsx
    ComponentName.test.jsx (if applicable)
```

## ✅ Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] ESLint shows no errors
- [ ] Build completes successfully (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow guidelines
- [ ] PR description clearly explains changes

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build project
npm run build
```

## 📖 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new utilities
- Update relevant documentation files

## 🐛 Reporting Bugs

Include:
- Clear bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (browser, OS, etc.)

## 💡 Suggesting Features

- Check existing issues first
- Provide clear use case
- Explain expected behavior
- Consider implementation approach

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

## 🙏 Thank You!

Your contributions help build a better platform for the church community!
