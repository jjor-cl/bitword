# BitWord Deployment Guide

This guide covers deployment options for the BitWord Bitcoin terminology game.

## 🚀 Quick Deployment on Replit

### 1. Import to Replit
1. Go to [Replit](https://replit.com)
2. Create a new Repl
3. Choose "Import from GitHub" 
4. Enter your repository URL
5. Replit will automatically detect the Node.js environment

### 2. Set Environment Variables
In your Repl's Secrets tab, add:
```
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your_postgres_host
PGPORT=5432
PGDATABASE=bitword
PGUSER=your_username  
PGPASSWORD=your_password
```

### 3. Initialize Database
Run these commands in the Shell:
```bash
npm install
npm run db:push
```

### 4. Start Development
```bash
npm run dev
```

### 5. Deploy
1. Click the "Deploy" button in Replit
2. Choose deployment options
3. Your app will be live at `https://your-repl-name.username.replit.app`

## 🌐 Manual Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Web server (nginx, Apache, etc.)

### 1. Prepare the Server
```bash
# Clone repository
git clone <your-repo-url>
cd bitword

# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb bitword

# Set environment variables
export DATABASE_URL="postgresql://user:pass@localhost:5432/bitword"

# Push database schema
npm run db:push
```

### 3. Environment Configuration
Create `.env.production`:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/bitword
PORT=5000
```

### 4. Start Production Server
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start npm --name "bitword" -- start

# Or direct
npm start
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application  
RUN npm run build

EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/bitword
    depends_on:
      - db
      
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=bitword
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# Run database migrations
docker-compose exec app npm run db:push
```

## ☁️ Cloud Platform Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Set environment variables in Vercel dashboard

### Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create bitword-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:push
```

### Railway
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Add PostgreSQL plugin
4. Deploy automatically on push

### DigitalOcean App Platform
1. Create new App in DigitalOcean
2. Connect GitHub repository  
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Add PostgreSQL database component
5. Set environment variables

## 🔧 Production Configuration

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/bitword
PORT=5000
PGHOST=your_postgres_host
PGPORT=5432
PGDATABASE=bitword  
PGUSER=your_username
PGPASSWORD=your_password
```

### Performance Optimization
1. **Enable gzip compression**
2. **Set up CDN for static assets**
3. **Configure database connection pooling**
4. **Set up monitoring and logging**

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Set secure HTTP headers
- [ ] Validate all input data
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database access restrictions

## 📊 Monitoring

### Health Check Endpoint
The app includes a health check at `/api/health`:
```bash
curl https://your-app.com/api/health
```

### Database Monitoring
```bash
# Check database connection
npm run db:check

# View database statistics
npm run db:stats
```

### Logging
Production logs include:
- API request/response times
- Database query performance  
- Error tracking
- User activity metrics

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy BitWord

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to production
      run: # Your deployment commands
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify DATABASE_URL format
- Check firewall settings
- Ensure PostgreSQL is running

**Build Failures**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

**Performance Issues**
- Monitor database query performance
- Check memory usage
- Optimize large queries

### Support
For deployment issues, check:
1. Server logs for error details
2. Database connectivity
3. Environment variable configuration
4. Build process completion

---

**Need help with deployment? Create an issue in the repository with deployment details.**