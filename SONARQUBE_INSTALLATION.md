# SonarQube Installation Guide for macOS

## The Error You're Seeing

```
Error: No available formula with the name "sonarqube"
```

This error occurs because:
1. Homebrew is not installed on your system, OR
2. The SonarQube formula is not available in Homebrew

## Installation Options

### Option 1: Using Docker (Recommended - Easiest)

Docker is the easiest way to run SonarQube.

#### Step 1: Install Docker Desktop
1. Download Docker Desktop for Mac: https://www.docker.com/products/docker-desktop
2. Install the downloaded .dmg file
3. Start Docker Desktop from Applications
4. Wait for Docker to start (whale icon in menu bar)

#### Step 2: Run SonarQube
```bash
# Pull and run SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Wait 2-3 minutes for startup
# Check logs
docker logs -f sonarqube

# Access SonarQube
open http://localhost:9000
```

**Default credentials:** admin/admin (you'll be prompted to change on first login)

#### Managing SonarQube Container
```bash
# Stop SonarQube
docker stop sonarqube

# Start SonarQube
docker start sonarqube

# Remove SonarQube
docker rm -f sonarqube

# View logs
docker logs sonarqube
```

---

### Option 2: Using Homebrew

#### Step 1: Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions to add Homebrew to your PATH.

#### Step 2: Install SonarQube Scanner
```bash
# Install sonar-scanner (not sonarqube server)
brew install sonar-scanner

# Verify installation
sonar-scanner --version
```

**Note:** Homebrew doesn't provide the SonarQube server directly. You'll still need to run the server using Docker or manual installation.

---

### Option 3: Manual Installation (No Docker/Homebrew)

#### Step 1: Install Java 17
```bash
# Check if Java is installed
java -version

# If not installed, download from:
# https://www.oracle.com/java/technologies/downloads/#java17
```

#### Step 2: Download SonarQube
```bash
# Create directory
mkdir -p ~/sonarqube
cd ~/sonarqube

# Download SonarQube Community Edition
curl -O https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-10.3.0.82913.zip

# Extract
unzip sonarqube-10.3.0.82913.zip
cd sonarqube-10.3.0.82913
```

#### Step 3: Start SonarQube
```bash
# Start SonarQube
./bin/macosx-universal-64/sonar.sh start

# Check status
./bin/macosx-universal-64/sonar.sh status

# View logs
tail -f logs/sonar.log

# Access SonarQube
open http://localhost:9000
```

#### Step 4: Stop SonarQube
```bash
./bin/macosx-universal-64/sonar.sh stop
```

---

### Option 4: Use SonarCloud (No Local Installation)

SonarCloud is a cloud-based version of SonarQube - no installation needed!

#### Step 1: Sign Up
1. Go to https://sonarcloud.io
2. Sign up with GitHub, Bitbucket, or GitLab
3. Create an organization

#### Step 2: Generate Token
1. Go to: My Account → Security → Generate Token
2. Name: `local-analysis`
3. Copy the token

#### Step 3: Run Analysis
```bash
# Backend
mvn clean verify sonar:sonar \
  -Dsonar.organization=YOUR_ORG \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_TOKEN

# Frontend
cd frontend
npm run test:coverage
npm run sonar -- \
  -Dsonar.organization=YOUR_ORG \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_TOKEN
```

---

## Quick Start: Docker Method (Recommended)

If you want to get started quickly:

```bash
# 1. Install Docker Desktop from https://www.docker.com/products/docker-desktop

# 2. Start Docker Desktop

# 3. Run this command:
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# 4. Wait 2-3 minutes, then open:
open http://localhost:9000

# 5. Login with admin/admin

# 6. Generate a token:
#    My Account → Security → Generate Token

# 7. Run analysis:
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

---

## Running Your Project Analysis

Once SonarQube is running, analyze your project:

### Backend Analysis
```bash
# Generate coverage first
mvn clean test jacoco:report

# Run SonarQube analysis
mvn sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

### Frontend Analysis
```bash
cd frontend

# Generate coverage first
npm run test:coverage

# Run SonarQube analysis
npm run sonar -- \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN
```

---

## Troubleshooting

### Issue: Docker not starting
**Solution:** Ensure Docker Desktop is running (whale icon in menu bar)

### Issue: Port 9000 already in use
**Solution:**
```bash
# Find process using port 9000
lsof -ti:9000 | xargs kill -9

# Or use different port
docker run -d --name sonarqube -p 9001:9000 sonarqube:latest
```

### Issue: SonarQube not accessible after 5 minutes
**Solution:**
```bash
# Check logs
docker logs sonarqube

# Restart container
docker restart sonarqube
```

### Issue: Out of memory
**Solution:**
```bash
# Stop container
docker stop sonarqube
docker rm sonarqube

# Run with more memory
docker run -d --name sonarqube -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:latest
```

---

## Comparison of Options

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Docker** | Easy, isolated, portable | Requires Docker | Most users |
| **Homebrew** | Simple commands | Only scanner, not server | CLI tools only |
| **Manual** | Full control | Complex setup | Advanced users |
| **SonarCloud** | No installation | Requires internet, public repos | Quick testing |

---

## Recommended Approach

**For this project, I recommend:**

1. **Install Docker Desktop** (one-time setup)
2. **Run SonarQube in Docker** (easiest and most reliable)
3. **Use the provided scripts** to run tests and analysis

This gives you a local SonarQube instance that's easy to manage and doesn't require complex configuration.

---

## Next Steps

After installing SonarQube:

1. ✅ Start SonarQube server
2. ✅ Access http://localhost:9000
3. ✅ Login with admin/admin
4. ✅ Generate authentication token
5. ✅ Run backend analysis: `mvn clean verify sonar:sonar -Dsonar.login=TOKEN`
6. ✅ Run frontend analysis: `cd frontend && npm run sonar -- -Dsonar.login=TOKEN`
7. ✅ View results in SonarQube dashboard

---

## Summary

The error you encountered is because:
- Homebrew is not installed, OR
- You're trying to install the SonarQube server via Homebrew (which doesn't provide it)

**Solution:** Use Docker to run SonarQube - it's the easiest and most reliable method.

**Quick command:**
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Then access http://localhost:9000 after 2-3 minutes.