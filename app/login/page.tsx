"use client"; // Necessário para usar hooks como useState

import { useState } from "react";
import { Mail, Lock, Loader2, Package } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para simular o login enquanto o backend não chega
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulando um delay de rede
    setTimeout(() => {
      setIsLoading(false);
      // Aqui você poderia simular um erro para testar o visual:
      // setError("E-mail ou senha inválidos.");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 px-4 dark:from-zinc-950 dark:to-zinc-900">
      
      {/* Logo ou Ícone do Sistema */}
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-blue-600 p-2 text-white shadow-lg">
          <Package size={32} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          StockMaster <span className="text-blue-600">.</span>
        </h2>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-zinc-900/50 dark:border dark:border-zinc-800">
        <div className="p-8">
          
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Acesse sua conta para gerenciar o estoque.
            </p>
          </div>

          {/* Mensagem de Erro Simulada */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Campo E-mail */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exemplo@senac.com.br"
                  className="w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Senha
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline">Esqueceu a senha?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white outline-none"
                  required
                />
              </div>
            </div>

            {/* Botão de Login com Loading */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Acessar Painel"
              )}
            </button>
          </form>
        </div>

        {/* Rodapé do Card */}
        <div className="bg-zinc-50 px-8 py-4 text-center dark:bg-zinc-800/50">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Problemas com o acesso? <a href="#" className="text-blue-600 font-medium hover:underline">Fale com o TI</a>
          </p>
        </div>
      </div>
      
      {/* Créditos do Grupo (Opcional para o PI) */}
      <footer className="mt-8 text-xs text-zinc-400">
        Grupo: Estér, Maria, Tiago, Thiago e Otávio • Senac 2026
      </footer>
    </div>
  );
}