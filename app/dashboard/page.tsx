import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
    const productCount = await prisma.product.count();
    const allProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    const totalInventoryValue = allProducts.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
    );

    const stats = [
        {
            title: "Valor em Estoque",
            value: new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(totalInventoryValue),
            change: null,
            icon: DollarSign,
            colorClass: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400",
        },
        {
            title: "Produtos Ativos",
            value: productCount.toString(),
            change: null,
            icon: Package,
            colorClass: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
        },
        {
            title: "Vendas (Mês)",
            value: "0",
            change: null,
            icon: ShoppingCart,
            colorClass: "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
        },
        {
            title: "Novos Clientes",
            value: "0",
            change: null,
            icon: Users,
            colorClass: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                        <TrendingUp size={28} />
                    </div>
                    Dashboard
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    Visão geral do seu estoque e operações.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {stat.title}
                                </p>
                                <div className={`p-2 rounded-xl ${stat.colorClass}`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                            <p className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                                {stat.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                        Produtos Recentes
                    </h2>
                    <a
                        href="/dashboard/products"
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                        Ver todos <ArrowUpRight size={14} />
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Categoria</th>
                                <th className="px-6 py-3">Preço</th>
                                <th className="px-6 py-3">Estoque</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {allProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-10 text-center text-zinc-400 dark:text-zinc-500"
                                    >
                                        Nenhum produto cadastrado ainda.
                                    </td>
                                </tr>
                            ) : (
                                allProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 overflow-hidden">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package size={16} />
                                                    )}
                                                </div>
                                                <span className="font-medium text-zinc-900 dark:text-white">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                                            {new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    product.quantity > 10
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                        : product.quantity > 0
                                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                                }`}
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {product.quantity} unid.
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}