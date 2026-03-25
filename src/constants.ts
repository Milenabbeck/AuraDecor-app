import { FurnitureItem, StyleType } from './types';

export const STYLES: StyleType[] = ['Modern', 'Industrial', 'Scandinavian'];

export const FURNITURE_DATA: FurnitureItem[] = [
  {
    id: '1',
    name: 'Velvet Curve Sofa',
    category: 'Seating',
    price: 2400,
    style: 'Modern',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    description: 'A luxurious curved sofa with deep emerald velvet upholstery.'
  },
  {
    id: '2',
    name: 'Raw Oak Dining Table',
    category: 'Tables',
    price: 1850,
    style: 'Scandinavian',
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800',
    description: 'Minimalist dining table crafted from sustainable solid oak.'
  },
  {
    id: '3',
    name: 'Concrete Pendant Light',
    category: 'Lighting',
    price: 320,
    style: 'Industrial',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    description: 'Brutalist-inspired lighting with a raw concrete finish.'
  },
  {
    id: '4',
    name: 'Linen Lounge Chair',
    category: 'Seating',
    price: 950,
    style: 'Scandinavian',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
    description: 'Breathable linen chair with a light birch wood frame.'
  },
  {
    id: '5',
    name: 'Steel Mesh Bookshelf',
    category: 'Storage',
    price: 1200,
    style: 'Industrial',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy-duty steel shelving with an architectural mesh back.'
  },
  {
    id: '6',
    name: 'Marble Coffee Table',
    category: 'Tables',
    price: 1450,
    style: 'Modern',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    description: 'Carrara marble top with a slim brass-finished base.'
  },
  {
    id: '7',
    name: 'Brass Floor Lamp',
    category: 'Lighting',
    price: 450,
    style: 'Modern',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800',
    description: 'Minimalist arc lamp with a brushed brass finish.'
  },
  {
    id: '8',
    name: 'Woven Rattan Sideboard',
    category: 'Storage',
    price: 1100,
    style: 'Scandinavian',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800',
    description: 'Natural rattan doors with a clean white-washed frame.'
  },
  {
    id: '9',
    name: 'Exposed Bulb Chandelier',
    category: 'Lighting',
    price: 680,
    style: 'Industrial',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=800',
    description: 'Vintage-style Edison bulbs on a matte black iron frame.'
  }
];

export const STYLE_DESCRIPTIONS = {
  Modern: 'Clean lines, bold colors, and a focus on functionality and minimalism.',
  Industrial: 'Raw materials, exposed structures, and a utilitarian aesthetic.',
  Scandinavian: 'Light, airy spaces with natural materials and cozy textures.'
};
