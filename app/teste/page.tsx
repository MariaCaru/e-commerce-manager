'use client'

import { getProducts, createProduct, deleteProduct } from '@/app/actions/productActions';

export default function TestePage() {
  
  const rodarTestes = async () => {
    console.log("--- Iniciando Testes de Backend ---");

    // 1. Teste de Listagem (Read)
    const produtos = await getProducts();
    console.log("Produtos no banco:", produtos);

    // 2. Teste de Criação (Create) 
    const resultado = await createProduct({
      name: "Produto Teste " + Math.floor(Math.random() * 100),
      category: "Vestuário",
      price: 99.90,
      quantity: 10, 
      description: "Validado com Zod e TypeScript"
    });

    if (resultado.success) {
      console.log("Sucesso! Produto criado:", resultado.product);
    } else {
      console.error("Erro de validação:", resultado.errors);
    }

    // 3. Teste de Exclusão (Delete)
    if (produtos.length > 0) {
      const deletar = await deleteProduct(produtos[0].id);
      console.log("Resultado da Exclusão:", deletar);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Laboratório de teste: Checkpoint de Integridade</h1>
      <p>Este teste valida o CRUD e as regras do Zod no SQLite[cite: 50, 311, 329].</p>
      <button 
        onClick={rodarTestes}
        style={{ 
          padding: '12px 24px', 
          background: '#0070f3', 
          color: 'white', 
          border: 'none', 
          borderRadius: '7px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Executar Sequência Completa
      </button>
    </div>
  );
}