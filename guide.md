
### **Passo 1: Instalar as Ferramentas Essenciais (Pré-requisitos)**

Estas são as ferramentas base que você precisa ter instaladas no novo computador **antes** de qualquer outra coisa.

1.  **Git:** Para gerenciar o código.

      * **Download:** [https://git-scm.com/downloads](https://www.google.com/search?q=https://git-scm.com/downloads)
      * **Verificação:** Abra um terminal e digite `git --version`.

2.  **Node.js e npm:** Essencial para todos os nossos serviços de backend, functions e o frontend Angular. Instalar o Node.js já inclui o `npm` (Node Package Manager).

      * **Download:** [https://nodejs.org/](https://nodejs.org/) (Recomendo a versão **LTS** - Long Term Support).
      * **Verificação:** Abra um terminal e digite `node --version` e `npm --version`.

3.  **Docker Desktop:** Para rodar nossos microserviços e BFF containerizados (embora para desenvolvimento local, possamos rodá-los via `npm run dev`). É bom ter instalado de qualquer forma.

      * **Download:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
      * **Verificação:** Abra um terminal e digite `docker --version`. (Lembre-se que o Docker Desktop precisa estar **em execução**).
      * **Importante:** Após instalar o Docker, **reinicie o computador**.

4.  **Azure Functions Core Tools:** Para rodar as Functions (`fn-...`) localmente.

      * **Instalação (via npm):** Abra um terminal e digite `npm install -g azure-functions-core-tools@4`
      * **Verificação:** Abra um novo terminal e digite `func --version`.

5.  **Angular CLI:** Para rodar o frontend (`hermepay-frontend`).

      * **Instalação (via npm):** Abra um terminal e digite `npm install -g @angular/cli`
      * **Verificação:** Abra um novo terminal e digite `ng --version`.

6.  **VS Code (ou seu Editor Preferido):** Para visualizar e editar o código.

      * **Download:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

-----

### **Passo 2: Obter o Código-Fonte**

Você mencionou que já pegou do GitHub. Excelente\!

1.  **Clone o Repositório Principal:** Se você ainda não fez, clone o repositório que contém todos os projetos (o `PJBL-CLOUD`).
    ```bash
    git clone URL_DO_SEU_REPOSITORIO_PJBL_CLOUD
    cd PJBL-CLOUD
    ```
2.  **Abra no VS Code:** Abra a pasta `PJBL-CLOUD` no seu editor. Você deve ver todas as subpastas (`ms-lojas`, `ms-transacoes`, `bff-node`, `fn-http-trigger`, `fn-event-trigger`, `hermepay-frontend`).

-----

### **Passo 3: Configurar os Arquivos de Ambiente (CRUCIAL\!)**

Esta é a etapa mais propensa a erros. O código do GitHub **não** contém seus segredos (chaves de API, senhas de banco). Você precisa criá-los manualmente em cada projeto.

1.  **Para `ms-lojas`:**
      * Crie o arquivo `.env` na raiz do `ms-lojas`.
      * Adicione a variável `MONGODB_URI` com a sua string de conexão do MongoDB Atlas (incluindo usuário e senha).
2.  **Para `ms-transacoes`:**
      * Crie o arquivo `.env` na raiz do `ms-transacoes`.
      * Adicione a variável `AZURE_SQL_CONNECTION_STRING` com a sua string de conexão ADO.NET do Azure SQL (substituindo usuário e senha).
3.  **Para `bff-node`:**
      * Crie o arquivo `.env` na raiz do `bff-node`.
      * Adicione as variáveis:
          * `PORT=3000` (ou deixe sem para usar o padrão)
          * `SERVICE_LOJAS_URL=http://localhost:3001`
          * `SERVICE_TRANSACOES_URL=http://localhost:3002`
          * `FUNCTION_CREATE_TRANSACTION_URL=http://localhost:7071/api/CreateTransactionTrigger`
4.  **Para `fn-http-trigger`:**
      * Crie/Verifique o arquivo `local.settings.json`.
      * Dentro de `"Values"`, adicione/verifique:
          * `SERVICE_BUS_CONNECTION_STRING` (com sua chave do Service Bus)
          * `SERVICE_BUS_TOPIC_NAME="transacoes-topic"`
5.  **Para `fn-event-trigger`:**
      * Crie/Verifique o arquivo `local.settings.json`.
      * Dentro de `"Values"`, adicione/verifique:
          * `SERVICE_BUS_CONNECTION_STRING` (a mesma do Service Bus)
          * `AZURE_SQL_CONNECTION_STRING` (a mesma do Azure SQL)

**Verifique cada uma dessas strings e senhas com MUITO cuidado\!**

-----

### **Passo 4: Instalar as Dependências de Cada Projeto (`npm install`)**

Agora, precisamos instalar os pacotes `npm` para cada um dos seus 6 projetos.

Abra um terminal e execute `npm install` **dentro de cada uma das seguintes pastas**:

1.  `cd ms-lojas` -\> `npm install`
2.  `cd ../ms-transacoes` -\> `npm install`
3.  `cd ../bff-node` -\> `npm install`
4.  `cd ../fn-http-trigger` -\> `npm install`
5.  `cd ../fn-event-trigger` -\> `npm install`
6.  `cd ../hermepay-frontend` -\> `npm install`

-----

### **Passo 5: Executar Todos os Serviços (A Orquestra\!)**

Este é o momento da verdade. Você precisará de **6 terminais abertos** (um para cada serviço).

1.  **Terminal 1 (MS-Lojas):**

    ```bash
    cd ms-lojas
    npm run dev
    ```

    *(Deve rodar na porta 3001 e conectar ao MongoDB)*

2.  **Terminal 2 (MS-Transacoes):**

    ```bash
    cd ms-transacoes
    npm run dev
    ```

    *(Deve rodar na porta 3002 e conectar ao Azure SQL)*

3.  **Terminal 3 (Function 1):**

    ```bash
    cd fn-http-trigger
    func start
    ```

    *(Deve rodar na porta 7071)*

4.  **Terminal 4 (Function 2):**

    ```bash
    cd fn-event-trigger
    func start --port 7072
    ```

    *(Deve rodar na porta 7072 e ouvir o Service Bus)*

5.  **Terminal 5 (BFF):**

    ```bash
    cd bff-node
    npm run dev
    ```

    *(Deve rodar na porta 3000)*

6.  **Terminal 6 (Frontend):**

    ```bash
    cd hermepay-frontend
    ng serve --open
    ```

    *(Deve rodar na porta 4200 e abrir o navegador)*

-----

### **Passo 6: Verificação Final**

Com todos os 6 terminais rodando sem erros:

1.  **Acesse o Frontend:** Vá para `http://localhost:4200` no seu navegador. A página do dashboard deve carregar, mostrando os status "Online" e a lista de lojas (se houver alguma no MongoDB).
2.  **Teste o Fluxo de Transação (via Postman ou Frontend):** Tente criar uma transação através do BFF (`POST http://localhost:3000/api/transactions`). Observe os terminais das Functions e verifique se o dado aparece no Azure SQL.

Se tudo isso funcionar, seu ambiente no novo computador estará 100% configurado\! Boa sorte\!