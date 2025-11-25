import { Deity, ItemType, Tier } from './types';

export const DEITIES: Deity[] = [
  {
    id: 'caishen',
    name: '赵公明财神',
    // Updated to a high-quality 3D style Caishen image
    imageUrl: 'https://github.com/withoutwind/D09302/blob/master/caishen.png?raw=true', 
    description: '招财进宝，生意兴隆',
    type: 'wealth',
  },
  {
    id: 'guanyin',
    name: '送子观音',
    imageUrl: 'https://github.com/withoutwind/D09302/blob/master/gaunyin.jpeg?raw=true', // Placeholder for serene/holy visual
    description: '早生贵子，阖家安康',
    type: 'health',
  },
  {
    id: 'guangong',
    name: '关圣帝君',
    imageUrl: 'https://media.giphy.com/media/l0HlOaQcLJ2hHp7uq/giphy.gif', // Placeholder for strength/warrior
    description: '义薄云天，驱邪避凶',
    type: 'career',
  },
  {
    id: 'yuelao',
    name: '月下老人',
    imageUrl: 'https://media.giphy.com/media/xTaccD5xW2O6J49cCA/giphy.gif', // Placeholder for love/fate
    description: '千里姻缘，红线相牵',
    type: 'love',
  },
];

export const PRICING_TIERS: Tier[] = [
  { price: 0, label: '随缘 (免费)', effectLevel: 1, description: '心诚则灵' },
  { price: 0.5, label: '初愿 (0.5元)', effectLevel: 2, description: '小小敬意' },
  { price: 5, label: '祈福 (5元)', effectLevel: 3, description: '香火旺盛' },
  { price: 50, label: '虔诚 (50元)', effectLevel: 4, description: '功德无量' },
  { price: 500, label: '大愿 (500元)', effectLevel: 5, description: '有求必应' },
  { price: 5000, label: '宏愿 (5000元)', effectLevel: 6, description: '光耀门楣' },
  { price: 50000, label: '天愿 (50000元)', effectLevel: 7, description: '泽被苍生' },
];

export const ITEM_ICONS: Record<ItemType, string> = {
  [ItemType.INCENSE]: '🥢', 
  [ItemType.CANDLE]: '🕯️',
  [ItemType.TRIBUTE]: '🍎',
};