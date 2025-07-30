# Contributing to BitWord

Thank you for your interest in contributing to BitWord! This document provides guidelines for contributing to the Bitcoin terminology learning game.

## 🎯 Project Vision

BitWord aims to educate people about Bitcoin through interactive gameplay. We focus on:
- Authentic Bitcoin terminology and concepts
- Educational value in every interaction
- Progressive difficulty from basic to advanced concepts
- Clean, accessible user experience

## 🚀 Getting Started

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/bitword.git
   cd bitword
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Contribution Areas

### 🔤 Word Database Expansion
We welcome additions to our Bitcoin terminology database:

**Beginner Level** (Basic concepts)
- Bitcoin fundamentals
- Wallet terminology  
- Basic network concepts
- Simple transaction terms

**Intermediate Level** (Economics & Strategy)
- Austrian economics concepts
- Market terminology
- Investment strategies
- Bitcoin business models

**Advanced Level** (Technical concepts)
- Protocol specifications
- Cryptographic concepts
- Lightning Network
- Mining and consensus

### Word Contribution Format
```typescript
{
  word: "EXAMPLE",
  difficulty: "beginner|intermediate|advanced",
  category: "Category Name",
  definition: "Clear, educational definition",
  hint: "Helpful hint for guessing",
  funFact: "Interesting fact about the term",
  isActive: true
}
```

### 🎨 UI/UX Improvements
- Component design enhancements
- Accessibility improvements
- Mobile responsiveness
- Animation and interaction improvements

### 🔧 Technical Enhancements
- Performance optimizations
- Bug fixes
- Code quality improvements
- Test coverage expansion

### 🌍 Localization
- Translation to other languages
- Cultural adaptation of content
- Regional Bitcoin terminology

## 🛠 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration compliance
- Consistent naming conventions
- Component-based architecture

### Commit Convention
```
type(scope): description

Types:
- feat: New features
- fix: Bug fixes  
- docs: Documentation
- style: Code style changes
- refactor: Code refactoring
- test: Test additions/changes
- chore: Build/config changes

Examples:
feat(words): add Lightning Network terminology
fix(game): prevent replay of completed levels
docs(readme): update deployment instructions
```

### Branch Naming
- `feature/word-database-expansion`
- `fix/game-replay-issue`
- `docs/contributing-guide`
- `refactor/database-optimization`

## 📝 Pull Request Process

### Before Submitting
1. **Test your changes**
   ```bash
   npm run dev
   # Test all affected functionality
   ```

2. **Check code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

3. **Update documentation**
   - Update README if needed
   - Add comments for complex logic
   - Update API documentation

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change  
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests if applicable

## Word Database Changes (if applicable)
- Number of words added: 
- Difficulty levels affected:
- Categories added/modified:

## Screenshots (if applicable)
Include before/after screenshots for UI changes
```

## 🎓 Word Content Guidelines

### Quality Standards
- **Accuracy**: All definitions must be technically correct
- **Clarity**: Explanations should be accessible to the target difficulty level
- **Relevance**: Terms must be directly related to Bitcoin
- **Educational Value**: Each word should teach something meaningful

### Content Review Process
1. **Technical Accuracy**: Verified against Bitcoin documentation
2. **Educational Value**: Appropriate for difficulty level
3. **Language Quality**: Clear, concise, engaging
4. **Fact Checking**: Fun facts must be verifiable

### Sources for Verification
- Bitcoin Whitepaper
- Bitcoin Core documentation
- Mastering Bitcoin (Andreas Antonopoulos)
- Bitcoin.org resources
- Lightning Network specifications

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues
2. Test in latest version
3. Reproduce the issue

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g. iOS, Windows]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Describe alternatives considered**
Alternative solutions considered

**Additional context**
Mock-ups, examples, or additional context

**Educational Value**
How does this enhance Bitcoin education?
```

## 📚 Learning Resources

### Bitcoin Knowledge
- [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
- [Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook)
- [Bitcoin.org](https://bitcoin.org/)
- [Lightning Network Resources](https://lightning.network/)

### Development Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

## ⚡ Quick Contribution Ideas

### Easy (Good First Issues)
- Fix typos in word definitions
- Add missing fun facts
- Improve hint clarity
- Update documentation

### Medium
- Add new word categories
- Implement UI improvements
- Optimize database queries
- Add new game features

### Advanced
- Implement user authentication
- Add multiplayer features
- Create mobile app version
- Build analytics dashboard

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special thanks for educational content additions

## 📞 Communication

### Channels
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: General questions and ideas
- Pull Request Comments: Code review discussions

### Response Times
- Issues: We aim to respond within 48 hours
- Pull Requests: Initial review within 72 hours
- Questions: Community and maintainers help when available

## 📄 License

By contributing to BitWord, you agree that your contributions will be licensed under the MIT License.

---

**Ready to contribute? Check out our [Good First Issues](https://github.com/your-username/bitword/labels/good%20first%20issue) to get started!**