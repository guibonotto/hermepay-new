Herme Pay - Project H -  Gateway de pagamento

Nome dos participanes do projeto:
Guilherme Bonotto Gama
Gabriel Kallmeyer
João Victor Fagundi Dziecinny
Felipe Engler
Eduardo Affonso Zacarias

link github: https://github.com/guibonotto/hermepay-new

## Artefatos no Docker Hub

Aqui estão os links para as imagens Docker publicadas:

* **Microserviço de Lojas:** [Link para ms-lojas](https://hub.docker.com/r/guibonotto7/ms-lojas)
* **Microserviço de Transações:** [Link para ms-transacoes](https://hub.docker.com/r/guibonotto7/ms-transacoes)
* **BFF:** [Link para bff-node](https://hub.docker.com/r/guibonotto7/bff-node)

## Link do arquivo contendo atualizações no C4 Model, Arc42 
https://pucpredu.sharepoint.com/:w:/t/6PERIODOBES/EVQCbdFHOuZEluQo-yZ8vwoBhX8kw-1DWdM7XcCk55JcOw?e=n89zhk

## link do arquivo para  Software Architecture Canvas
https://pucpredu.sharepoint.com/:i:/t/6PERIODOBES/EamHEwiiIt5Ng04YbbOaBS8BGG9o-fkVoQHEm86f8QeO3g?e=MVdJjO

# Herme Pay - Gateway de Pagamento com Microserviços

Este projeto é uma implementação de referência de um Gateway de Pagamento utilizando arquitetura de Microserviços, Event-Driven Architecture e BFF (Backend for Frontend).

O sistema permite o cadastro de lojas, processamento de transações financeiras (com simulação de aprovação/recusa) e visualização de métricas em tempo real.

---

## 🏗️ Arquitetura do Projeto

O sistema foi desenvolvido seguindo os princípios de **Clean Architecture** e **Vertical Slice Architecture** (no serviço de transações), garantindo desacoplamento e testabilidade.

### Componentes Principais

1.  **API Gateway (Node.js):** Porta de entrada única (Reverse Proxy). Gerencia o roteamento e CORS.
2.  **BFF - Backend for Frontend (Node.js):** Atua como orquestrador, agregando dados de múltiplos serviços para o frontend e simplificando a comunicação.
3.  **Microserviço de Lojas (Node.js + MongoDB):** Gerencia o cadastro de lojas, contas bancárias e webhooks.
4.  **Microserviço de Transações (Node.js + Azure SQL):** Gerencia o histórico de transações e estatísticas financeiras. Implementado com **Vertical Slice Architecture**.
5.  **Event-Driven Engine (Azure Functions + Service Bus):**
    * `fn-http-trigger`: Recebe a requisição de pagamento, aplica regras de negócio e publica um evento.
    * `fn-event-trigger`: Consome o evento da fila e persiste o resultado no banco SQL de forma assíncrona.
6.  **Frontend (Angular):** Aplicação SPA (Single Page Application) com autenticação JWT e dashboard interativo.

### Diagrama de Arquitetura (Resumo)

`Angular` <-> `API Gateway` <-> `BFF` <-> [`MS-Lojas`, `MS-Transações`, `Azure Functions`]

---

## 🚀 Tecnologias Utilizadas

* **Linguagem:** Node.js (Backend), TypeScript (Frontend).
* **Frameworks:** Express.js, Angular 17+.
* **Bancos de Dados:** MongoDB Atlas (NoSQL), Azure SQL Database (Relacional).
* **Nuvem/Serverless:** Azure Functions, Azure Service Bus.
* **Containerização:** Docker.
* **Testes:** Jest (Testes Unitários).


## 🛠️ Como Rodar o Projeto Localmente

O projeto consiste em 6 serviços que devem rodar simultaneamente.

### Pré-requisitos
* Node.js (v18+)
* Docker Desktop (opcional, para rodar via container)
* Azure Functions Core Tools

### Passos para Execução

1.  **API Gateway (Porta 8080):**
    ```bash
    cd api-gateway && npm run dev
    ```
2.  **BFF (Porta 3000):**
    ```bash
    cd bff-node && npm run dev
    ```
3.  **MS-Lojas (Porta 3001):**
    ```bash
    cd ms-lojas && npm run dev
    ```
4.  **MS-Transações (Porta 3002):**
    ```bash
    cd ms-transacoes && npm run dev
    ```
5.  **Azure Function 1 (Porta 7071):**
    ```bash
    cd fn-http-trigger && func start
    ```
6.  **Azure Function 2 (Porta 7072):**
    ```bash
    cd fn-event-trigger && func start --port 7072
    ```
7.  **Frontend (Porta 4200):**
    ```bash
    cd hermepay-frontend && ng serve --open
    ```

---

## 🧪 Testes Automatizados

Para executar os testes unitários do microserviço de transações:

```bash
cd ms-transacoes
npm test

