# Jenkins Pipeline Setup Guide

This guide explains how to set up and run the Jenkins pipeline for the Spring Boot + Angular application.

## Pipeline Overview

The Jenkinsfile includes 10 stages:

1. **Checkout** - Get code from repository
2. **Build Backend** - Compile Spring Boot application
3. **Test Backend** - Run JUnit tests with JaCoCo coverage
4. **Backend SonarQube Analysis** - Analyze backend code quality
5. **Build Frontend** - Install npm dependencies
6. **Test Frontend** - Run Jest tests with coverage
7. **Frontend SonarQube Analysis** - Analyze frontend code quality
8. **Quality Gate** - Check SonarQube quality gate status
9. **Package Backend** - Create JAR file
10. **Run Application** - Display run instructions

## Prerequisites

### 1. Jenkins Installation

```bash
# macOS
brew install jenkins-lts
brew services start jenkins-lts

# Linux (Ubuntu/Debian)
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

Access Jenkins at: http://localhost:8080

### 2. Required Jenkins Plugins

Install these plugins via Jenkins UI (Manage Jenkins → Manage Plugins):

**Essential Plugins:**
- Pipeline
- Git
- Maven Integration
- NodeJS
- JaCoCo
- SonarQube Scanner
- HTML Publisher
- JUnit

**Installation Steps:**
1. Go to: Manage Jenkins → Manage Plugins
2. Click "Available" tab
3. Search for each plugin
4. Check the box and click "Install without restart"

### 3. Configure Tools in Jenkins

#### Configure JDK 17

1. Go to: Manage Jenkins → Global Tool Configuration
2. Scroll to "JDK"
3. Click "Add JDK"
4. Name: `JDK 17`
5. Uncheck "Install automatically" if you have JDK 17 installed
6. JAVA_HOME: `/opt/homebrew/opt/openjdk@17` (macOS) or `/usr/lib/jvm/java-17-openjdk` (Linux)
7. Click "Save"

#### Configure Maven

1. In Global Tool Configuration
2. Scroll to "Maven"
3. Click "Add Maven"
4. Name: `Maven 3.8`
5. Check "Install automatically"
6. Version: Select latest 3.8.x
7. Click "Save"

#### Configure NodeJS

1. In Global Tool Configuration
2. Scroll to "NodeJS"
3. Click "Add NodeJS"
4. Name: `NodeJS 18`
5. Check "Install automatically"
6. Version: Select 18.x
7. Click "Save"

### 4. Configure SonarQube

#### Install SonarQube (Docker - Easiest)

```bash
# Start SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Wait 2-3 minutes for startup
# Access: http://localhost:9000
# Default credentials: admin/admin
```

#### Configure SonarQube in Jenkins

1. Go to: Manage Jenkins → Configure System
2. Scroll to "SonarQube servers"
3. Click "Add SonarQube"
4. Name: `SonarQube`
5. Server URL: `http://localhost:9000`
6. Server authentication token: (create in next step)
7. Click "Save"

#### Generate SonarQube Token

1. Login to SonarQube: http://localhost:9000
2. Go to: My Account → Security → Generate Token
3. Name: `jenkins`
4. Click "Generate"
5. Copy the token

#### Add Token to Jenkins

1. Go to: Manage Jenkins → Manage Credentials
2. Click "(global)" domain
3. Click "Add Credentials"
4. Kind: Secret text
5. Secret: (paste SonarQube token)
6. ID: `sonar-token`
7. Description: `SonarQube Token`
8. Click "OK"

## Creating the Pipeline Job

### 1. Create New Pipeline Job

1. Click "New Item"
2. Enter name: `springboot-angular-pipeline`
3. Select "Pipeline"
4. Click "OK"

### 2. Configure Pipeline

#### General Settings

- Description: `Spring Boot + Angular CI/CD Pipeline`
- Check "Discard old builds"
- Max # of builds to keep: `10`

#### Pipeline Configuration

1. Definition: `Pipeline script from SCM`
2. SCM: `Git`
3. Repository URL: (your git repository URL)
4. Credentials: (add if private repo)
5. Branch: `*/main` or `*/master`
6. Script Path: `Jenkinsfile`
7. Click "Save"

### 3. Alternative: Pipeline Script

If not using SCM, select "Pipeline script" and paste the Jenkinsfile content directly.

## Running the Pipeline

### Manual Trigger

1. Go to your pipeline job
2. Click "Build Now"
3. Watch the pipeline stages execute
4. Click on build number to see console output

### Automatic Triggers

#### Poll SCM

In pipeline configuration:
1. Check "Poll SCM"
2. Schedule: `H/5 * * * *` (every 5 minutes)

#### GitHub Webhook

1. In GitHub repository settings
2. Go to Webhooks
3. Add webhook: `http://your-jenkins-url/github-webhook/`
4. Content type: `application/json`
5. Events: `Just the push event`

## Pipeline Stages Explained

### Stage 1: Checkout
```groovy
checkout scm
```
Gets the latest code from your repository.

### Stage 2: Build Backend
```bash
mvn clean compile -DskipTests
```
Compiles Java code without running tests.

### Stage 3: Test Backend
```bash
mvn test jacoco:report
```
- Runs 28 JUnit tests
- Generates JaCoCo coverage report
- Expected: 28/28 tests pass, >70% coverage

### Stage 4: Backend SonarQube Analysis
```bash
mvn sonar:sonar
```
- Analyzes code quality
- Uploads coverage report
- Checks for bugs, vulnerabilities, code smells

### Stage 5: Build Frontend
```bash
npm install
```
Installs Angular dependencies.

### Stage 6: Test Frontend
```bash
npm run test:coverage
```
- Runs 28 Jest tests
- Generates coverage report
- Expected: 28/28 tests pass, >70% coverage

### Stage 7: Frontend SonarQube Analysis
```bash
npm run sonar
```
Analyzes frontend code quality.

### Stage 8: Quality Gate
```groovy
waitForQualityGate abortPipeline: false
```
Waits for SonarQube analysis to complete.

### Stage 9: Package Backend
```bash
mvn package -DskipTests
```
Creates JAR file: `target/springboot-angular-app-1.0.0.jar`

### Stage 10: Run Application
Displays instructions for running the application.

## Viewing Reports

### JaCoCo Coverage Report (Backend)

1. In build page, click "Coverage Report"
2. Or navigate to: `target/site/jacoco/index.html`

### Jest Coverage Report (Frontend)

1. In build page, click "Frontend Coverage Report"
2. Or navigate to: `frontend/coverage/lcov-report/index.html`

### SonarQube Reports

1. Go to: http://localhost:9000
2. View projects:
   - `springboot-angular-app` (backend)
   - `springboot-angular-app-frontend` (frontend)

## Troubleshooting

### Issue: "Tool 'JDK 17' does not exist"

**Solution:**
1. Go to: Manage Jenkins → Global Tool Configuration
2. Add JDK 17 as described above
3. Ensure the name matches exactly: `JDK 17`

### Issue: "Tool 'Maven 3.8' does not exist"

**Solution:**
1. Go to: Manage Jenkins → Global Tool Configuration
2. Add Maven as described above
3. Ensure the name matches exactly: `Maven 3.8`

### Issue: "Tool 'NodeJS 18' does not exist"

**Solution:**
1. Install NodeJS plugin
2. Configure NodeJS in Global Tool Configuration
3. Ensure the name matches exactly: `NodeJS 18`

### Issue: "SonarQube server 'SonarQube' does not exist"

**Solution:**
1. Configure SonarQube server in Jenkins
2. Add SonarQube token credential
3. Ensure names match exactly

### Issue: Tests fail

**Solution:**
1. Check console output for specific errors
2. Verify Java 17 is being used: Look for "Java Version" in logs
3. Run tests locally first: `mvn test`

### Issue: Coverage below 70%

**Solution:**
1. Check which classes are not covered
2. Add more test cases
3. Or adjust threshold in pom.xml

## Pipeline Customization

### Change Coverage Threshold

Edit `pom.xml`:
```xml
<minimum>0.70</minimum>  <!-- Change to desired percentage -->
```

### Skip SonarQube Analysis

Comment out SonarQube stages in Jenkinsfile:
```groovy
// stage('Backend SonarQube Analysis') { ... }
// stage('Frontend SonarQube Analysis') { ... }
// stage('Quality Gate') { ... }
```

### Add Deployment Stage

Add after "Package Backend" stage:
```groovy
stage('Deploy') {
    steps {
        sh '''
            # Copy JAR to deployment location
            cp target/*.jar /path/to/deploy/
            
            # Restart service
            systemctl restart springboot-app
        '''
    }
}
```

## Best Practices

1. **Always run tests before merging** - Use branch protection
2. **Monitor SonarQube quality gate** - Don't merge if it fails
3. **Keep coverage above 70%** - Add tests for new code
4. **Review SonarQube issues** - Fix critical bugs and vulnerabilities
5. **Archive artifacts** - Keep JAR files for rollback
6. **Use semantic versioning** - Update version in pom.xml

## Pipeline Execution Time

Expected execution times:
- Checkout: ~5 seconds
- Build Backend: ~30 seconds
- Test Backend: ~15 seconds
- Backend SonarQube: ~20 seconds
- Build Frontend: ~60 seconds (first time), ~10 seconds (cached)
- Test Frontend: ~20 seconds
- Frontend SonarQube: ~15 seconds
- Quality Gate: ~10 seconds
- Package: ~20 seconds

**Total: ~3-5 minutes**

## Summary

The Jenkins pipeline automates:
- ✅ Building both backend and frontend
- ✅ Running 56 test cases (28 backend + 28 frontend)
- ✅ Generating coverage reports (>70% threshold)
- ✅ SonarQube code quality analysis
- ✅ Creating deployable JAR artifact
- ✅ Publishing HTML reports

All stages are automated and provide immediate feedback on code quality and test coverage!