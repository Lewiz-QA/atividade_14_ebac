pipeline {
    agent any
    
    options {
            ansiColor('xterm')
        }
    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/Lewiz-QA/atividade_14_ebac.git'
            }
        }
        stage('Instalar dependências') {
            steps {
                bat 'npm install'
            }
        }
        stage('Executar Cypress') {
            steps {
                bat 'npm run cy:run'
            }
        }
        stage('Gerar Relatório') {
            steps {
                bat 'npm run cy:report'
            }
        }
    }
}
