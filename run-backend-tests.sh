#!/bin/bash

echo "=========================================="
echo "Spring Boot Backend - Test & Coverage"
echo "=========================================="
echo ""

# Set Java 17
echo "Step 1: Setting Java 17..."
if [ -x "/usr/libexec/java_home" ]; then
    # macOS
    export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
    if [ -z "$JAVA_HOME" ]; then
        echo "❌ Java 17 not found! Please install it first."
        echo "Run: brew install openjdk@17"
        exit 1
    fi
else
    # Linux - try to find Java 17
    JAVA_17_HOME=$(find /usr/lib/jvm -name "java-17-*" -type d 2>/dev/null | head -n 1)
    if [ -n "$JAVA_17_HOME" ]; then
        export JAVA_HOME="$JAVA_17_HOME"
    else
        echo "⚠️  Warning: Could not auto-detect Java 17"
        echo "Please set JAVA_HOME manually:"
        echo "  export JAVA_HOME=/path/to/java-17"
    fi
fi

export PATH="$JAVA_HOME/bin:$PATH"
echo "Using Java: $(java -version 2>&1 | head -n 1)"
echo ""

# Clean and run tests
echo "Step 2: Running tests..."
mvn clean test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi

echo ""
echo "✅ Tests passed!"
echo ""

# Generate JaCoCo coverage report
echo "Step 2: Generating coverage report..."
mvn jacoco:report

if [ $? -ne 0 ]; then
    echo "❌ Coverage report generation failed!"
    exit 1
fi

echo ""
echo "✅ Coverage report generated!"
echo ""

# Check coverage threshold
echo "Step 3: Checking coverage threshold (70%)..."
mvn jacoco:check

if [ $? -ne 0 ]; then
    echo "⚠️  Coverage threshold not met!"
else
    echo "✅ Coverage threshold met!"
fi

echo ""
echo "=========================================="
echo "Reports Generated:"
echo "=========================================="
echo "📊 JaCoCo Coverage Report: target/site/jacoco/index.html"
echo "📋 Surefire Test Report: target/surefire-reports/"
echo ""
echo "To view the coverage report, open:"
echo "  open target/site/jacoco/index.html"
echo ""
echo "To run SonarQube analysis:"
echo "  mvn sonar:sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.login=your-token"
echo ""

# Made with Bob
