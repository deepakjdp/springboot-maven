#!/bin/bash

echo "=========================================="
echo "Full Stack Application - Complete Test Suite"
echo "=========================================="
echo ""

# Run backend tests
echo "🔧 BACKEND TESTING"
echo "=========================================="
bash run-backend-tests.sh

BACKEND_EXIT_CODE=$?

echo ""
echo ""

# Run frontend tests
echo "🎨 FRONTEND TESTING"
echo "=========================================="
bash run-frontend-tests.sh

FRONTEND_EXIT_CODE=$?

echo ""
echo ""
echo "=========================================="
echo "SUMMARY"
echo "=========================================="

if [ $BACKEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Backend: Tests passed, coverage threshold met"
else
    echo "❌ Backend: Tests failed or coverage threshold not met"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "✅ Frontend: Tests passed, coverage threshold met"
else
    echo "❌ Frontend: Tests failed or coverage threshold not met"
fi

echo ""
echo "=========================================="
echo "ALL REPORTS"
echo "=========================================="
echo "Backend Coverage: target/site/jacoco/index.html"
echo "Frontend Coverage: frontend/coverage/lcov-report/index.html"
echo ""

if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo "🎉 All tests passed with 70%+ coverage!"
    exit 0
else
    echo "⚠️  Some tests failed or coverage threshold not met"
    exit 1
fi

# Made with Bob
