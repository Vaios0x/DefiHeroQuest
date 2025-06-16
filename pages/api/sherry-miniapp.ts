import type { NextApiRequest, NextApiResponse } from 'next';

// Contratos desplegados en Avalanche Fuji
const CONTRACTS = {
  HERO_NFT: '0x5425890298aed601595a70AB815c96711a31Bc65',
  QUEST_MANAGER: '0x86d67c3D38D2bCeE722E601025C25a575021c6EA'
};

// Metadata para cada tipo de acción
const generateMetadata = (action: string) => {
  const baseUrl = 'http://localhost:3002';

  switch (action) {
    case 'hero-mint':
      return {
        url: baseUrl,
        icon: '⚔️',
        title: 'DeFi Hero Quest - Mint NFT Hero',
        description: '🏆 Sherry Minithon Winner - Mint your unique DeFi hero!',
        actions: [
          {
            type: 'blockchain',
            label: 'Mint DeFi Hero NFT',
            address: CONTRACTS.HERO_NFT,
            functionName: 'mintHero',
            chains: { source: 'fuji' },
            amount: 0.01,
            parameters: [
              {
                name: 'to',
                type: 'address',
                label: 'Wallet Address',
                required: true
              },
              {
                name: 'heroClass',
                type: 'select',
                label: 'Hero Class',
                required: true,
                options: [
                  { value: 0, label: '⚔️ DeFi Knight' },
                  { value: 1, label: '🧙‍♂️ Yield Wizard' },
                  { value: 2, label: '🏹 Staking Ranger' },
                  { value: 3, label: '🛡️ LP Guardian' }
                ]
              },
              {
                name: 'username',
                type: 'text',
                label: 'Hero Name',
                required: true
              }
            ]
          }
        ]
      };

    case 'defi-quest':
      return {
        url: baseUrl,
        icon: '💰',
        title: 'DeFi Hero Quest - Staking Quest',
        description: '⚔️ Complete epic DeFi quests and earn rewards!',
        actions: [
          {
            type: 'blockchain',
            label: 'Start DeFi Staking Quest',
            address: CONTRACTS.QUEST_MANAGER,
            functionName: 'stakeDeFiQuest',
            chains: { source: 'fuji' },
            amount: 0,
            parameters: [
              {
                name: 'amount',
                type: 'select',
                label: 'Staking Amount',
                required: true,
                options: [
                  { value: '100000000000000000', label: '0.1 AVAX - Novice Quest' },
                  { value: '500000000000000000', label: '0.5 AVAX - Warrior Quest' },
                  { value: '1000000000000000000', label: '1.0 AVAX - Champion Quest' }
                ]
              },
              {
                name: 'duration',
                type: 'radio',
                label: 'Quest Duration',
                required: true,
                options: [
                  { value: 7, label: '7 Days - Quick Quest' },
                  { value: 30, label: '30 Days - Standard Quest' },
                  { value: 90, label: '90 Days - Epic Quest' }
                ]
              }
            ]
          }
        ]
      };

    case 'social-quest':
      return {
        url: baseUrl,
        icon: '🌟',
        title: 'DeFi Hero Quest - Social Quest',
        description: '👥 Build community and earn social rewards!',
        actions: [
          {
            type: 'blockchain',
            label: 'Complete Social Quest',
            address: CONTRACTS.QUEST_MANAGER,
            functionName: 'completeQuest',
            chains: { source: 'fuji' },
            amount: 0,
            parameters: [
              {
                name: 'questId',
                type: 'select',
                label: 'Social Quest Type',
                required: true,
                options: [
                  { value: 1, label: '📢 Share DeFi Strategy' },
                  { value: 2, label: '👥 Invite Friends' },
                  { value: 3, label: '📚 Create Tutorial' }
                ]
              },
              {
                name: 'heroTokenId',
                type: 'number',
                label: 'Hero Token ID',
                required: true
              }
            ]
          }
        ]
      };

    default:
      return {
        url: baseUrl,
        icon: '🏆',
        title: 'DeFi Hero Quest - Sherry Minithon Winner',
        description: 'Revolutionary DeFi + Gaming + Social experience!'
      };
  }
};

// Ejecutar acciones
const executeAction = async (action: string, params: any) => {
  console.log(`🚀 Executing ${action}:`, params);

  switch (action) {
    case 'hero-mint':
      return {
        success: true,
        message: '🎉 Hero minted successfully!',
        data: {
          action: 'hero-mint',
          heroClass: params.heroClass,
          heroName: params.username,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          tokenId: Math.floor(Math.random() * 1000) + 1
        }
      };

    case 'defi-quest':
      return {
        success: true,
        message: '⚔️ DeFi quest started!',
        data: {
          action: 'defi-quest',
          questId: Math.floor(Math.random() * 10000) + 1,
          stakingAmount: params.amount,
          duration: params.duration,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        }
      };

    case 'social-quest':
      return {
        success: true,
        message: '🌟 Social quest completed!',
        data: {
          action: 'social-quest',
          questId: params.questId,
          heroTokenId: params.heroTokenId,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        }
      };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const action = req.query.action as string || 'hero-mint';
    
    if (req.method === 'GET') {
      const metadata = generateMetadata(action);
      res.status(200).json(metadata);
      return;
    }

    if (req.method === 'POST') {
      const result = await executeAction(action, req.body);
      res.status(200).json(result);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
} 