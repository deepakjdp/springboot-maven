# Quick Start Guide

This guide will help you quickly set up and run the Spring Boot + Angular application with test coverage reports.

## Prerequisites Check

```bash
# Check Java version (should be 17+)
java -version

# Check Maven version (should be 3.6+)
mvn -version

# Check Node.js version (should be 18+)
node -v

# Check npm version
npm -v
```

## Quick Setup (5 Minutes)

### Option 1: Run Everything at Once

```bash
# Make scripts executable (if not already done)
chmod +x run-all-tests.sh run-backend-tests.sh run-frontend-tests.sh

# Run all tests and generate reports
./run-all-tests.sh
```

### Option 2: Step-by-Step

#### Backend Only

```bash
# Run backend tests and generate coverage
./run-backend-tests.sh

# View coverage report
open target/site/jacoco/index.html
```

#### Frontend Only

```bash
# Run frontend tests and generate coverage
./run-frontend-tests.sh

# View coverage report
open frontend/coverage/lcov-report/index.html
```

## What Gets Generated

### Backend Reports
- **JaCoCo Coverage Report**: `target/site/jacoco/index.html`
- **Surefire Test Reports**: `target/surefire-reports/`
- **Coverage XML**: `target/site/jacoco/jacoco.xml` (for SonarQube)

### Frontend Reports
- **Jest Coverage Report**: `frontend/coverage/lcov-report/index.html`
- **LCOV Report**: `frontend/coverage/lcov.info` (for SonarQube)
- **Coverage Summary**: Displayed in terminal

## Expected Coverage Results

### Backend (JUnit + JaCoCo)
- ✅ **UserService**: ~95% coverage (15 test cases)
- ✅ **UserController**: ~90% coverage (13 test cases)
- ✅ **Overall**: >70% coverage threshold met

### Frontend (Jest)
- ✅ **UserService**: ~95% coverage (16 test cases)
- ✅ **UserListComponent**: ~90% coverage (12 test cases)
- ✅ **Overall**: >70% coverage threshold met

## Running the Applications

### Backend (Spring Boot)

```bash
# Start the backend server
mvn spring-boot:run

# Server will start at: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

### Frontend (Angular)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start

# Application will start at: http://localhost:4200
```

## Testing Individual Components

### Backend

```bash
# Test specific class
mvn test -Dtest=UserServiceTest

# Test specific method
mvn test -Dtest=UserServiceTest#testGetAllUsers
```

### Frontend

```bash
cd frontend

# Test specific file
npm test -- user.service.spec.ts

# Test in watch mode
npm test -- --watch
```

## SonarQube Analysis

### Local SonarQube Setup

1. **Start SonarQube** (Docker):
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

2. **Access SonarQube**: http://localhost:9000
   - Default credentials: admin/admin

3. **Generate Token**:
   - Go to: My Account → Security → Generate Token

4. **Run Analysis**:

Backend:
```bash
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

Frontend:
```bash
cd frontend
npm run test:coverage
npm run sonar -- \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

### SonarCloud (Cloud-based)

1. **Sign up**: https://sonarcloud.io
2. **Create organization and project**
3. **Get token from**: My Account → Security
4. **Run analysis**:

Backend:
```bash
mvn clean verify sonar:sonar \
  -Dsonar.organization=YOUR_ORG \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_TOKEN
```

Frontend:
```bash
cd frontend
npm run test:coverage
npm run sonar -- \
  -Dsonar.organization=YOUR_ORG \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_TOKEN
```

## Troubleshooting

### Backend Issues

**Problem**: Tests fail with "Cannot find symbol"
```bash
# Solution: Clean and rebuild
mvn clean install -DskipTests
mvn test
```

**Problem**: Port 8080 already in use
```bash
# Solution: Change port in application.properties
echo "server.port=8081" >> src/main/resources/application.properties
```

### Frontend Issues

**Problem**: Module not found errors
```bash
# Solution: Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Jest tests fail
```bash
# Solution: Clear Jest cache
cd frontend
npm test -- --clearCache
npm test
```

## Viewing Reports in Browser

### macOS
```bash
# Backend
open target/site/jacoco/index.html

# Frontend
open frontend/coverage/lcov-report/index.html
```

### Linux
```bash
# Backend
xdg-open target/site/jacoco/index.html

# Frontend
xdg-open frontend/coverage/lcov-report/index.html
```

### Windows
```bash
# Backend
start target/site/jacoco/index.html

# Frontend
start frontend/coverage/lcov-report/index.html
```

## Next Steps

1. ✅ Run tests and verify 70%+ coverage
2. ✅ View coverage reports in browser
3. ✅ Set up SonarQube for continuous analysis
4. ✅ Integrate with CI/CD pipeline
5. ✅ Add more test cases to increase coverage

## Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review test files for examples
- Check SonarQube dashboard for code quality insights

## Summary

You now have:
- ✅ Spring Boot backend with REST API
- ✅ Angular frontend with services and components
- ✅ 28 JUnit test cases (backend)
- ✅ 28 Jest test cases (frontend)
- ✅ 70%+ code coverage on both sides
- ✅ JaCoCo and Jest coverage reports
- ✅ SonarQube integration ready
- ✅ Automated test scripts

Happy testing! 🎉