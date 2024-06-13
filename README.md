# DSM-G08-PI3-2024-1
Repositório do GRUPO 08 do Projeto Interdisciplinar do 3º semestre DSM 2024/1. Alunos: Kefflen Moreno Ramos, Leonardo Victor Pereira Ferreira, Paula Cristina Abib Teixeira

Inserindo o link do nosso layout no figma desenvolvido por Leonardo Victor. Layout: https://www.figma.com/file/uju9uhFdj2umnwT2Pog26y/P.I-3-SEMESTRE?type=design&node-id=0-1&mode=design&t=VTbxjJ49sVkEZe3J-0

deploy: https://dsm-g08-pi-3-2024-1.vercel.app/login
deploy de Backend: https://saude-on-api.vercel.app/

# Projeto SaudeOn
O projeto em si está voltado para a criação de um chatbot que proporciona atendimento online aos pacientes. Essa solução visou criar uma solução que permitisse, via chatbot, a conversa direta do paciente com médicos e atendentes, sem a necessidade de se deslocar até o local. Nosso foco está na simplificação e agilização do processo de agendamento de consultas, consulta de horários e obtenção de informações sobre exames. O chatbot visou complementar e facilitar os processos tradicionais de atendimento, proporcionando uma solução mais rápida e acessível para os pacientes.

## Estrutura do Projeto

- **backend/**: Implementa as tecnologias e funcionalidades como Express, WebSockets, JWT, autenticação, Mongoose, e TypeScript.
- **frontend/**: Implementa Next.js, autenticação com JWT e WebSockets.

## Requisitos

Antes de iniciar, certifique-se de ter o Node.js e o npm instalados em sua máquina.

### Backend

#### Configuração e Execução

1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências necessárias:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis (ajuste conforme necessário):
   ```env
   PORT=
   DATABASE_URL=
   JWT_SECRET=
   ENV=
   ADMIN_EMAIL=
   ADMIN_PASSWORD=
   ```

4. Inicie o servidor backend:
   ```bash
   npm start
   ```

### Frontend

#### Configuração e Execução

1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências necessárias:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env.local` na raiz da pasta `frontend` com as seguintes variáveis (ajuste conforme necessário):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Tecnologias Utilizadas

### Backend
- **Express**: Framework web para Node.js.
- **WebSockets**: Para comunicação em tempo real.
- **JWT (JSON Web Token)**: Para autenticação e autorização.
- **Mongoose**: Modelagem de dados para MongoDB.
- **TypeScript**: Superset do JavaScript que adiciona tipos estáticos.

### Frontend
- **Next.js**: Framework React para renderização do lado do servidor.
- **JWT (JSON Web Token)**: Para autenticação e autorização.
- **WebSockets**: Para comunicação em tempo real.

## Contribuição
- Kefflen Moreno Ramos
- Leonardo Victor Pereira
- Paula Cristina Abib Teixeira
