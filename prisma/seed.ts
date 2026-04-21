import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Criando o usuário administrativo Carlos Almeida
  const user = await prisma.user.upsert({
    where: { email: 'carlos@loja.com' },
    update: {},
    create: {
      email: 'carlos@loja.com',
      name: 'Carlos Almeida',
      password: 'senha_criptografada_aqui', // No futuro usaremos bcrypt
    },
  })

  // Criando produtos iniciais para o catálogo
  const p1 = await prisma.product.create({
    data: {
      name: 'Camiseta Básica Preta',
      description: 'Camiseta 100% algodão fio 30.1 penteado',
      category: 'Vestuário',
      price: 59.90,
    },
  })

  const p2 = await prisma.product.create({
    data: {
      name: 'Tênis Casual Branco',
      category: 'Calçados',
      price: 189.90,
    },
  })

  console.log({ user, products: [p1, p2] })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })