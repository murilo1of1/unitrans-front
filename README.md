# 🚌 UniTrans Frontend

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakraui&logoColor=white" alt="Chakra UI" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</div>

## 📋 Sobre o Projeto

**UniTrans Frontend** é a interface web completa do sistema de gerenciamento de transporte universitário que conecta **estudantes** e **empresas de transporte**. O sistema permite gestão de vínculos através de **tokens de acesso** (imediatos) ou **solicitações de vínculo** (com aprovação).

### 🎯 Funcionalidades Principais

- � **Autenticação unificada** para alunos e empresas
- � **Gestão de veículos** com upload de imagens
- � **Sistema de vínculos** aluno-empresa (via token ou solicitação)
- 📊 **Dashboard administrativo** para empresas
- 🏢 **Área do aluno** para gerenciar empresas vinculadas
- 📱 **Interface responsiva** e moderna

---

## 🛠️ **Tecnologias Utilizadas**

- **Frontend:** Next.js 14 + React 18
- **UI Library:** Chakra UI v3
- **Autenticação:** JWT + localStorage
- **HTTP Client:** Axios
- **Upload:** File API nativa
- **Estilização:** CSS Modules + Chakra UI

---

## 🚀 **Como Executar**

```bash
# Clone o repositório
git clone <repository-url>
cd unitrans-front

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# Execute o projeto
npm run dev

# Acesse http://localhost:3000
```

---

## 📝 **Scripts Disponíveis**

```bash
npm run dev          # Executa servidor de desenvolvimento
npm run build        # Gera build de produção
npm run start        # Executa build de produção
npm run lint         # Executa ESLint
```

---

<div align="center">
  <p>Desenvolvido para facilitar o transporte universitário</p>
</div>
