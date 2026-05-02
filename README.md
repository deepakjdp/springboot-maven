# Spring Boot + Angular Application with Test Coverage

A full-stack application demonstrating Spring Boot backend with Angular frontend, including comprehensive test coverage using JUnit and Jest, with SonarQube integration for code quality analysis.

## Project Structure

```
springboot-maven/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── SpringBootAngularApplication.java
│   │   │   ├── controller/
│   │   │   │   └── UserController.java
│   │   │   ├── service/
│   │   │   │   └── UserService.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   └── entity/
│   │   │       └── User.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/example/app/
│           ├── controller/
│           │   └── UserControllerTest.java
│           └── service/
│               └── UserServiceTest.java
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── models/
│   │       │   └── user.model.ts
│   │       ├── services/
│   │       │   ├── user.service.ts
│   │       │   └── user.service.spec.ts
│   │       └── components/
│   │           └── user-list/
│   │               ├── user-list.component.ts
│   │               └── user-list.component.spec.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── setup-jest.ts
│   └── sonar-project.properties
├── pom.xml
├── sonar-project.properties
└── README.md
```

## Technologies Used

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database
- **JUnit 5** - Testing framework
- **Mockito** - Mocking framework
- **JaCoCo** - Code coverage tool
- **Maven** - Build tool

### Frontend
- **Angular 17** - Frontend framework
- **RxJS** - Reactive programming
- **Jest** - Testing framework
- **TypeScript** - Programming language

### Code Quality
- **SonarQube** - Code quality and security analysis
- **70% Coverage Threshold** - Enforced on both backend and frontend

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+ and npm
- SonarQube Server (optional, for local analysis)

## Backend Setup and Testing

### 1. Build the Project

```bash
mvn clean install
```

### 2. Run Tests

```bash
mvn test
```

### 3. Generate Coverage Report

```bash
mvn clean test jacoco:report
```

The coverage report will be generated at: `target/site/jacoco/index.html`

### 4. Run the Application

```bash
mvn spring-boot:run
```

The backend will start at: `http://localhost:8080`

### 5. API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/count` - Get user count

### 6. Run SonarQube Analysis (Backend)

```bash
# With local SonarQube server
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your-token

# With SonarCloud
mvn clean verify sonar:sonar \
  -Dsonar.organization=your-org \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=your-token
```

## Frontend Setup and Testing

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Tests

```bash
npm test
```

### 3. Generate Coverage Report

```bash
npm run test:coverage
```

The coverage report will be generated at: `frontend/coverage/lcov-report/index.html`

### 4. Run the Application

```bash
npm start
```

The frontend will start at: `http://localhost:4200`

### 5. Run SonarQube Analysis (Frontend)

```bash
cd frontend

# With local SonarQube server
npm run sonar -- \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your-token

# With SonarCloud
npm run sonar -- \
  -Dsonar.organization=your-org \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=your-token
```

## Test Coverage Details

### Backend Coverage (JUnit + JaCoCo)

The backend tests cover:
- **UserService**: All CRUD operations, error handling, and edge cases
- **UserController**: All REST endpoints, request/response handling, and error scenarios
- **Coverage Threshold**: 70% minimum for lines, branches, and methods

Test files:
- `UserServiceTest.java` - 15 test cases covering all service methods
- `UserControllerTest.java` - 13 test cases covering all controller endpoints

### Frontend Coverage (Jest)

The frontend tests cover:
- **UserService**: All HTTP operations, error handling, and observables
- **UserListComponent**: Component lifecycle, user interactions, and error states
- **Coverage Threshold**: 70% minimum for statements, branches, functions, and lines

Test files:
- `user.service.spec.ts` - 16 test cases covering all service methods
- `user-list.component.spec.ts` - 12 test cases covering all component functionality

## Viewing Coverage Reports

### Backend (JaCoCo)

After running `mvn test jacoco:report`, open:
```
target/site/jacoco/index.html
```

The report shows:
- Line coverage
- Branch coverage
- Method coverage
- Detailed coverage per class and package

### Frontend (Jest)

After running `npm run test:coverage`, open:
```
frontend/coverage/lcov-report/index.html
```

The report shows:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage
- Detailed coverage per file

## SonarQube Reports

SonarQube provides comprehensive analysis including:
- Code coverage metrics
- Code smells
- Bugs and vulnerabilities
- Technical debt
- Duplications
- Maintainability ratings

### Accessing SonarQube Dashboard

1. **Local SonarQube**: `http://localhost:9000`
2. **SonarCloud**: `https://sonarcloud.io`

Search for your project key:
- Backend: `springboot-angular-app`
- Frontend: `springboot-angular-app-frontend`

## Running Complete Test Suite

### Backend
```bash
# Run tests and generate all reports
mvn clean test jacoco:report

# Verify coverage threshold
mvn jacoco:check
```

### Frontend
```bash
cd frontend

# Run tests with coverage
npm run test:coverage

# The coverage threshold is automatically checked
```

## Coverage Threshold Configuration

### Backend (pom.xml)
```xml
<configuration>
    <rules>
        <rule>
            <element>PACKAGE</element>
            <limits>
                <limit>
                    <counter>LINE</counter>
                    <value>COVEREDRATIO</value>
                    <minimum>0.70</minimum>
                </limit>
            </limits>
        </rule>
    </rules>
</configuration>
```

### Frontend (package.json)
```json
"coverageThreshold": {
    "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
    }
}
```

## Continuous Integration

### Sample CI/CD Pipeline

```yaml
# Backend
- mvn clean test jacoco:report
- mvn jacoco:check
- mvn sonar:sonar

# Frontend
- cd frontend
- npm install
- npm run test:coverage
- npm run sonar
```

## Troubleshooting

### Backend Issues

1. **Port 8080 already in use**
   - Change port in `application.properties`: `server.port=8081`

2. **Tests failing**
   - Ensure Java 17 is installed: `java -version`
   - Clean and rebuild: `mvn clean install`

### Frontend Issues

1. **Dependencies not installing**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

2. **Tests failing**
   - Ensure Node.js 18+ is installed: `node -v`
   - Update dependencies: `npm update`

## License

This project is created for demonstration purposes.

## Author

Sample Spring Boot + Angular Application with Test Coverage