#!/bin/bash

echo "=========================================="
echo "Setting Java 17 for Maven"
echo "=========================================="
echo ""

# Check current Java version
echo "Current Java version:"
java -version
echo ""

# Find Java 17
if [ -d "/Library/Java/JavaVirtualMachines" ]; then
    # macOS
    echo "Searching for Java 17 on macOS..."
    JAVA_17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
    
    if [ -n "$JAVA_17_HOME" ]; then
        echo "✅ Found Java 17 at: $JAVA_17_HOME"
        export JAVA_HOME="$JAVA_17_HOME"
        export PATH="$JAVA_HOME/bin:$PATH"
        echo ""
        echo "Java 17 is now active for this session:"
        java -version
        echo ""
        echo "To make this permanent, add to ~/.zshrc or ~/.bash_profile:"
        echo "export JAVA_HOME=\$(/usr/libexec/java_home -v 17)"
        echo "export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    else
        echo "❌ Java 17 not found!"
        echo ""
        echo "Available Java versions:"
        /usr/libexec/java_home -V
        echo ""
        echo "Please install Java 17:"
        echo "  brew install openjdk@17"
    fi
elif [ -d "/usr/lib/jvm" ]; then
    # Linux
    echo "Searching for Java 17 on Linux..."
    JAVA_17_HOME=$(find /usr/lib/jvm -name "java-17-*" -type d | head -n 1)
    
    if [ -n "$JAVA_17_HOME" ]; then
        echo "✅ Found Java 17 at: $JAVA_17_HOME"
        export JAVA_HOME="$JAVA_17_HOME"
        export PATH="$JAVA_HOME/bin:$PATH"
        echo ""
        echo "Java 17 is now active for this session:"
        java -version
        echo ""
        echo "To make this permanent, add to ~/.bashrc:"
        echo "export JAVA_HOME=$JAVA_17_HOME"
        echo "export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    else
        echo "❌ Java 17 not found!"
        echo ""
        echo "Please install Java 17:"
        echo "  sudo apt install openjdk-17-jdk"
    fi
else
    echo "❌ Unable to detect Java installation directory"
fi

echo ""
echo "=========================================="

# Made with Bob
