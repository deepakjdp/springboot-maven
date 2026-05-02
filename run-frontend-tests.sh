#!/bin/bash

echo "=========================================="
echo "Angular Frontend - Test & Coverage"
echo "=========================================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Step 1: Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Dependency installation failed!"
        exit 1
    fi
    echo "✅ Dependencies installed!"
    echo ""
fi

# Run tests with coverage
echo "Step 2: Running tests with coverage..."
npm run test:coverage

if [ $? -ne 0 ]; then
    echo "❌ Tests failed or coverage threshold not met!"
    exit 1
fi

echo ""
echo "✅ Tests passed and coverage threshold met!"
echo ""

echo "=========================================="
echo "Reports Generated:"
echo "=========================================="
echo "📊 Jest Coverage Report: frontend/coverage/lcov-report/index.html"
echo "📋 Jest Test Results: Displayed above"
echo ""
echo "To view the coverage report, open:"
echo "  open frontend/coverage/lcov-report/index.html"
echo ""
echo "To run SonarQube analysis:"
echo "  cd frontend && npm run sonar -- -Dsonar.host.url=http://localhost:9000 -Dsonar.login=your-token"
echo ""

cd ..

# Made with Bob
