import { ArrowUpRight, ArrowDownRight, DollarSign, Package, ShoppingCart, Users, TrendingUp, Activity, UserCircle } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const productCount = await prisma.product.count();
    const allProducts = await prisma.product.findMany();
    const totalInventoryValue = allProducts.reduce(
        (acc, curr) => acc + curr.price * curr.quantity, 0
    );

    const stats = [
        { 
            title: "Receita Total", 
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInventoryValue), 
            change: "+20.1%", isPositive: true, icon: DollarSign, 
            colorClass: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
            bgDecoration: "bg-blue-50 dark:bg-blue-500/10"
        },
        { 
            title: "Produtos Ativos", 
            value: productCount.toLocaleString('pt-BR'), 
            change: "+12.5%", isPositive: true, icon: Package, 
            colorClass: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
            bgDecoration: "bg-indigo-50 dark:bg-indigo-500/10"
        },
        { 
            title: "Vendas (Mês)", value: "843", change: "-4.2%", isPositive: false, icon: ShoppingCart, 
            colorClass: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
            bgDecoration: "bg-purple-50 dark:bg-purple-500/10"
        },
        { 
            title: "Novos Clientes", value: "249", change: "+8.4%", isPositive: true, icon: Users, 
            colorClass: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            bgDecoration: "bg-emerald-50 dark:bg-emerald-500/10"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Visão Geral</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Acompanhe as métricas principais do seu e-commerce hoje.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-sm">
                        <option>Últimos 7 dias</option>
                        <option>Últimos 30 dias</option>
                        <option>Este Ano</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-2">
                        <Activity size={16} />
                        Gerar Relatório
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bgDecoration} rounded-full group-hover:scale-110 transition-transform duration-500`} />
                            
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.colorClass}`}>
                                    <Icon size={22} />
                                </div>
                            </div>
                            <div className="relative z-10 mt-4 flex items-center gap-2">
                                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                                    stat.isPositive 
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
                                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                }`}>
                                    {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.change}
                                </span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">vs. mês anterior</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sales */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Vendas Recentes</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Você fez 265 vendas este mês.</p>
                        </div>
                        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Ver todas</button>
                    </div>
                    
                    <div className="space-y-6">
                        {[
                            { id: 1, amount: "R$ 234.50" },
                            { id: 2, amount: "R$ 412.75" },
                            { id: 3, amount: "R$ 189.25" },
                            { id: 4, amount: "R$ 356.00" },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <UserCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900 dark:text-white">Cliente {item.id}</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">cliente{item.id}@exemplo.com</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-zinc-900 dark:text-white">+{item.amount}</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Concluído</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Produtos Populares</h3>
                        <TrendingUp size={18} className="text-zinc-400" />
                    </div>
                    
                    <div className="space-y-5">
                        {[
                            { name: "MacBook Pro M3", sales: 124, price: "R$ 12.999" },
                            { name: "iPhone 15 Pro", sales: 98, price: "R$ 7.299" },
                            { name: "AirPods Pro 2", sales: 76, price: "R$ 1.899" },
                            { name: "iPad Air 5", sales: 45, price: "R$ 4.599" },
                        ].map((prod, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{prod.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{prod.sales} vendas</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{prod.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}