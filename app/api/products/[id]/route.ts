import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

// PATCH: Atualizar produto
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Defina como Promise
) {
  try {
    const { id } = await params; // Aguarda a resolução do parâmetro
    const body = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: body,
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar produto" }, { status: 400 });
  }
}

// DELETE: Remover produto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Defina como Promise
) {
  try {
    const { id } = await params; // Aguarda a resolução do parâmetro
    
    await prisma.product.delete({
      where: { id: id },
    });
    
    return NextResponse.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao remover produto" }, { status: 400 });
  }
}