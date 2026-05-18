# StockMaster - um sistema de gestão de e-commerce

Sistema de gerenciamento de produtos para e-commerce, desenvolvido com Next.js, TypeScript e Prisma como parte da segunda entrega do Projeto Integrador: Análise De Soluções Integradas para Organizações para o curso de Análise e Desenvolvimento de Sistemas no Senac EAD.
O projeto oferece um painel administrativo para criar, editar, visualizar e excluir produtos, além de uma API interna para integração com a futura vitrine pública.

## Funcionalidades

- Autenticação de usuários (login/logout)
- Dashboard administrativo protegido
- CRUD completo de produtos (nome, descrição, preço, estoque, imagem)
- Validação de dados com Zod
- Persistência em banco de dados SQLite via Prisma ORM
- Interface responsiva com Tailwind CSS
- Utilização de Server Actions do Next.js para operações no servidor
- API RESTful para listagem e criação de produtos

## Tecnologias

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)



## Modelagem do Banco de Dados

O banco de dados relacional é composto por duas entidades principais, `User` e `Product`, com um relacionamento de um para muitos.

```mermaid
erDiagram
    User {
        int id PK
        string name
        string email
        string password
        string role
        datetime createdAt
        datetime updatedAt
    }
    Product {
        int id PK
        string name
        string description
        float price
        int stock
        string image
        int userId FK
        datetime createdAt
        datetime updatedAt
    }
    User ||--o{ Product : "gerencia"
```


Um **usuário** (vendedor ou administrador) pode gerenciar múltiplos **produtos**. A chave estrangeira `userId` na tabela `Product` estabelece esse vínculo.

## Pré-requisitos

- Node.js 18.17 ou superior
- npm ou yarn

## Configuração e Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/MariaCaru/e-commerce-manager.git
   cd e-commerce-manager
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Gere o cliente Prisma:
   ```bash
   npx prisma generate
   ```

## Executando o Projeto

Para rodar o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000/login` no navegador.

- Login admin@stockmaster.com
- Senha: 123

## Scripts Disponíveis

- `dev`: inicia o ambiente de desenvolvimento
- `build`: gera a versão de produção
- `start`: inicia o servidor em modo de produção
- `lint`: executa a verificação de código com ESLint

## Estrutura de Pastas

```
e-commerce-manager/
├── app/
│   ├── actions/         # Server Actions (productActions, etc.)
│   ├── api/
│   │   └── products/    # API Routes (REST)
│   ├── components/      # Componentes reutilizáveis
│   ├── dashboard/       # Páginas do painel administrativo
│   ├── login/           # Página de login
│   └── page.tsx         # Página inicial (vitrine)
├── lib/                 # Configuração do Prisma e utilitários
├── prisma/
│   ├── schema.prisma    # Modelo do banco de dados
│   └── dev.db           # Banco SQLite (gerado após migração)
├── public/              # Arquivos estáticos
├── utils/               # Funções auxiliares (formatação, etc.)
└── .env                 # Variáveis de ambiente
```


# Documentação Técnica: Backend e Arquitetura


## Testes 

**Base URL:** `http://localhost:3000`

## Endpoints disponíveis

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | /api/products | Lista todos os produtos |
| POST | /api/products | Cria um novo produto |
| PATCH | /api/products/:id | Atualiza um produto existente |
| DELETE | /api/products/:id | Deleta um produto |

### GET Listar todos os produtos

`http://localhost:3000/api/products`

Retorna a lista completa de todos os produtos cadastrados na plataforma.

**Resposta de sucesso (200 OK):**

``` json
[
  {
    "id": "cmpb8n8sa0004xv7w99648g8r",
    "name": "Produto Exemplo",
    "price": 29.90
  }
]

 ```

**Testes automatizados:**

- Status code é 200
- Tempo de resposta menor que 2000ms
- Corpo da resposta é um array
    
##### Exemplo

*Requisição*

`postman request 'http://localhost:3000/api/products'`

*Resposta*

``` json
[
    {
        "id": "cmp8fuqca0000erxk2wfwlna3",
        "name": "Mochila Masculina",
        "description": "",
        "category": "Acessórios",
        "price": 300,
        "quantity": 100,
        "image": "https://m.media-amazon.com/images/I/51sYkM0eKeL._AC_SX522_.jpg",
        "createdAt": "2026-05-16T14:25:25.979Z"
    },
    {
        "id": "cmp8fhew10000erwcz6eswv5c",
        "name": "Iphone 15",
        "description": "",
        "category": "Eletrônicos",
        "price": 17000,
        "quantity": 200,
        "image": "https://m.media-amazon.com/images/I/41RpmPYWXLL._AC_SX342_SY445_QL70_ML2_.jpg",
        "createdAt": "2026-05-16T14:15:04.605Z"
    },
    {
        "id": "cmp64y9hm0000era806bio0z1",
        "name": "Bolsa Feminina",
        "description": "",
        "category": "Acessórios",
        "price": 250,
        "quantity": 150,
        "image": "https://img.lojasrenner.com.br/item/930832621/original/3.jpg",
        "createdAt": "2026-05-14T23:44:42.634Z"
    },
    {
        "id": "cmp5zdc6g0000erjs0y2y7f8w",
        "name": "Tênis ",
        "description": "",
        "category": "Calaçados",
        "price": 5000,
        "quantity": 100,
        "image": "https://m.media-amazon.com/images/I/51GXKGCE8OL._AC_SY625_.jpg",
        "createdAt": "2026-05-14T21:08:28.264Z"
    },
    {
        "id": "cmp5yc9a70000erjgy1s0qowx",
        "name": "Iphone 15",
        "description": "",
        "category": "Eletrônico",
        "price": 17000,
        "quantity": 50,
        "image": "https://m.media-amazon.com/images/I/416MG51rNgL._AC_SX342_SY445_QL70_ML2_.jpg",
        "createdAt": "2026-05-14T20:39:38.235Z"
    }
]


```


### POST Criar um produto

Cria um novo produto na plataforma. O corpo da requisição deve conter os dados do produto a ser criado.

**Corpo da requisição (JSON):**

``` json
{
  "name": "Novo Produto",
  "price": 49.90
}

```

**Resposta de sucesso (201):**

``` json
{
  "id": "cmpb8n8sa0004xv7w99648g8r",
  "name": "Novo Produto",
  "price": 49.90
}


```

**Testes automatizados:**
- Status code é 201
- Tempo de resposta menor que 2000ms
- Corpo da resposta é um objeto

##### Exemplo

*Requisição*

``` json

postman request POST 'http://localhost:3000/api/products'
  --body '{
  "name": "Produto Teste",
  "description": "Descrição do produto",
  "category": "Categoria genérica",
  "price": 29.90,
  "quantity": 100,
  "image": "https://exemplo.com/imagem.jpg"
}
'

```

*Reposta*

``` json

{
    "id": "cmpb6nvzx0000xvqg4vpvx72a",
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "category": "Categoria genérica",
    "price": 29.9,
    "quantity": 100,
    "image": "https://exemplo.com/imagem.jpg",
    "createdAt": "2026-05-18T12:31:28.702Z"
}

```


### PATCH atualizar um produto

`http://localhost:3000/api/products/id`

Atualiza os dados de um produto existente. Substitua `:id` pelo identificador único do produto que deseja atualizar.

**Parâmetros de URL:**

- `id` (obrigatório): Identificador único do produto (ex: `cmpb8n8sa0004xv7w99648g8r`)
    

**Corpo da requisição (JSON):**

``` json
{
  "name": "Produto Atualizado",
  "price": 39.90
}

 ```

**Resposta de sucesso (200 OK):**

``` json
{
  "id": "cmpb8n8sa0004xv7w99648g8r",
  "name": "Produto Atualizado",
  "price": 39.90
}

 ```

**Testes automatizados:**

- Status code é 200
- Tempo de resposta menor que 2000ms
- Corpo da resposta é um objeto

#### Exemplos

*Requisição:*
``` json
postman request PATCH 'http://localhost:3000/api/products/cmp5zdc6g0000erjs0y2y7f8w' \
  --body '{
  "name": "Tênis Atualizado",
  "price": 4500,
  "quantity": 80
}'
```

*Resposta:*

``` json
{
    "id": "cmp5zdc6g0000erjs0y2y7f8w",
    "name": "Tênis Atualizado",
    "description": "",
    "category": "Calaçados",
    "price": 4500,
    "quantity": 80,
    "image": "https://m.media-amazon.com/images/I/51GXKGCE8OL._AC_SY625_.jpg",
    "createdAt": "2026-05-14T21:08:28.264Z"
}
```


### DELETE Deletar um produto

`http://localhost:3000/api/products/id`

Remove permanentemente um produto da plataforma. Substitua `:id` pelo identificador único do produto que deseja deletar.

**Parâmetros de URL:**

- `id` (obrigatório): Identificador único do produto (ex: `cmpb8n8sa0004xv7w99648g8r`)
    

**Resposta de sucesso:** 200 OK ou 204 No Content

**Testes automatizados:**

- Status code é 200 ou 204
- Tempo de resposta menor que 2000ms
- Validação do corpo da resposta (quando status 200)

### Exemplo:
*Requisição:*
``` json
postman request DELETE 'http://localhost:3000/api/products/cmp5zdc6g0000erjs0y2y7f8w' 
```

*Resposta:*

``` json
{
    "message": "Produto removido com sucesso"
}

```
---------
Esta seção detalha a infraestrutura de dados e as funções de servidor (Server Actions) para o gerenciamento de estoque, utilizando Next.js (App Router), Prisma ORM e SQLite.

1. **Banco de Dados e Persistência**

A solução utiliza SQLite para armazenamento local, eliminando a necessidade de servidores externos na fase inicial. O esquema de dados é gerenciado via Prisma ORM e contém as seguintes entidades:

Modelo de Dados (Prisma)

    User: Armazena credenciais administrativas com e-mail único e senha.

    Product: Representa os itens do inventário, incluindo campos para Nome, Descrição, Categoria, Preço e Quantidade (Stock).

2. **Server Actions (CRUD)**

As funções de servidor residem em app/actions/productActions.ts e permitem a interação direta do Frontend com o banco de dados.

**Listagem de Produtos (getProducts)**

    Função: Recupera todos os itens do catálogo ordenados por data de criação.

    Uso: Deve ser chamada para popular o inventário no Painel de Controle.

**Cadastro de Produtos (createProduct)**

    Função: Realiza a inserção de novos itens após validação.

    Validação: Utiliza a biblioteca Zod para garantir que o nome tenha no mínimo 3 caracteres, a categoria esteja preenchida e o preço seja um valor positivo.

**Edição de Produtos (updateProduct)**

    Função: Permite a alteração de preços e informações de itens existentes.

    Aplicação: Ideal para atualizações rápidas de preços e correção de dados.

**Exclusão de Produtos (deleteProduct)**

    Função: Remove itens descontinuados do banco de dados.

    Segurança: Recomenda-se implementar modal de confirmação no Frontend antes de disparar esta ação.

3. **Validação e Integridade**

O sistema implementa uma camada de proteção dupla para garantir a integridade dos dados operacionais:

    TypeScript: Utilizado em todo o projeto para segurança de tipos e redução de erros de desenvolvimento.

    Zod Schemas: Garante que apenas dados no formato correto sejam gravados no SQLite.

4. **Utilitários de Formatação**

Para garantir a consistência visual do MVP conforme o protótipo, utilize o utilitário em utils/format.ts:

    formatCurrency(value: number): Converte valores numéricos do banco (ex: 59.9) para o formato de moeda brasileiro (ex: "R$ 59,90").

5. **Instruções de Ambiente**

    Visualização de Dados: Utilize o comando `npx prisma studio` para abrir o painel visual de gerenciamento das tabelas.

    Migrações: Qualquer alteração no arquivo schema.prisma exige a execução de `npx prisma migrate dev` para atualizar o banco local dev.db.

## Contribuidores
<div align="center"> <table> <tr> <td align="center"> <a href="https://github.com/tiaaago"> <img src="docs/assets/team-photos/Tiago Enzo.jpeg" width="100" style="border-radius:50%"/> <br/> <sub><b>Tiago Enzo</b></sub> </a> </td> <td align="center"> <a href="https://github.com/darokyz"> <img src="docs/assets/team-photos/Otavio Amaral.jpeg" width="100" style="border-radius:50%"/> <br/> <sub><b>Otavio Amaral</b></sub> </a> </td> <td align="center"> <a href="https://github.com/EsterHB"> <img src="docs/assets/team-photos/Ester.jpeg" width="100" style="border-radius:50%"/> <br/> <sub><b>Ester Barbosa</b></sub> </a> </td> <td align="center"> <a href="https://github.com/MariaCaru"> <img src="docs/assets/team-photos/Maria.png" width="100" style="border-radius:50%"/> <br/> <sub><b>Maria Carolina</b></sub> </a> </td> <td align="center"> <a href="https://github.com/thiagolcf"> <img src="docs/assets/team-photos/Thiago.jpg" width="100" style="border-radius:50%"/> <br/> <sub><b>Thiago Lopes</b></sub> </a> </td> </tr> </table> </div>
