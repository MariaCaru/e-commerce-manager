/**
 * Uso no front:
  import { formatCurrency } from '@/utils/format';

  No componente React/Next.js
  <span>{formatCurrency(product.price)}</span>
 * 
 * Formata um número para o padrão de moeda brasileiro (R$ 0,00).
 * @param value - O valor numérico vindo do banco de dados (Ex: 59.9)
 * @returns Uma string formatada (Ex: "R$ 59,90")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};