This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Documentação Técnica: Backend e Arquitetura

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