"use client";

import { useState, useTransition } from "react";
import { Package, Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle2, ImageOff } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/productActions";

type Product = {
    id: string;
    name: string;
    description: string | null;
    category: string;
    price: number;
    quantity: number;
    image: string | null;
    createdAt: Date;
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({ name: "", description: "", category: "", price: "", quantity: "", image: "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || "",
            category: product.category,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            image: product.image || "",
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const data = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
            image: formData.image,
        };

        startTransition(async () => {
            if (editingProduct) {
                const res = await updateProduct(editingProduct.id, data);
                if (res.success) {
                    setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
                    showNotification('success', 'Produto atualizado com sucesso!');
                    setIsModalOpen(false);
                } else if (res.errors) {
                    setErrors(res.errors);
                } else {
                    showNotification('error', res.error || 'Erro ao atualizar.');
                }
            } else {
                const res = await createProduct(data);
                if (res.success && res.product) {
                    setProducts([res.product as Product, ...products]);
                    showNotification('success', 'Produto criado com sucesso!');
                    setIsModalOpen(false);
                } else if (res.errors) {
                    setErrors(res.errors);
                } else {
                    showNotification('error', res.error || 'Erro ao criar.');
                }
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este produto?")) return;

        startTransition(async () => {
            const res = await deleteProduct(id);
            if (res.success) {
                setProducts(products.filter(p => p.id !== id));
                showNotification('success', 'Produto excluído com sucesso!');
            } else {
                showNotification('error', res.error || 'Erro ao excluir.');
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Package size={28} />
                        </div>
                        Produtos
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Gerencie seu catálogo, estoque e preços.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={18} strokeWidth={3} />
                    Adicionar Produto
                </button>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-5 ${
                    notification.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-semibold">{notification.message}</span>
                </div>
            )}

            {/* Filters & Search */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produtos por nome ou categoria..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow dark:text-white placeholder:text-zinc-400"
                    />
                </div>
                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    Total: <span className="text-zinc-900 dark:text-white">{filteredProducts.length}</span> itens
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Preço Unid.</th>
                                <th className="px-6 py-4">Estoque</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Imagem ou fallback */}
                                                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <ImageOff size={18} className={`text-zinc-400 ${product.image ? 'hidden' : ''}`} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900 dark:text-white">{product.name}</p>
                                                    <p className="text-xs text-zinc-500 max-w-[200px] truncate">{product.description || "Sem descrição"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                product.quantity > 10
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                    : product.quantity > 0
                                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                            }`}>
                                                {product.quantity > 0 ? (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                ) : (
                                                    <AlertCircle size={12} />
                                                )}
                                                {product.quantity} unid.
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={isPending}
                                                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => !isPending && setIsModalOpen(false)}
                    />

                    <div className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => !isPending && setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                            {editingProduct ? "Editar Produto" : "Novo Produto"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Nome do Produto *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border ${errors?.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white`}
                                    placeholder="Ex: iPhone 15 Pro Max"
                                />
                                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Categoria *</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border ${errors?.category ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white`}
                                        placeholder="Ex: Eletrônicos"
                                    />
                                    {errors?.category && <p className="text-red-500 text-xs mt-1">{errors.category[0]}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Preço Unid. (R$) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border ${errors?.price ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white`}
                                        placeholder="0.00"
                                    />
                                    {errors?.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Quantidade em Estoque *</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border ${errors?.quantity ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white`}
                                    placeholder="0"
                                />
                                {errors?.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity[0]}</p>}
                            </div>

                            {/* Campo de URL de Imagem */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">URL da Imagem (Opcional)</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className={`w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border ${errors?.image ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white`}
                                    placeholder="https://exemplo.com/imagem.jpg"
                                />
                                {errors?.image && <p className="text-red-500 text-xs mt-1">{errors.image[0]}</p>}
                                {/* Preview da imagem */}
                                {formData.image && (
                                    <div className="mt-3 w-full h-32 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Descrição (Opcional)</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 dark:text-white resize-none"
                                    placeholder="Detalhes adicionais sobre o produto..."
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => !isPending && setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        editingProduct ? "Salvar Alterações" : "Cadastrar Produto"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}