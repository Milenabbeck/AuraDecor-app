/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Wallet, 
  FolderKanban, 
  ChevronRight, 
  ChevronDown,
  Plus, 
  X, 
  Search, 
  Filter,
  ArrowRight,
  Home,
  Palette,
  CheckCircle2,
  Download,
  Trash2,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  Loader2,
  Moon,
  Sun
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { FURNITURE_DATA, STYLES, STYLE_DESCRIPTIONS } from './constants';
import { FurnitureItem, StyleType, Project } from './types';
import { ChatBot } from './components/ChatBot';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void
}) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'catalog', icon: ShoppingBag, label: 'Catálogo' },
    { id: 'moodboard', icon: Heart, label: 'Moodboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projetos' },
    { id: 'ai-designer', icon: Sparkles, label: 'AI Designer' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full z-50 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[95vw] sm:max-w-none overflow-x-auto no-scrollbar border border-white/20">
      <div className="flex items-center gap-3 mr-8 border-r border-neutral-200 pr-8 shrink-0 hidden sm:flex">
        <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
          <span className="text-neutral-900 font-serif italic text-sm">A</span>
        </div>
        <span className="font-serif font-bold tracking-[0.3em] text-xs">AURA</span>
      </div>
      <div className="flex items-center gap-8 sm:gap-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 shrink-0 relative group ${
              activeTab === tab.id ? 'text-sage-600' : 'text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} />
            <span className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-500 ${
              activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-dot"
                className="absolute -bottom-2 w-1 h-1 bg-sage-600 rounded-full"
              />
            )}
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
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative h-80 sm:h-96 rounded-[2rem] overflow-hidden cursor-pointer group transition-all duration-700 ${
        isActive ? 'ring-1 ring-sage-500 ring-offset-8' : 'opacity-90 grayscale-[0.5] hover:grayscale-0 hover:opacity-100'
      }`}
    >
      <img 
        src={images[style]} 
        alt={style} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-10 left-10 right-10">
        <h3 className="text-white text-4xl font-serif mb-2 tracking-tight">{style}</h3>
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-white/40 group-hover:w-12 transition-all duration-500" />
          <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold">Explorar Estética</p>
        </div>
      </div>
      {isActive && (
        <div className="absolute top-8 right-8 bg-white text-sage-900 p-3 rounded-full shadow-2xl">
          <CheckCircle2 size={20} strokeWidth={2.5} />
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
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100/50 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-700"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <button 
          onClick={() => toggleFavorite(item.id)}
          className={`absolute top-5 right-5 p-3.5 rounded-full glass transition-all duration-500 ${
            isFavorite ? 'text-red-500 bg-white shadow-xl' : 'text-neutral-400 hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
        <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={() => onAdd(item)}
            className="w-full bg-sage-600 text-neutral-900 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-sage-700 shadow-2xl transition-all"
          >
            <Plus size={16} /> Adicionar ao Projeto
          </button>
        </div>
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0">
            <span className="text-[9px] uppercase tracking-[0.25em] text-sage-600 font-bold mb-1.5 block truncate">{item.category}</span>
            <h4 className="text-xl font-serif leading-tight truncate tracking-tight group-hover:text-sage-900 transition-colors duration-500">{item.name}</h4>
          </div>
          <span className="font-serif italic text-neutral-900 text-lg shrink-0 ml-4">R$ {item.price.toLocaleString()}</span>
        </div>
        <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2 font-light group-hover:text-neutral-600 transition-colors duration-500">{item.description}</p>
      </div>
    </motion.div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [currentStyle, setCurrentStyle] = useState<StyleType>('Modern');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('aura_projects');
    return saved ? JSON.parse(saved) : [{
      id: 'default-1',
      name: 'Meu Primeiro Projeto',
      style: 'Modern',
      items: []
    }];
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('aura_active_project_id');
    return saved || 'default-1';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectStyle, setNewProjectStyle] = useState<StyleType>('Modern');

  // AI Designer State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roomType, setRoomType] = useState('Living Room');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDecoration = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = uploadedImage.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            },
            {
              text: `Decorate this ${roomType} in a ${currentStyle} style. Keep the structural elements but add premium minimalist furniture, lighting, and decor that matches the Aura Decor aesthetic. The result should be a high-quality, professional interior design visualization.`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          setToast({ message: "Decoração gerada com sucesso!", type: 'success' });
          break;
        }
      }
    } catch (error: any) {
      console.error("AI Generation error:", error);
      setToast({ message: "Erro ao gerar decoração. Tente novamente.", type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('aura_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('aura_active_project_id', activeProjectId);
  }, [activeProjectId]);

  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addItemToProject = (item: FurnitureItem) => {
    setProjects(prev => prev.map(p => 
      p.id === activeProjectId 
        ? { ...p, items: [...p.items, item.id] }
        : p
    ));
    setToast({ message: `${item.name} adicionado ao projeto ${activeProject.name}`, type: 'success' });
  };

  const removeItemFromProject = (idx: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const newItems = [...p.items];
        const removedItem = FURNITURE_DATA.find(f => f.id === newItems[idx]);
        newItems.splice(idx, 1);
        if (removedItem) {
          setToast({ message: `${removedItem.name} removido do orçamento`, type: 'success' });
        }
        return { ...p, items: newItems };
      }
      return p;
    }));
  };

  const createProject = () => {
    if (!newProjectName.trim()) return;
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      style: newProjectStyle,
      items: []
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setNewProjectName('');
    setNewProjectStyle('Modern');
    setIsNewProjectModalOpen(false);
    setToast({ message: "Projeto criado com sucesso!", type: 'success' });
  };

  const selectedItems = useMemo(() => {
    return activeProject.items.map(id => FURNITURE_DATA.find(f => f.id === id)).filter(Boolean) as FurnitureItem[];
  }, [activeProject]);

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

  const deleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (activeProjectId === id) {
      setActiveProjectId(newProjects[0].id);
    }
    setToast({ message: "Projeto excluído com sucesso", type: 'success' });
  };

  const exportToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(44, 61, 52); // Sage 900 approx
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("AURA DECOR - MOODBOARD", 20, 25);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text(`Projeto: ${activeProject.name}`, 20, 55);
      
      doc.setFontSize(12);
      doc.text(`Estilo: ${activeProject.style}`, 20, 65);
      doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 72);
      doc.text(`Investimento Total: R$ ${totalBudget.toLocaleString()}`, 20, 79);
      
      doc.setLineWidth(0.5);
      doc.line(20, 85, 190, 85);
      
      // Items
      let y = 100;
      selectedItems.forEach((item, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(11);
        doc.text(`${index + 1}. ${item.name}`, 20, y);
        doc.text(`R$ ${item.price.toLocaleString()}`, 160, y);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`${item.category} | ${item.style}`, 25, y + 5);
        doc.setTextColor(0, 0, 0);
        y += 15;
      });
      
      doc.save(`${activeProject.name.replace(/\s+/g, '_')}_aura_decor.pdf`);
      setToast({ message: "PDF exportado com sucesso!", type: 'success' });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      setToast({ message: "Erro ao gerar PDF", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#FDFCFB] text-neutral-900 font-sans selection:bg-sage-200 selection:text-sage-900 transition-colors duration-300">
      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 sm:p-16 shadow-2xl space-y-10"
            >
              <div className="space-y-4 text-center">
                <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] uppercase">Novo Início</span>
                <h3 className="text-4xl sm:text-5xl font-serif tracking-tight">Criar Projeto</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 ml-2">Nome do Projeto</label>
                  <input 
                    type="text" 
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Ex: Refúgio Urbano"
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-8 py-5 text-lg font-serif focus:outline-none focus:ring-4 focus:ring-sage-500/5 transition-all placeholder:text-neutral-200"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 ml-2">Direção de Estilo</label>
                  <div className="grid grid-cols-3 gap-4">
                    {(['Modern', 'Industrial', 'Scandinavian'] as StyleType[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setNewProjectStyle(s)}
                        className={`py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-500 flex flex-col items-center gap-2 ${
                          newProjectStyle === s 
                            ? 'bg-sage-600 text-neutral-900 shadow-2xl scale-[1.05]' 
                            : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                        }`}
                      >
                        <span>{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={createProject}
                  disabled={!newProjectName.trim()}
                  className="w-full bg-sage-600 text-neutral-900 py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:bg-sage-700 hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Confirmar Criação
                </button>
                <button 
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="w-full py-4 text-neutral-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-neutral-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Header - Only visible on Dashboard */}
      <AnimatePresence>
        {activeTab === 'dashboard' && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-3 sm:mb-6 block">Estética Minimalista Premium</span>
              <h1 className="text-6xl sm:text-7xl md:text-9xl font-serif leading-none tracking-tighter">Aura Decor</h1>
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
          </motion.header>
        )}
      </AnimatePresence>

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

              <div className="glass rounded-[3rem] p-8 sm:p-16 flex flex-col md:flex-row gap-12 sm:gap-20 items-center border border-white/40">
                <div className="flex-1 space-y-6 sm:space-y-8">
                  <div className="space-y-2">
                    <span className="text-sage-600 font-bold tracking-[0.2em] text-[10px] uppercase">Simulador de Ambiente</span>
                    <h2 className="text-4xl sm:text-6xl font-serif tracking-tight">Estética {currentStyle}</h2>
                  </div>
                  <p className="text-neutral-500 text-lg sm:text-xl leading-relaxed font-light">
                    {STYLE_DESCRIPTIONS[currentStyle]} Explore como este estilo transforma o ambiente com curadoria exclusiva de materiais e formas.
                  </p>
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="group flex items-center gap-6 text-sage-600 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm hover:text-sage-800 transition-colors"
                  >
                    Ver Coleção Completa <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-6 w-full">
                  {FURNITURE_DATA.filter(f => f.style === currentStyle).slice(0, 4).map(item => (
                    <div key={item.id} className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-lg">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          onClick={() => addItemToProject(item)}
                          className="bg-white text-sage-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                          title="Adicionar ao Projeto"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
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
              className="space-y-8 pt-12"
            >
              <div className="mb-16">
                <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-3 block">Curadoria Exclusiva</span>
                <h2 className="text-5xl sm:text-7xl font-serif tracking-tight">Explorar Coleção</h2>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif">Catálogo de Móveis</h2>
                  <p className="text-neutral-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
                    Adicionando ao projeto: <span className="text-sage-600">{activeProject.name}</span>
                  </p>
                </div>
                <div className="relative w-full md:w-[28rem]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Buscar na curadoria..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 rounded-2xl border border-neutral-100 bg-white focus:outline-none focus:ring-4 focus:ring-sage-500/5 transition-all shadow-sm placeholder:text-neutral-300"
                  />
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 w-full md:w-auto no-scrollbar">
                {['All', 'Seating', 'Tables', 'Lighting', 'Storage'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                      categoryFilter === cat ? 'bg-sage-600 text-neutral-900 shadow-xl scale-105' : 'bg-white text-neutral-400 border border-neutral-100 hover:border-sage-200'
                    }`}
                  >
                    {cat === 'All' ? 'Todos' : cat}
                  </button>
                ))}
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
              className="space-y-12 pt-12"
            >
              <div className="text-center space-y-6 mb-20">
                <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-3 block">Sua Essência Visual</span>
                <h2 className="text-5xl sm:text-7xl font-serif tracking-tight">Galeria de Inspiração</h2>
                <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                  Uma curadoria visual dos seus itens favoritos, compondo a alma do seu próximo projeto de design.
                </p>
              </div>

              {favoriteItems.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-10 space-y-10">
                  {favoriteItems.map(item => (
                    <div key={item.id} className="break-inside-avoid relative group rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                      <img src={item.image} alt={item.name} className="w-full h-auto transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          onClick={() => toggleFavorite(item.id)}
                          className="bg-white/90 backdrop-blur-md p-5 rounded-full text-neutral-900 shadow-2xl hover:scale-110 transition-transform"
                        >
                          <X size={28} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[30rem] flex flex-col items-center justify-center border border-dashed border-neutral-200 rounded-[3rem] text-neutral-400 bg-white/50">
                  <Heart size={64} className="mb-6 opacity-10" strokeWidth={1} />
                  <p className="font-serif italic text-xl">Sua galeria está à espera de inspiração.</p>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12"
            >
              <div className="space-y-10">
                <div className="mb-12">
                  <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] uppercase mb-3 block">Gestão de Espaços</span>
                  <h2 className="text-5xl sm:text-7xl font-serif tracking-tight">Seus Projetos</h2>
                </div>
                <div className="space-y-6">
                  {projects.map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => setActiveProjectId(p.id)}
                      className={`glass p-6 sm:p-8 rounded-[2rem] flex items-center justify-between group cursor-pointer transition-all duration-500 border border-transparent ${
                        activeProjectId === p.id ? 'bg-white border-sage-500/30 shadow-2xl scale-[1.02]' : 'hover:bg-white hover:border-white/60 hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-center gap-5 sm:gap-6">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                          activeProjectId === p.id ? 'bg-sage-600 text-neutral-900' : 'bg-neutral-100 text-neutral-400 group-hover:bg-sage-50 group-hover:text-sage-600'
                        }`}>
                          <Home size={24} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h4 className="font-serif text-xl sm:text-2xl tracking-tight">{p.name}</h4>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-bold mt-1">
                            {p.items.length} itens • Estilo {p.style}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(p.id);
                          }}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                            activeProjectId === p.id ? 'hover:bg-sage-700 text-white/40 hover:text-white' : 'hover:bg-red-50 text-neutral-200 hover:text-red-500'
                          }`}
                          title="Excluir Projeto"
                        >
                          <X size={20} strokeWidth={1.5} />
                        </button>
                        <ChevronRight className={`transition-all duration-500 shrink-0 ${
                          activeProjectId === p.id ? 'text-neutral-900 translate-x-1' : 'text-neutral-200 group-hover:text-sage-500 group-hover:translate-x-1'
                        }`} size={24} strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="w-full py-8 sm:py-10 border border-dashed border-neutral-200 rounded-[2rem] text-neutral-400 flex flex-col items-center justify-center gap-3 hover:border-sage-300 hover:text-sage-600 hover:bg-white/50 transition-all duration-500 group"
                  >
                    <div className="p-4 rounded-full bg-neutral-50 group-hover:bg-sage-50 transition-colors">
                      <Plus size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Criar Novo Projeto</span>
                  </button>
                </div>
              </div>

              <div className="bg-sage-600 rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-16 text-neutral-900 space-y-10 sm:space-y-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                <div className="relative z-10 space-y-2">
                  <span className="text-sage-800 font-bold tracking-[0.3em] text-[10px] uppercase">Visão Geral</span>
                  <h3 className="text-4xl sm:text-5xl font-serif tracking-tight">{activeProject.name}</h3>
                </div>
                <div className="space-y-6 sm:space-y-8 relative z-10">
                  <div className="flex justify-between items-end border-b border-black/10 pb-5 sm:pb-6">
                    <span className="text-black/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">Status</span>
                    <span className="font-serif italic text-lg sm:text-xl">Em Planejamento</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-black/10 pb-5 sm:pb-6">
                    <span className="text-black/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">Curadoria</span>
                    <span className="font-serif italic text-lg sm:text-xl">{selectedItems.length} itens</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-black/10 pb-5 sm:pb-6">
                    <span className="text-black/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">Direção de Estilo</span>
                    <span className="font-serif italic text-lg sm:text-xl">{activeProject.style}</span>
                  </div>
                  <div className="pt-8 sm:pt-12">
                    <span className="text-black/40 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold block mb-3">Investimento Estimado</span>
                    <span className="text-5xl sm:text-7xl font-serif tracking-tighter">R$ {totalBudget.toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={exportToPDF}
                  className="w-full bg-white text-sage-900 py-5 sm:py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-all duration-500 hover:bg-sage-50 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl"
                >
                  <Download size={20} strokeWidth={1.5} /> Exportar Moodboard PDF
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'ai-designer' && (
            <motion.section
              key="ai-designer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 pt-12 relative"
            >
              {/* Decorative AI Background */}
              <div className="absolute top-0 right-0 -z-10 opacity-20">
                <Sparkles size={400} className="text-sage-200 blur-3xl animate-pulse" />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10 mb-16">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-sage-600 rounded-[1.2rem] flex items-center justify-center text-neutral-900 shadow-2xl">
                      <Sparkles size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-sage-600 font-bold tracking-[0.4em] text-[10px] uppercase">Tecnologia Generativa</span>
                  </div>
                  <h2 className="text-5xl sm:text-8xl font-serif tracking-tight">AI Designer</h2>
                  <p className="text-neutral-400 text-base sm:text-xl max-w-2xl leading-relaxed font-light">
                    Transforme seu espaço instantaneamente. Envie uma foto do seu ambiente e nossa inteligência artificial criará uma curadoria personalizada no estilo Aura.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
                {/* Controls Section */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="glass p-10 rounded-[3rem] space-y-10 border border-white shadow-2xl">
                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 flex items-center gap-3">
                        <Palette size={16} strokeWidth={1.5} /> Direção de Estilo
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['Modern', 'Industrial', 'Scandinavian'] as StyleType[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => setCurrentStyle(s)}
                            className={`py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-500 flex flex-col items-center gap-2 ${
                              currentStyle === s 
                                ? 'bg-sage-600 text-neutral-900 shadow-2xl scale-[1.05]' 
                                : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                            }`}
                          >
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 flex items-center gap-3">
                        <Home size={16} strokeWidth={1.5} /> Tipo de Ambiente
                      </label>
                      <div className="relative">
                        <select 
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-8 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-sage-500/5 transition-all appearance-none cursor-pointer text-neutral-900"
                        >
                          <option value="Living Room">Sala de Estar</option>
                          <option value="Bedroom">Quarto</option>
                          <option value="Kitchen">Cozinha</option>
                          <option value="Office">Escritório</option>
                          <option value="Bathroom">Banheiro</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={20} />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={generateDecoration}
                        disabled={!uploadedImage || isGenerating}
                        className="w-full bg-sage-600 text-neutral-900 py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-sage-700 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed group shadow-2xl shadow-sage-900/20 active:scale-[0.98]"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={20} className="animate-spin" strokeWidth={1.5} /> Processando...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-500" strokeWidth={1.5} /> Gerar Design Aura
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="px-10 space-y-8">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Processo Criativo</h4>
                    <div className="space-y-6">
                      {[
                        { step: '01', text: 'Capture a essência do seu ambiente atual.' },
                        { step: '02', text: 'Defina a direção de estilo desejada.' },
                        { step: '03', text: 'Nossa IA redesenha o espaço em segundos.' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 items-start group">
                          <span className="text-sage-600 font-serif font-bold italic text-xl opacity-40 group-hover:opacity-100 transition-opacity duration-500">{item.step}</span>
                          <p className="text-neutral-400 text-xs leading-relaxed font-light group-hover:text-neutral-600 transition-colors duration-500">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Section */}
                <div className="lg:col-span-7 space-y-10">
                  {/* Upload Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-video rounded-[3.5rem] border border-dashed transition-all duration-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                      uploadedImage ? 'border-sage-500 shadow-2xl' : 'border-neutral-200 hover:border-sage-300 bg-white/50'
                    }`}
                  >
                    {uploadedImage ? (
                      <>
                        <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 text-neutral-900 font-bold shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500 text-xs uppercase tracking-[0.1em]">
                            <Camera size={24} strokeWidth={1.5} /> Alterar Captura
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-8 p-16">
                        <div className="w-28 h-28 bg-white text-sage-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">
                          <Upload size={44} strokeWidth={1} />
                        </div>
                        <div className="space-y-3">
                          <p className="text-2xl font-serif text-neutral-900 tracking-tight">Sua Foto Aqui</p>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.3em] font-bold">Clique ou arraste para enviar</p>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  {/* Result Area */}
                  <div className={`relative aspect-video rounded-[3.5rem] overflow-hidden bg-neutral-50 border border-dashed border-neutral-200 flex items-center justify-center transition-all duration-1000 ${
                    generatedImage ? 'border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)]' : ''
                  }`}>
                    {generatedImage ? (
                      <>
                        <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                        <div className="absolute top-10 right-10 flex gap-4">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = generatedImage;
                              link.download = `aura_design_${Date.now()}.png`;
                              link.click();
                            }}
                            className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl text-neutral-900 shadow-2xl hover:bg-white transition-all duration-500 hover:scale-110 active:scale-95"
                            title="Download"
                          >
                            <Download size={28} strokeWidth={1.5} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-8 p-16">
                        {isGenerating ? (
                          <div className="space-y-8">
                            <div className="relative">
                              <div className="w-28 h-28 border border-sage-100 rounded-full mx-auto" />
                              <div className="absolute inset-0 w-28 h-28 border-2 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto" />
                              <Sparkles className="absolute inset-0 m-auto text-sage-500 animate-pulse" size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-3">
                              <p className="text-2xl font-serif text-neutral-600 italic">Criando Magia...</p>
                              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Analisando iluminação e texturas</p>
                            </div>
                          </div>
                        ) : (
                          <div className="opacity-10 flex flex-col items-center gap-6">
                            <ImageIcon size={80} strokeWidth={0.5} />
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Aguardando sua foto</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <ChatBot />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-28 left-1/2 z-[200] px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-neutral-900 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-4 backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-sage-600/90' : 'bg-red-500/90'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} strokeWidth={1.5} /> : <X size={20} strokeWidth={1.5} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-sage-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-neutral-200/40 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
