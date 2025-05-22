# 🎨 Fanation

> Sistema de Criação de Modelos com Montagem de Imagens em Camadas (EM DESENVOLVIMENTO)

[![Node Version][node-version-shield]][node-url]
[![React Version][react-version-shield]][react-url]
[![Vite Version][vite-version-shield]][vite-url]
[![TypeScript Version][typescript-version-shield]][typescript-url]

![Fanation Logo](/public/fanaticon-blue.png)

## 📋 Sobre o Projeto

Fanation é um sistema web para gerenciar recortes de produtos, permitindo visualizá-los em camadas que combinadas formam uma única imagem final. O aplicativo possibilita aos usuários:

- ✂️ Criar, editar e excluir recortes
- 🖼️ Fazer upload de imagens associadas aos recortes
- 🔄 Gerenciar a ordem de exibição das camadas
- 👁️ Visualizar a composição final dos modelos

## 🔧 Requisitos

- Node.js v22.11.0 ou superior
- npm v10.2.4 ou superior

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fanation.git
cd fanation

# Instale as dependências
npm install
```

## 💻 Uso

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Construa para produção
npm run build

# Visualize a versão de produção localmente
npm run preview
```

Por padrão, o servidor de desenvolvimento estará disponível em:
- 🌐 http://192.168.1.128:5175

## ✨ Recursos

- **Autenticação Segura**: Sistema de login para proteger o acesso
- **Dashboard Intuitivo**: Interface amigável para gerenciamento de recursos
- **Gerenciamento de Camadas**: Controle preciso da ordem de exibição dos recortes
- **Upload de Imagens**: Armazenamento e gerenciamento de imagens para os recortes
- **Interface Responsiva**: Design adaptado para diferentes tamanhos de tela
- **Visualização em Tempo Real**: Preview da composição final dos modelos

## 📁 Estrutura do Projeto

```
Fanation/
├── 📦 node_modules/            # Dependências do projeto
├── 🌐 public/                  # Arquivos estáticos públicos
│   ├── fanaticon-branca-full.png
│   ├── fanaticon-branca.png
│   ├── fanaticon-preta.png
│   ├── logo.ico
│   └── logo.png
├── 📂 src/
│   ├── 🖼️ assets/             # Recursos estáticos da aplicação
│   ├── 🧩 components/          # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   └── ui/                 # Componentes de UI
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── 🔄 contexts/            # Contextos do React
│   │   ├── AuthContext.tsx
│   │   └── AuthContextData.tsx
│   ├── 🪝 hooks/               # Custom hooks
│   ├── 📄 pages/               # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── 🛣️ router/              # Configuração de rotas
│   │   ├── AppRoutes.tsx
│   │   └── PrivateRoute.tsx
│   ├── 🔌 services/            # Serviços de API
│   ├── 🎨 styles/              # Estilos globais
│   │   └── index.css
│   ├── 📝 types/               # Tipos TypeScript
│   │   └── auth.ts
│   ├── 🛠️ utils/               # Funções utilitárias
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Ponto de entrada
│   └── vite-env.d.ts           # Tipos do Vite
├── 📝 .gitignore
├── ⚙️ eslint.config.js
├── 🌐 index.html
├── 📦 package.json
├── 📋 README.md
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
└── ⚙️ vite.config.ts
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [React](https://react.dev/) - Biblioteca UI
  - [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
  - [React Router](https://reactrouter.com/) - Roteamento

- **Ferramentas de Build**:
  - [Vite](https://vitejs.dev/) - Build tool e dev server
  - [ESLint](https://eslint.org/) - Linting de código
  - [TypeScript ESLint](https://typescript-eslint.io/) - Linting para TypeScript

- **Componentes**:
  - [Material-UI Icons](https://mui.com/material-ui/material-icons/) - Biblioteca de ícones

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Verificação de tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Visualização da build
npm run preview
```

## 🔐 Autenticação (EM DESENVOLVIMENTO)

O sistema atualmente utiliza uma autenticação simulada para fins de desenvolvimento:
- **Usuário**: admin@fanation.com
- **Senha**: admin

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas alterações (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 💬 Sobre o Desafio Técnico

Este projeto foi desenvolvido como parte de um desafio técnico focado em criar um sistema de gerenciamento de imagens em camadas que permite:

1. Armazenar e organizar recortes de imagens
2. Combinar os recortes em camadas ordenadas
3. Implementar um serviço de armazenamento para gerenciar imagens
4. Gerenciar a ordem de exibição das camadas com posicionamento CSS

---

Desenvolvido por [Felipe Medeiros](https://github.com/FelipeFMedeiros)

<!-- MARKDOWN LINKS & IMAGES -->
[node-version-shield]: https://img.shields.io/badge/node-v22.11.0+-green.svg
[node-url]: https://nodejs.org/
[react-version-shield]: https://img.shields.io/badge/react-v18.3.1-blue.svg
[react-url]: https://react.dev/
[vite-version-shield]: https://img.shields.io/badge/vite-v6.0.5-yellow.svg
[vite-url]: https://vitejs.dev/
[typescript-version-shield]: https://img.shields.io/badge/typescript-v5.6.2-blue.svg
[typescript-url]: https://www.typescriptlang.org/