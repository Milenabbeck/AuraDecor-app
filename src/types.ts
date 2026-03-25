export type StyleType = 'Modern' | 'Industrial' | 'Scandinavian';

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'Seating' | 'Tables' | 'Lighting' | 'Storage' | 'Decor';
  price: number;
  image: string;
  style: StyleType;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  style: StyleType;
  items: string[]; // IDs of furniture items
}

export interface AppState {
  currentStyle: StyleType;
  favorites: string[];
  projects: Project[];
  activeProjectId: string | null;
}
