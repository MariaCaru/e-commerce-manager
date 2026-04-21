'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 1. Schema de Validação 
const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().min(1, "A categoria é obrigatória"),
  price: z.number().positive("O preço deve ser positivo"),
  quantity: z.number().int().nonnegative("A quantidade não pode ser negativa"),
});

// 2. Extrair TIPO do Zod para usar nas funções
type ProductInput = z.infer<typeof productSchema>;

// 1. LISTAR: Busca todos os itens para o inventário 
export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }, // Ordenação automática 
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

// 2. CADASTRAR: Cria novos produtos (Ação da Beatriz)
export async function createProduct(data: ProductInput) {
  const validation = productSchema.safeParse(data);

  if (!validation.success) {
    return { 
      success: false, 
      errors: validation.error.flatten().fieldErrors 
    };
  }

  try {
    const product = await prisma.product.create({
      data: validation.data,
    });
    revalidatePath('/'); 
    return { success: true, product };
  } catch (error) {
    return { success: false, error: "Falha ao cadastrar no banco de dados" };
  }
}

// 3. EDITAR: Permite ao Carlos alterar preços e nomes 
// Partial<ProductInput> para permitir edições parciais
export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const validation = productSchema.partial().safeParse(data);

  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: validation.data,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar o item" };
  }
}

// 4. EXCLUIR: Remove itens descontinuados
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Não foi possível excluir o produto" };
  }
}