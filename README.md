# Node.js Search & Indexing Backend (`node-backend-busca`)

Este é um projeto nas etapas iniciais de desenvolvimento que simula um webcrawler simples e serviço de busca e indexação de websites desenvolvido em **Express** com **TypeScript**, utilizando o banco de dados **MongoDB**.
<br>
Comecei esse projeto com a intenção de aprender mais sobre tecnologias ligadas à Stack MEAN (Mongo; Express; Angular; Node.js).

## 📂 Estrutura Atual do Projeto 

```text
Search/
├── backend/
│   ├── dao/
│   │   ├── BaseDAO.ts         # DAO Genérico com tratamento de logs e conexão ativa
│   │   ├── database.ts        # Padrão Singleton para conexões do MongoDB
│   │   ├── FavoritoDAO.ts     # Operações de banco de dados para favoritos
│   │   ├── HistoricoDAO.ts    # Operações de banco de dados para histórico de busca
│   │   └── WebsiteDAO.ts      # Operações de banco de dados para websites indexados
│   ├── model/
│   │   ├── Favorito.ts        # Classe/Modelo de Favorito
│   │   ├── Historico.ts       # Classe/Modelo de Histórico de busca
│   │   └── Website.ts         # Classe/Modelo de Website
│   ├── types/
│   │   ├── Favorito.ts        # Definições de tipos e interfaces de Favoritos
│   │   ├── Historico.ts       # Definições de tipos e interfaces do Histórico
│   │   └── Website.ts         # Definições de tipos e interfaces de Websites
│   ├── server.ts              # Arquivo principal do servidor Express REST API
│   └── test_api.js            # Script de testes de integração com a API REST
├── frontend/                  # Diretório reservado para aplicação front-end
├── dist/                      # Diretório de build (código compilado gerado pelo tsc)
├── index.ts                   # Ponto de entrada CLI (testes locais via terminal sem REST)
├── package.json               # Gerenciador de dependências e scripts do projeto
├── tsconfig.json              # Configurações do compilador TypeScript
└── README.md                  # Documentação do projeto (este arquivo)
```

## Mais informações (o projeto ainda precisa de ajustes para ser utilizado de forma integral via Frontend);
No momento, é inicializável via:
- **Node.js** (versão 18 ou superior) instalado.
- **MongoDB** rodando localmente (na porta padrão `27017`)

### Instalação de Dependências
Clone o repositório, navegue até a pasta raiz do projeto e instale as dependências com o npm:
```bash
npm install
```

### Variáveis de Ambiente
Por padrão, o banco de dados tentará conectar na URI `mongodb://127.0.0.1:27017/searchdb`. Caso precise alterar para uma conexão personalizada, defina a variável de ambiente `MONGO_URL` antes de inicializar o servidor.

## Inicialização; execução

No arquivo [package.json], estão configurados os seguintes comandos principais:

### 1. Modo Desenvolvimento (`dev`)
Inicia o compilador TypeScript e reinicia automaticamente o servidor a cada alteração efetuada nos arquivos dentro da pasta `backend`:
```bash
npm run dev
```
*O servidor REST iniciará na porta **3001** (`http://localhost:3001`).*

### 2. Compilar o Projeto (`build`)
Compila todos os arquivos TypeScript (`.ts`) para Javascript (`.js`) nativo na pasta `/dist`:
```bash
npm run build
```

### 3. Modo Produção (`start`)
Executa o código previamente compilado na pasta `/dist/backend/server.js`:
```bash
npm run start
```

### 4. Executar Script CLI Local (`index.ts`)
Caso queira rodar os métodos diretamente no terminal de forma procedural (sem levantar o servidor Express), você pode usar o arquivo [index.ts](file:///c:/Users/pro/Desktop/Search/index.ts) executando-o através do compilador:
```bash
npx ts-node index.ts
```

### 5. Executar os Testes de Integração (`test`)
Com o servidor rodando localmente no modo desenvolvimento (`npm run dev`), abra outro terminal e execute o script de validação de rotas HTTP:
```bash
npm run test
```
*Este comando roda o script [test_api.js](file:///c:/Users/pro/Desktop/Search/backend/test_api.js), testando todas as operações do CRUD na REST API automaticamente.*

---

## 📡 Endpoints da API REST

O servidor Express roda em `http://localhost:3001` e disponibiliza as seguintes rotas HTTP:

### 🔎 Websites

#### 1. Cadastrar Website (Indexação)
Cria um novo website na base de dados para ser buscável.
- **Rota:** `POST /api/websites`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "titulo": "Google",
    "url": "https://google.com",
    "palavrasChave": ["busca", "pesquisa", "tech"],
    "descricao": "O mecanismo de busca mais famoso do mundo."
  }
  ```
- **Resposta (201 Created):**
  ```json
  {
    "message": "Website cadastrado com sucesso",
    "id": "64dcf3a89e9fbc0024f..."
  }
  ```

#### 2. Listar Todos ou Buscar Websites
Recupera os websites indexados. Aceita query parameters para filtragem por termos de busca.
- **Rota:** `GET /api/websites`
- **Parâmetros Opcionais (Query Parameters):**
  - `q` (string): Termo de busca que será pesquisado nas palavras-chave do site.
  - `usuario` (string): Nome do usuário realizando a busca (registra no histórico). Padrão se omitido: `'anonimo'`.
- **Exemplo de URL com busca:** `GET /api/websites?q=busca&usuario=joao123`
- **Resposta (200 OK):**
  ```json
  [
    {
      "_id": "64dcf3a89e9fbc0024f...",
      "titulo": "Google",
      "url": "https://google.com",
      "palavrasChave": ["busca", "pesquisa", "tech"],
      "descricao": "O mecanismo de busca mais famoso do mundo.",
      "dataIndex": "2026-07-28T17:00:00.000Z"
    }
  ]
  ```

#### 3. Obter Website por ID
Busca os detalhes de um único site com base em seu ID do banco de dados.
- **Rota:** `GET /api/websites/:id`
- **Resposta (200 OK):** Detalhes do website, ou `404 Not Found` caso não exista.

#### 4. Atualizar Website
Atualiza parcialmente ou integralmente os dados de um website indexado.
- **Rota:** `PUT /api/websites/:id`
- **Corpo da Requisição (JSON - campos opcionais):**
  ```json
  {
    "titulo": "Google Brasil",
    "descricao": "Mecanismo de busca otimizado para o Brasil."
  }
  ```
- **Resposta (200 OK):**
  ```json
  {
    "message": "Website updated successfully"
  }
  ```

#### 5. Deletar Website
Remove um website do índice de busca.
- **Rota:** `DELETE /api/websites/:id`
- **Resposta (200 OK):**
  ```json
  {
    "message": "Website removido com sucesso"
  }
  ```

---

### ⭐ Favoritos

#### 1. Adicionar Website aos Favoritos
Associa uma nota de classificação (rating) a um website indexado.
- **Rota:** `POST /api/favoritos`
- **Corpo da Requisição (JSON):**
  ```json
  {
    "websiteId": "64dcf3a89e9fbc0024f...",
    "nota": 9.5
  }
  ```
- **Resposta (201 Created):**
  ```json
  {
    "message": "Website favoritado com sucesso"
  }
  ```

---

### 🕒 Histórico de Buscas

#### 1. Listar Histórico de Pesquisas
Recupera o histórico completo com todas as buscas realizadas pela rota `GET /api/websites?q=...`.
- **Rota:** `GET /api/historico`
- **Resposta (200 OK):**
  ```json
  [
    {
      "_id": "64dd13bc9e9fbc0024f...",
      "termoBuscado": "busca",
      "usuario": "joao123",
      "data": "2026-07-28T17:01:05.123Z"
    }
  ]
  ```

---

## 🪵 Tratamento de Erros e Logs

Sempre que ocorre um erro interno em qualquer operação encapsulada pelo DAO, a exceção é registrada automaticamente no arquivo **`error.log`** na raiz do projeto com o seguinte formato:
```text
[2026-07-28T14:56:59.000Z] ERRO: Detalhes do erro ocorrido
Stack: ...stack trace completo do erro...
```
Isso facilita o debug da aplicação em ambiente de produção sem a necessidade de expor dados internos ou sensíveis para o usuário final da API.
