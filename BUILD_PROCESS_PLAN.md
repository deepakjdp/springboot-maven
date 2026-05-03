# Build Process Plan - Spring Boot Application with SAST & DAST

## Document Information
- **Project:** Spring Boot Angular Application
- **Version:** 1.0.0
- **Date:** 2026-05-02
- **Author:** DevOps Team
- **Purpose:** Comprehensive build process documentation with security testing

---

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Build Pipeline Architecture](#build-pipeline-architecture)
4. [Stage-by-Stage Plan](#stage-by-stage-plan)
5. [Security Testing Strategy](#security-testing-strategy)
6. [Quality Gates](#quality-gates)
7. [Deployment Strategy](#deployment-strategy)
8. [Rollback Plan](#rollback-plan)
9. [Monitoring & Alerts](#monitoring--alerts)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## 1. Overview

### 1.1 Project Description
Spring Boot REST API application with comprehensive security testing integrated into the CI/CD pipeline.

### 1.2 Build Objectives
- ✅ Automated compilation and testing
- ✅ Code quality analysis (SonarQube)
- ✅ Security vulnerability scanning (SAST & DAST)
- ✅ Artifact generation and archiving
- ✅ Automated deployment readiness

### 1.3 Technology Stack
- **Backend:** Spring Boot 3.1.5, Java 17
- **Build Tool:** Maven 3.8+
- **CI/CD:** Jenkins
- **Code Quality:** SonarQube
- **Security Testing:** OWASP Dependency Check, SpotBugs, PMD, OWASP ZAP
- **Testing:** JUnit 5, Mockito, JaCoCo

---

## 2. Prerequisites

### 2.1 Development Environment
```bash
# Required Software
- Java 17 (OpenJDK or Oracle JDK)
- Maven 3.8+
- Git 2.x+
- Docker (optional, for containerized tools)

# Verify Installation
java -version    # Should show Java 17
mvn -version     # Should show Maven 3.8+
git --version    # Should show Git 2.x+
```

### 2.2 Jenkins Setup
```yaml
Required Plugins:
  - Pipeline Plugin
  - Git Plugin
  - Maven Integration Plugin
  - JaCoCo Plugin
  - SonarQube Scanner Plugin
  - HTML Publisher Plugin
  - OWASP Dependency-Check Plugin
  - JUnit Plugin

Required Tools Configuration:
  - JDK 17: /path/to/jdk-17
  - Maven 3.8: Auto-install or /path/to/maven
  - SonarQube Server: http://localhost:9000
```

### 2.3 SonarQube Setup
```bash
# Start SonarQube (Docker)
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Access: http://localhost:9000
# Default credentials: admin/admin

# Create Project:
- Project Key: springboot-angular-app
- Generate Token: Save as Jenkins credential 'sonar-token'
```

### 2.4 Security Tools Setup
```bash
# OWASP Dependency Check (Maven plugin - already in pom.xml)
# SpotBugs (Maven plugin - already in pom.xml)
# PMD (Maven plugin - already in pom.xml)

# OWASP ZAP (Optional - for enhanced DAST)
brew install --cask owasp-zap  # macOS
# or
docker pull owasp/zap2docker-stable
```

---

## 3. Build Pipeline Architecture

### 3.1 Pipeline Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                    JENKINS CI/CD PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [1] Checkout → [2] Build → [3] Test → [4] SonarQube           │
│                                                                  │
│  [5] SAST: Dependency Check → [6] SAST: Security Scan          │
│                                                                  │
│  [7] Quality Gate → [8] Package                                 │
│                                                                  │
│  [9] DAST: Deploy → [10] DAST: ZAP Scan → [11] Summary         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Pipeline Stages (11 Total)

| Stage | Name | Duration | Critical | Description |
|-------|------|----------|----------|-------------|
| 1 | Checkout | ~5s | Yes | Clone repository |
| 2 | Build Backend | ~30s | Yes | Compile Java code |
| 3 | Test Backend | ~15s | Yes | Run unit tests + coverage |
| 4 | Backend SonarQube | ~20s | Yes | Code quality analysis |
| 5 | SAST - Dependency Check | ~60s | No | Scan vulnerable dependencies |
| 6 | SAST - Security Scanning | ~30s | No | SpotBugs + PMD security |
| 7 | Quality Gate | ~10s | Yes | SonarQube quality gate |
| 8 | Package Backend | ~20s | Yes | Create JAR artifact |
| 9 | DAST - Deploy | ~30s | No | Start app for testing |
| 10 | DAST - ZAP Scan | ~120s | No | Dynamic security scan |
| 11 | Security Summary | ~5s | No | Report generation |

**Total Pipeline Duration:** ~5-7 minutes

---

## 4. Stage-by-Stage Plan

### Stage 1: Checkout
**Purpose:** Retrieve source code from version control

**Actions:**
```groovy
checkout scm
```

**Success Criteria:**
- ✅ Repository cloned successfully
- ✅ Correct branch checked out
- ✅ All files present

**Failure Handling:**
- Retry checkout (max 3 attempts)
- Alert team if repository unavailable

---

### Stage 2: Build Backend
**Purpose:** Compile Java source code

**Actions:**
```bash
mvn clean compile -DskipTests
```

**Success Criteria:**
- ✅ All Java files compile without errors
- ✅ Dependencies downloaded successfully
- ✅ Target directory created

**Failure Handling:**
- Check Java version (must be 17)
- Verify Maven settings
- Check for syntax errors in code

**Artifacts Generated:**
- `target/classes/` - Compiled bytecode

---

### Stage 3: Test Backend
**Purpose:** Execute unit tests and generate coverage reports

**Actions:**
```bash
mvn test jacoco:report
```

**Success Criteria:**
- ✅ All tests pass (28/28)
- ✅ Code coverage ≥ 70%
- ✅ JaCoCo report generated

**Failure Handling:**
- Identify failing tests
- Check test logs
- Verify test data setup

**Artifacts Generated:**
- `target/surefire-reports/` - Test results (XML)
- `target/site/jacoco/` - Coverage report (HTML)
- `target/jacoco.exec` - Coverage data

**Quality Metrics:**
- Line Coverage: ≥ 70%
- Branch Coverage: ≥ 60%
- Test Success Rate: 100%

---

### Stage 4: Backend SonarQube Analysis
**Purpose:** Analyze code quality and security

**Actions:**
```bash
mvn sonar:sonar \
  -Dsonar.projectKey=springboot-angular-app \
  -Dsonar.host.url=${SONAR_HOST_URL} \
  -Dsonar.login=${SONAR_TOKEN}
```

**Success Criteria:**
- ✅ Analysis completed successfully
- ✅ Results uploaded to SonarQube
- ✅ No critical issues found

**Metrics Analyzed:**
- Code Smells
- Bugs
- Vulnerabilities
- Security Hotspots
- Code Coverage
- Duplications
- Technical Debt

**Failure Handling:**
- Check SonarQube server availability
- Verify token credentials
- Review analysis logs

---

### Stage 5: SAST - Dependency Check
**Purpose:** Identify vulnerable dependencies

**Actions:**
```bash
mvn org.owasp:dependency-check-maven:check \
  -DfailBuildOnCVSS=7 \
  -DsuppressionFiles=dependency-check-suppressions.xml
```

**Success Criteria:**
- ✅ All dependencies scanned
- ✅ No critical vulnerabilities (CVSS ≥ 7)
- ✅ Report generated

**Vulnerabilities Checked:**
- CVE database lookup
- NVD (National Vulnerability Database)
- Known security issues

**Failure Handling:**
- Review vulnerable dependencies
- Update to secure versions
- Add suppressions for false positives

**Artifacts Generated:**
- `target/dependency-check-report.html`
- `target/dependency-check-report.json`

---

### Stage 6: SAST - Security Scanning
**Purpose:** Static code security analysis

**Actions:**
```bash
# SpotBugs Security Analysis
mvn compile spotbugs:check -Dspotbugs.failOnError=false

# PMD Security Analysis
mvn pmd:check -Dpmd.failOnViolation=false
```

**Success Criteria:**
- ✅ SpotBugs analysis completed
- ✅ PMD analysis completed
- ✅ No high-severity issues

**Security Issues Detected:**
- SQL Injection vulnerabilities
- XSS (Cross-Site Scripting)
- Insecure cryptography
- Hardcoded credentials
- Path traversal issues
- Null pointer dereferences

**Failure Handling:**
- Review security findings
- Fix critical issues
- Document accepted risks

**Artifacts Generated:**
- `target/spotbugs/spotbugsXml.html`
- `target/pmd.html`

---

### Stage 7: Quality Gate
**Purpose:** Enforce quality standards

**Actions:**
```groovy
timeout(time: 5, unit: 'MINUTES') {
    waitForQualityGate abortPipeline: false
}
```

**Quality Gate Conditions:**
- Coverage on New Code ≥ 80%
- Duplicated Lines ≤ 3%
- Maintainability Rating ≥ A
- Reliability Rating ≥ A
- Security Rating ≥ A

**Success Criteria:**
- ✅ Quality gate status: PASSED
- ✅ All conditions met

**Failure Handling:**
- `abortPipeline: false` - Continue but flag
- Review failed conditions
- Plan remediation

---

### Stage 8: Package Backend
**Purpose:** Create deployable artifact

**Actions:**
```bash
mvn package -DskipTests
```

**Success Criteria:**
- ✅ JAR file created
- ✅ Artifact size reasonable
- ✅ Manifest file correct

**Artifacts Generated:**
- `target/springboot-angular-app-1.0.0.jar` (Executable JAR)
- `target/springboot-angular-app-1.0.0.jar.original` (Original JAR)

**Artifact Details:**
- Size: ~30-50 MB
- Type: Executable JAR (Spring Boot)
- Includes: All dependencies

**Failure Handling:**
- Check disk space
- Verify Maven configuration
- Review packaging logs

---

### Stage 9: DAST - Deploy for Testing
**Purpose:** Start application for dynamic testing

**Actions:**
```bash
# Kill existing instances
pkill -f "springboot-angular-app" || true

# Start application
nohup java -jar target/springboot-angular-app-1.0.0.jar > app.log 2>&1 &
APP_PID=$!
echo $APP_PID > app.pid

# Wait for startup (max 60 seconds)
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
        echo "Application ready!"
        break
    fi
    sleep 2
done
```

**Success Criteria:**
- ✅ Application starts successfully
- ✅ Health check returns 200 OK
- ✅ Port 8080 accessible

**Endpoints Verified:**
- `http://localhost:8080/actuator/health`
- `http://localhost:8080/api/users`

**Failure Handling:**
- Check application logs
- Verify port availability
- Check Java version
- Review startup errors

---

### Stage 10: DAST - ZAP Security Scan
**Purpose:** Dynamic application security testing

**Actions:**
```bash
# Using ZAP CLI
zap-cli start
zap-cli open-url http://localhost:8080
zap-cli spider http://localhost:8080
zap-cli active-scan http://localhost:8080
zap-cli report -o zap-report.html -f html

# Or using Docker
docker run -t owasp/zap2docker-stable \
  zap-baseline.py -t http://host.docker.internal:8080
```

**Success Criteria:**
- ✅ All endpoints scanned
- ✅ No critical vulnerabilities
- ✅ Report generated

**Vulnerabilities Tested:**
1. SQL Injection
2. XSS (Cross-Site Scripting)
3. CSRF (Cross-Site Request Forgery)
4. Security Headers
5. Authentication Issues
6. Session Management
7. Sensitive Data Exposure
8. XML External Entities (XXE)
9. Broken Access Control
10. Security Misconfiguration

**Failure Handling:**
- Review ZAP findings
- Prioritize by severity
- Fix critical issues
- Document accepted risks

**Artifacts Generated:**
- `zap-report.html` - Detailed findings
- `zap-report.json` - Machine-readable

**Post-Actions:**
```bash
# Stop application
kill $(cat app.pid)
rm app.pid
pkill -f "springboot-angular-app"
```

---

### Stage 11: Security Summary
**Purpose:** Consolidate security findings

**Actions:**
```bash
# Generate summary report
echo "Security Testing Summary"
echo "SAST: Completed"
echo "DAST: Completed"
echo "Reports: Available in Jenkins"
```

**Success Criteria:**
- ✅ All security tests completed
- ✅ Reports accessible
- ✅ Summary generated

**Reports Available:**
1. SonarQube Dashboard
2. OWASP Dependency Check Report
3. SpotBugs Security Report
4. PMD Analysis Report
5. OWASP ZAP DAST Report

---

## 5. Security Testing Strategy

### 5.1 SAST (Static Application Security Testing)

**Tools Used:**
1. **SonarQube**
   - Code quality and security
   - Continuous inspection
   - Quality gates

2. **OWASP Dependency Check**
   - CVE database scanning
   - Vulnerable dependencies
   - License compliance

3. **SpotBugs + FindSecBugs**
   - Bytecode analysis
   - Security bug patterns
   - Java-specific issues

4. **PMD**
   - Source code analysis
   - Security rules
   - Best practices

**SAST Coverage:**
- ✅ Code quality issues
- ✅ Security vulnerabilities
- ✅ Dependency vulnerabilities
- ✅ Code smells
- ✅ Technical debt

### 5.2 DAST (Dynamic Application Security Testing)

**Tools Used:**
1. **OWASP ZAP**
   - Active scanning
   - Passive scanning
   - Spider/crawler
   - OWASP Top 10 testing

**DAST Coverage:**
- ✅ Runtime vulnerabilities
- ✅ Authentication/Authorization
- ✅ Session management
- ✅ Input validation
- ✅ Security headers
- ✅ API security

### 5.3 Security Metrics

**Key Performance Indicators (KPIs):**
- Critical Vulnerabilities: 0
- High Vulnerabilities: < 5
- Medium Vulnerabilities: < 20
- Security Rating: A
- CVSS Score: < 7.0

---

## 6. Quality Gates

### 6.1 Code Quality Gates

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Code Coverage | ≥ 70% | Continue with warning |
| Duplicated Lines | ≤ 3% | Continue with warning |
| Maintainability Rating | ≥ A | Continue with warning |
| Reliability Rating | ≥ A | Continue with warning |
| Security Rating | ≥ A | Continue with warning |

### 6.2 Security Gates

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Critical Vulnerabilities | 0 | Review required |
| High Vulnerabilities | < 5 | Review required |
| CVSS Score | < 7.0 | Review required |
| Security Hotspots | Reviewed | Review required |

### 6.3 Test Gates

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Test Success Rate | 100% | Abort pipeline |
| Test Coverage | ≥ 70% | Continue with warning |
| Failed Tests | 0 | Abort pipeline |

---

## 7. Deployment Strategy

### 7.1 Artifact Management

**Artifact Storage:**
- Jenkins Artifact Repository
- Nexus/Artifactory (optional)
- Version-tagged artifacts

**Artifact Naming:**
```
springboot-angular-app-{version}-{build-number}.jar
Example: springboot-angular-app-1.0.0-42.jar
```

### 7.2 Deployment Environments

**Environment Progression:**
```
Development → Testing → Staging → Production
```

**Deployment Criteria:**
- ✅ All tests passed
- ✅ Quality gates passed
- ✅ Security scans completed
- ✅ Manual approval (for production)

### 7.3 Deployment Process

**Automated Deployment (Dev/Test):**
```bash
# Copy artifact
scp target/*.jar user@server:/opt/app/

# Restart service
ssh user@server 'systemctl restart springboot-app'

# Health check
curl http://server:8080/actuator/health
```

**Manual Deployment (Staging/Production):**
1. Download artifact from Jenkins
2. Backup current version
3. Deploy new version
4. Run smoke tests
5. Monitor logs
6. Rollback if issues

---

## 8. Rollback Plan

### 8.1 Rollback Triggers
- Application fails to start
- Health checks fail
- Critical errors in logs
- Performance degradation
- Security incidents

### 8.2 Rollback Procedure

**Quick Rollback:**
```bash
# Stop current version
systemctl stop springboot-app

# Restore previous version
cp /opt/app/backup/springboot-angular-app-previous.jar \
   /opt/app/springboot-angular-app.jar

# Start application
systemctl start springboot-app

# Verify
curl http://localhost:8080/actuator/health
```

**Jenkins Rollback:**
1. Identify last successful build
2. Download previous artifact
3. Redeploy previous version
4. Verify functionality

### 8.3 Rollback Testing
- Test rollback procedure quarterly
- Document rollback time (target: < 5 minutes)
- Maintain 3 previous versions

---

## 9. Monitoring & Alerts

### 9.1 Build Monitoring

**Metrics to Monitor:**
- Build success rate
- Build duration
- Test pass rate
- Code coverage trend
- Security vulnerabilities trend

**Dashboards:**
- Jenkins build history
- SonarQube project dashboard
- Security metrics dashboard

### 9.2 Alert Configuration

**Alert Triggers:**
- Build failure
- Test failure
- Quality gate failure
- Critical security vulnerability
- Deployment failure

**Alert Channels:**
- Email notifications
- Slack/Teams integration
- JIRA ticket creation

### 9.3 Application Monitoring

**Runtime Monitoring:**
- Application logs
- Performance metrics
- Error rates
- API response times
- Resource utilization

**Tools:**
- Spring Boot Actuator
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 10. Troubleshooting Guide

### 10.1 Common Build Issues

#### Issue: Java Version Mismatch
**Symptoms:**
```
Unsupported class file major version
```

**Solution:**
```bash
# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
java -version
```

#### Issue: Maven Dependency Download Failure
**Symptoms:**
```
Could not resolve dependencies
```

**Solution:**
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Force update
mvn clean install -U
```

#### Issue: Port Already in Use
**Symptoms:**
```
Port 8080 is already in use
```

**Solution:**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### 10.2 Security Scan Issues

#### Issue: Dependency Check Takes Too Long
**Solution:**
```bash
# Update CVE database separately
mvn dependency-check:update-only

# Then run check
mvn dependency-check:check
```

#### Issue: ZAP Scan Fails
**Solution:**
```bash
# Check if application is running
curl http://localhost:8080/actuator/health

# Check ZAP installation
which zap-cli

# Use Docker alternative
docker run -t owasp/zap2docker-stable \
  zap-baseline.py -t http://host.docker.internal:8080
```

### 10.3 Test Failures

#### Issue: Tests Fail Intermittently
**Solution:**
- Check for timing issues
- Review test isolation
- Check external dependencies
- Add proper waits/timeouts

#### Issue: Coverage Below Threshold
**Solution:**
- Identify uncovered code
- Add missing test cases
- Review exclusion patterns
- Adjust threshold if justified

---

## 11. Best Practices

### 11.1 Code Quality
- ✅ Write clean, maintainable code
- ✅ Follow coding standards
- ✅ Use meaningful variable names
- ✅ Add proper comments
- ✅ Keep methods small and focused

### 11.2 Testing
- ✅ Write tests before code (TDD)
- ✅ Aim for high coverage (>80%)
- ✅ Test edge cases
- ✅ Use meaningful test names
- ✅ Keep tests independent

### 11.3 Security
- ✅ Never commit secrets
- ✅ Use environment variables
- ✅ Keep dependencies updated
- ✅ Review security findings
- ✅ Follow OWASP guidelines

### 11.4 CI/CD
- ✅ Keep builds fast (<10 min)
- ✅ Fail fast on errors
- ✅ Automate everything
- ✅ Monitor build trends
- ✅ Document processes

---

## 12. Maintenance Schedule

### 12.1 Daily Tasks
- Monitor build status
- Review failed builds
- Check security alerts

### 12.2 Weekly Tasks
- Review code quality trends
- Update dependencies
- Review security findings
- Clean up old artifacts

### 12.3 Monthly Tasks
- Update security tools
- Review and update quality gates
- Performance optimization
- Documentation updates

### 12.4 Quarterly Tasks
- Major dependency updates
- Security audit
- Disaster recovery testing
- Process improvement review

---

## 13. Success Metrics

### 13.1 Build Metrics
- Build Success Rate: > 95%
- Average Build Time: < 7 minutes
- Test Pass Rate: 100%
- Code Coverage: > 70%

### 13.2 Security Metrics
- Critical Vulnerabilities: 0
- High Vulnerabilities: < 5
- Security Rating: A
- Time to Fix: < 24 hours

### 13.3 Quality Metrics
- Code Smells: < 50
- Technical Debt: < 5 days
- Duplications: < 3%
- Maintainability: A

---

## 14. Appendix

### 14.1 Useful Commands

```bash
# Build Commands
mvn clean compile                    # Compile only
mvn clean test                       # Run tests
mvn clean package                    # Create JAR
mvn clean install                    # Install to local repo

# Security Commands
mvn dependency-check:check           # Dependency scan
mvn spotbugs:check                   # SpotBugs scan
mvn pmd:check                        # PMD scan
mvn sonar:sonar                      # SonarQube scan

# Utility Commands
mvn dependency:tree                  # Show dependencies
mvn versions:display-dependency-updates  # Check updates
mvn clean                            # Clean build artifacts
```

### 14.2 Configuration Files

**Key Files:**
- `Jenkinsfile` - Pipeline definition
- `pom.xml` - Maven configuration
- `sonar-project.properties` - SonarQube config
- `dependency-check-suppressions.xml` - Suppression rules
- `application.properties` - App configuration

### 14.3 References

**Documentation:**
- Spring Boot: https://spring.io/projects/spring-boot
- Jenkins: https://www.jenkins.io/doc/
- SonarQube: https://docs.sonarqube.org/
- OWASP: https://owasp.org/

**Security Resources:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- CVE Database: https://cve.mitre.org/
- NVD: https://nvd.nist.gov/

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-02 | DevOps Team | Initial version |

**Review Schedule:** Quarterly
**Next Review:** 2026-08-02

---

**End of Build Process Plan**