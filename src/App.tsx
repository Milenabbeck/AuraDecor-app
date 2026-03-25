/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Wallet, 
  FolderKanban, 
  ChevronRight, 
  Plus, 
  X, 
  Search, 
  Filter,
  ArrowRight,
  Home,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { FURNITURE_DATA, STYLES, STYLE_DESCRIPTIONS } from './constants';
import { FurnitureItem, StyleType, Project } from './types';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'catalog', icon: ShoppingBag, label: 'Catálogo' },
    { id: 'moodboard', icon: Heart, label: 'Moodboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projetos' },
    { id: 'budget', icon: Wallet, label: 'Orçamento' },
  ];

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 glass px-4 sm:px-6 py-2 sm:py-3 rounded-full z-50 flex items-center gap-4 sm:gap-8 shadow-xl max-w-[95vw] sm:max-w-none overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:mr-4 sm:border-r border-neutral-200 sm:pr-6 shrink-0">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sage-500 rounded-full flex items-center justify-center">
          <span className="text-white font-serif font-bold text-[10px] sm:text-xs">A</span>
        </div>
        <span className="font-serif font-bold tracking-widest text-xs sm:text-sm hidden md:block">AURA</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-300 shrink-0 ${
              activeTab === tab.id ? 'text-sage-600 scale-110' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <tab.icon size={18} className="sm:w-5 sm:h-5" />
            <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const StyleCard: React.FC<{ style: StyleType, isActive: boolean, onClick: () => void }> = ({ style, isActive, onClick }) => {
  const images = {
    Modern: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    Industrial: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    Scandinavian: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative h-64 sm:h-80 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ${
        isActive ? 'ring-2 ring-sage-500 ring-offset-4' : 'opacity-80 grayscale hover:grayscale-0 hover:opacity-100'
      }`}
    >
      <img 
        src={images[style]} 
        alt={style} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-white text-3xl mb-1">{style}</h3>
        <p className="text-white/70 text-xs uppercase tracking-widest font-medium">Simular Estilo</p>
      </div>
      {isActive && (
        <div className="absolute top-6 right-6 bg-sage-500 text-white p-2 rounded-full">
          <CheckCircle2 size={20} />
        </div>
      )}
    </motion.div>
  );
};

const FurnitureCard: React.FC<{ 
  item: FurnitureItem, 
  isFavorite: boolean, 
  toggleFavorite: (id: string) => void,
  onAdd: (item: FurnitureItem) => void
}> = ({ 
  item, 
  isFavorite, 
  toggleFavorite, 
  onAdd 
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-100 hover:shadow-2xl hover:shadow-sage-200/50 transition-all duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={() => toggleFavorite(item.id)}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full glass transition-all duration-300 ${
            isFavorite ? 'text-red-500 bg-white' : 'text-neutral-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} className="sm:w-[18px] sm:h-[18px]" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/60 to-transparent">
          <button 
            onClick={() => onAdd(item)}
            className="w-full bg-white text-neutral-900 py-2 sm:py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-sage-50 transition-colors"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" /> Adicionar
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <div className="min-w-0">
            <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-sage-600 font-bold mb-0.5 sm:mb-1 block truncate">{item.category}</span>
            <h4 className="text-lg sm:text-xl font-serif leading-tight truncate">{item.name}</h4>
          </div>
          <span className="font-medium text-neutral-900 text-sm sm:text-base shrink-0 ml-2">R$ {item.price.toLocaleString()}</span>
        </div>
        <p className="text-neutral-400 text-[10px] sm:text-xs line-clamp-2">{item.description}</p>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStyle, setCurrentStyle] = useState<StyleType>('Modern');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<FurnitureItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const addItemToProject = (item: FurnitureItem) => {
    setSelectedItems(prev => [...prev, item]);
  };

  const removeItemFromProject = (idx: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== idx));
  };

  const totalBudget = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.price, 0);
  }, [selectedItems]);

  const filteredFurniture = useMemo(() => {
    return FURNITURE_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesStyle = activeTab === 'dashboard' ? true : item.style === currentStyle;
      return matchesSearch && matchesCategory && matchesStyle;
    });
  }, [searchQuery, categoryFilter, currentStyle, activeTab]);

  const favoriteItems = useMemo(() => {
    return FURNITURE_DATA.filter(item => favorites.includes(item.id));
  }, [favorites]);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-sage-600 font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-2 sm:mb-4 block">Estética Minimalista Premium</span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif leading-none">Aura Decor</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left md:text-right"
        >
          <p className="serif-italic text-xl sm:text-2xl text-neutral-500 max-w-xs">
            "Onde o respiro visual encontra a sofisticação."
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {STYLES.map((style) => (
                  <StyleCard 
                    key={style} 
                    style={style} 
                    isActive={currentStyle === style}
                    onClick={() => setCurrentStyle(style)}
                  />
                ))}
              </div>

              <div className="glass rounded-3xl p-6 sm:p-12 flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <h2 className="text-3xl sm:text-5xl">Simulador {currentStyle}</h2>
                  <p className="text-neutral-500 text-base sm:text-lg leading-relaxed">
                    {STYLE_DESCRIPTIONS[currentStyle]} Explore como este estilo transforma o ambiente com curadoria exclusiva de materiais e formas.
                  </p>
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="group flex items-center gap-4 text-sage-600 font-bold uppercase tracking-widest text-xs sm:text-sm"
                  >
                    Ver Coleção Completa <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  {FURNITURE_DATA.filter(f => f.style === currentStyle).slice(0, 4).map(item => (
                    <div key={item.id} className="aspect-square rounded-2xl overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'catalog' && (
            <motion.section
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar móveis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                  {['All', 'Seating', 'Tables', 'Lighting', 'Storage'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                        categoryFilter === cat ? 'bg-sage-600 text-white' : 'bg-white text-neutral-400 border border-neutral-100 hover:border-sage-200'
                      }`}
                    >
                      {cat === 'All' ? 'Todos' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                {filteredFurniture.map(item => (
                  <FurnitureCard 
                    key={item.id} 
                    item={item} 
                    isFavorite={favorites.includes(item.id)}
                    toggleFavorite={toggleFavorite}
                    onAdd={addItemToProject}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'moodboard' && (
            <motion.section
              key="moodboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl sm:text-6xl">Seu Moodboard</h2>
                <p className="text-neutral-500 text-sm sm:text-base max-w-xl mx-auto">
                  Uma coleção visual dos seus itens favoritos para inspirar seu próximo projeto de design.
                </p>
              </div>

              {favoriteItems.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                  {favoriteItems.map(item => (
                    <div key={item.id} className="break-inside-avoid relative group rounded-3xl overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-auto" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="bg-white p-4 rounded-full text-red-500"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-3xl text-neutral-400">
                  <Heart size={48} className="mb-4 opacity-20" />
                  <p>Nenhum item favoritado ainda.</p>
                </div>
              )}
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <div className="space-y-8">
                <h2 className="text-3xl sm:text-5xl">Gerenciamento de Projetos</h2>
                <div className="space-y-4">
                  {['Sala de Estar - Loft', 'Quarto Principal - Zen', 'Escritório Industrial'].map((p, i) => (
                    <div key={i} className="glass p-4 sm:p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600 shrink-0">
                          <Home size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <h4 className="font-serif text-lg sm:text-xl">{p}</h4>
                          <p className="text-[8px] sm:text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Última edição: 2 dias atrás</p>
                        </div>
                      </div>
                      <ChevronRight className="text-neutral-300 group-hover:text-sage-500 transition-colors shrink-0" size={18} />
                    </div>
                  ))}
                  <button className="w-full py-4 sm:py-6 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 flex items-center justify-center gap-2 hover:border-sage-300 hover:text-sage-600 transition-all text-sm sm:text-base">
                    <Plus size={20} /> Novo Projeto
                  </button>
                </div>
              </div>

              <div className="bg-sage-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-white space-y-6 sm:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sage-800 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                <h3 className="text-3xl sm:text-4xl font-serif">Resumo da Reforma</h3>
                <div className="space-y-4 sm:space-y-6 relative z-10">
                  <div className="flex justify-between items-end border-b border-white/10 pb-3 sm:pb-4">
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest">Status</span>
                    <span className="font-medium text-sm sm:text-base">Em Planejamento</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-3 sm:pb-4">
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest">Itens Selecionados</span>
                    <span className="font-medium text-sm sm:text-base">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-3 sm:pb-4">
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest">Estilo Predominante</span>
                    <span className="font-medium text-sm sm:text-base">{currentStyle}</span>
                  </div>
                  <div className="pt-4 sm:pt-8">
                    <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest block mb-1 sm:mb-2">Investimento Estimado</span>
                    <span className="text-4xl sm:text-5xl font-serif">R$ {totalBudget.toLocaleString()}</span>
                  </div>
                </div>
                <button className="w-full bg-sage-500 hover:bg-sage-400 text-white py-3 sm:py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] sm:text-xs transition-colors">
                  Exportar Moodboard PDF
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'budget' && (
            <motion.section
              key="budget"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-4xl sm:text-6xl">Rastreador Dinâmico</h2>
                  <p className="text-neutral-500 text-sm sm:text-base max-w-md">
                    Controle financeiro em tempo real. Adicione ou remova itens para ver o impacto imediato no seu orçamento total.
                  </p>
                </div>
                <div className="glass p-6 sm:p-8 rounded-3xl text-left md:text-right w-full md:w-auto">
                  <span className="text-neutral-400 text-[10px] sm:text-xs uppercase tracking-widest block mb-1">Total Geral</span>
                  <span className="text-4xl sm:text-5xl font-serif text-sage-600">R$ {totalBudget.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={`${item.id}-${idx}`} 
                      className="bg-white p-4 sm:p-6 rounded-2xl flex items-center justify-between border border-neutral-100 gap-4"
                    >
                      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <h4 className="font-serif text-lg sm:text-xl truncate">{item.name}</h4>
                          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-neutral-400 font-bold block truncate">{item.category} • {item.style}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                        <span className="font-medium text-base sm:text-lg whitespace-nowrap">R$ {item.price.toLocaleString()}</span>
                        <button 
                          onClick={() => removeItemFromProject(idx)}
                          className="p-1 sm:p-2 text-neutral-300 hover:text-red-500 transition-colors"
                        >
                          <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-3xl text-neutral-400">
                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                    <p>Seu carrinho de projeto está vazio.</p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-sage-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-neutral-200/40 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
