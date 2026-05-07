import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Listagem de produtos (Read)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' } // Itens novos primeiro, como pede o MVP [cite: 428, 575]
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar catálogo" }, { status: 500 });
  }
}

// POST: Cadastro de novo produto (Create)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação básica dos campos obrigatórios do seu schema [cite: 394]
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        price: parseFloat(body.price),
        quantity: parseInt(body.quantity) || 0,
        image: body.image
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cadastrar produto" }, { status: 400 });
  }
}