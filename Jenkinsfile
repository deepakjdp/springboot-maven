pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8'
        nodejs 'NodeJS 18'
        jdk 'JDK 17'
    }
    
    environment {
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_TOKEN = credentials('sonar-token')
        JAVA_HOME = tool 'JDK 17'
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '=========================================='
                echo 'Stage 1: Checking out code'
                echo '=========================================='
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo '=========================================='
                echo 'Stage 2: Building Spring Boot Backend'
                echo '=========================================='
                script {
                    sh '''
                        echo "Java Version:"
                        java -version
                        echo "Maven Version:"
                        mvn -version
                        echo "Building backend..."
                        mvn clean compile -DskipTests
                    '''
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                echo '=========================================='
                echo 'Stage 3: Running Backend Tests'
                echo '=========================================='
                script {
                    sh '''
                        echo "Running JUnit tests with JaCoCo coverage..."
                        mvn test jacoco:report
                        echo "Tests completed!"
                    '''
                }
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: '**/target/jacoco.exec',
                        classPattern: '**/target/classes',
                        sourcePattern: '**/src/main/java',
                        exclusionPattern: '**/SpringBootAngularApplication.class'
                    )
                }
            }
        }
        
        
        
        stage('Quality Gate') {
            steps {
                echo '=========================================='
                echo 'Stage 8: Checking SonarQube Quality Gate'
                echo '=========================================='
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        
        stage('Package Backend') {
            steps {
                echo '=========================================='
                echo 'Stage 9: Packaging Spring Boot Application'
                echo '=========================================='
                script {
                    sh '''
                        echo "Creating JAR file..."
                        mvn package -DskipTests
                        echo "JAR created: target/springboot-angular-app-1.0.0.jar"
                    '''
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                }
            }
        }
        
        stage('Run Application') {
            steps {
                echo '=========================================='
                echo 'Stage 10: Running Application'
                echo '=========================================='
                script {
                    sh '''
                        echo "Starting Spring Boot application..."
                        echo "Application will run on http://localhost:8080"
                        echo "H2 Console: http://localhost:8080/h2-console"
                        echo ""
                        echo "To run manually:"
                        echo "  Backend: mvn spring-boot:run"
                        echo "  Frontend: cd frontend && npm start"
                        echo ""
                        echo "Note: In Jenkins, we don't actually start the app to avoid blocking the pipeline"
                        echo "The JAR file is ready at: target/springboot-angular-app-1.0.0.jar"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '=========================================='
            echo 'Pipeline Completed'
            echo '=========================================='
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo '=========================================='
            echo '✅ BUILD SUCCESSFUL'
            echo '=========================================='
            echo 'All stages completed successfully!'
            echo ''
            echo 'Reports Generated:'
            echo '  - Backend Coverage: target/site/jacoco/index.html'
            echo '  - Frontend Coverage: frontend/coverage/lcov-report/index.html'
            echo '  - SonarQube: ${SONAR_HOST_URL}'
            echo ''
            echo 'Artifacts:'
            echo '  - JAR: target/springboot-angular-app-1.0.0.jar'
        }
        failure {
            echo '=========================================='
            echo '❌ BUILD FAILED'
            echo '=========================================='
            echo 'Please check the logs above for errors'
        }
    }
}
