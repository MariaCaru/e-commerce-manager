"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Ocorreu um erro ao fazer login.");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-zinc-100 dark:bg-[#0a0a0c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden selection:bg-cyan-500/30">
            
            {/* Efeitos de fundo: Tons mais frios e gélidos com pulsação lenta */}
            <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 dark:bg-indigo-700/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    {/* Gradiente com transição mais dura/marcada */}
                    <div className="rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 p-3.5 text-white shadow-[0_0_40px_rgb(6,182,212,0.3)] ring-1 ring-white/20">
                        <Package size={34} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                    StockMaster<span className="text-cyan-500">.</span>
                </h2>
                <p className="mt-2 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Sua gestão de estoque inteligente
                </p>
                
                <div className="mt-6 mx-4 sm:mx-0 text-center text-xs font-medium text-cyan-800 dark:text-cyan-200 bg-cyan-50/80 dark:bg-cyan-950/30 p-3 rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30 backdrop-blur-md shadow-sm">
                    Primeiro acesso? Use <b className="font-bold text-cyan-900 dark:text-white">admin@stockmaster.com</b> com qualquer senha para iniciar.
                </div>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Card com borda iluminada sutil */}
                <div className="relative group">
                    {/* Brilho traseiro que aparece no hover do card */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-800 to-blue-200 rounded-[2.2rem] blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-150" />
                    
                    <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl py-8 px-4 shadow-2xl sm:rounded-[1.5rem] sm:px-10 border border-zinc-300/50 dark:border-white/10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-2xl text-sm text-center border border-red-500/20 font-semibold backdrop-blur-sm animate-in fade-in zoom-in duration-300">
                                    {error}
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                                    Email
                                </label>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 sm:text-sm transition-all duration-300"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 mb-2 ml-1">
                                    Senha
                                </label>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm placeholder-zinc-400 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 sm:text-sm transition-all duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative w-full flex justify-center py-4 px-4 rounded-2xl text-sm font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 overflow-hidden group/btn disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-[0.98] shadow-[0_0_20px_rgb(0,0,0,0.1)] dark:shadow-[0_0_20px_rgb(255,255,255,0.1)]"
                                >
                                    {/* Efeito de brilho passando pelo botão */}
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                    <span className="relative">
                                        {loading ? "Autenticando..." : "Entrar no Sistema"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}