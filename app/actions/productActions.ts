'use server'

import prisma from '@/lib/prisma'; 
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "A categoria é obrigatória"),
  price: z.number().positive("O preço deve ser positivo"),
  quantity: z.number().int().nonnegative("A quantidade não pode ser negativa"),
  image: z.string().url("Insira uma URL válida").optional().or(z.literal("")),
});

type ProductInput = z.infer<typeof productSchema>;

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

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
      data: {
        ...validation.data,
        description: validation.data.description || null,
        image: validation.data.image || null,
      },
    });
    revalidatePath('/dashboard/products'); 
    return { success: true, product };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Falha ao cadastrar no banco de dados" };
  }
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const validation = productSchema.partial().safeParse(data);

  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...validation.data,
        image: validation.data.image || null,
      },
    });
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar o item" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Não foi possível excluir o produto" };
  }
}