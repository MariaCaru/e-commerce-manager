"use client";

import { LayoutDashboard, Package, Settings, LogOut, Menu, X, UserCircle } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fechar o menu no mobile sempre que a rota mudar
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const links = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/dashboard/products", icon: Package, label: "Produtos" }
    ];

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 z-30 lg:translate-x-0 lg:static ${
                isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            }`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 text-white shadow-lg shadow-blue-500/30">
                            <Package size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                            StockMaster<span className="text-blue-500">.</span>
                        </h2>
                    </div>
                    {/* Close Button Mobile */}
                    <button 
                        className="p-2 lg:hidden text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                    <p className="px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Principal</p>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        
                        return (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                    isActive 
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 font-semibold" 
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                <Icon size={20} className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* User Area Bottom */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sair da conta</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden w-full">
                {/* Topbar */}
                <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
                    <div className="flex items-center">
                        <button 
                            className="p-2 lg:hidden text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg mr-2"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">Admin User</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">admin@stockmaster.com</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center border-2 border-white dark:border-zinc-800 shadow-sm">
                                <UserCircle size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}