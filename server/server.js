import express from 'express';
import cors from 'cors';
import path from 'path';

// Importar endpoints
import fujiTriggers from './endpoints/fuji-triggers.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Permite todos los orígenes para desarrollo
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Endpoint principal de Sherry miniapp (original)
app.all('/api/sherry-miniapp', async (req, res) => {
  try {
    const method = req.method;
    
    if (method === 'GET') {
      // Metadata para Sherry SDK
      const action = req.query.action || 'hero-mint';
      
      const metadata = {
        type: 'mini-app',
        name: 'DeFi Hero Quest Triggers',
        description: 'Transform social posts into DeFi gaming experiences',
        version: '1.0.0',
        author: 'DeFi Hero Quest Team',
        
        // Parámetros específicos por acción
        parameters: getParametersForAction(action),
        
        // Metadata de respuesta
        response: {
          success: true,
          message: `${action} metadata retrieved`,
          action: action,
          timestamp: new Date().toISOString()
        },
        
        // Información de la aplicación
        app_info: {
          url: 'http://localhost:3003',
          api_endpoint: 'http://localhost:3002/api/sherry-miniapp',
          supported_chains: ['avalanche-fuji', 'base', 'ethereum'],
          social_platforms: ['twitter', 'discord', 'telegram']
        }
      };
      
      res.json(metadata);
      
    } else if (method === 'POST') {
      // Ejecutar acción
      const { action = 'hero-mint', user_address, parameters = {} } = req.body;
      
      console.log(`🎯 Executing trigger: ${action} for ${user_address}`);
      
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = generateActionResult(action, user_address, parameters);
      
      res.json(result);
      
    } else {
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Integrar endpoints de Fuji y Dynamic Actions
app.use('/api', fujiTriggers);

// 🔥 NEW: Dynamic Actions Integration
app.post('/api/dynamic-actions', async (req, res) => {
  try {
    const { user_address, social_context, platform_data, requested_action } = req.body;

    console.log('🚀 Dynamic Actions Request:', { user_address, social_context, requested_action });

    // Generate deterministic profile based on wallet address
    const addressSeed = parseInt(user_address.slice(-8), 16);
    const random1 = (addressSeed * 9301 + 49297) % 233280;
    const random2 = (random1 * 9301 + 49297) % 233280;
    const random3 = (random2 * 9301 + 49297) % 233280;
    const random4 = (random3 * 9301 + 49297) % 233280;
    
    // Simulated AI-powered user analysis (deterministic per wallet)
    const userProfile = {
      address: user_address,
      transactionCount: (addressSeed % 100) + 1,
      totalVolume: (random1 % 10000) + 1000,
      lastActivity: new Date(Date.now() - (random2 % (30 * 24 * 60 * 60 * 1000))),
      level: (addressSeed % 10) + 1,
      expertise: ['beginner', 'intermediate', 'advanced'][addressSeed % 3],
      isNew: (random1 % 100) > 70,
      isWhale: (random2 % 100) > 90,
      isInfluencer: (random3 % 100) > 80,
      balance: (random4 % 5000) + 500
    };

    // Social context analysis (deterministic per wallet)
    const socialProfile = {
      platform: social_context || 'twitter',
      viralPotential: (random1 % 1000) / 1000, // 0.000 to 0.999
      audienceSize: (random2 % 10000) + 1000,
      engagement: platform_data && platform_data.engagement_level ? platform_data.engagement_level : 'medium'
    };

    // Generate dynamic actions based on profile (deterministic but level-dependent)
    const dynamicActions = [];
    const actionSeed = (random4 * 7) % 100; // Different seed for action variety

    // Level-based actions (deterministic per wallet)
    if (userProfile.level <= 3) {
      // Beginner actions
      dynamicActions.push({
        id: 'hero-mint-beginner',
        title: '⚔️ Create Your First DeFi Hero',
        description: 'Start your DeFi adventure with a unique NFT hero',
        reward: 'Welcome Bonus: 100 XP + Starter Kit',
        difficulty: 'Beginner',
        cost: '0.001',
        category: 'onboarding'
      });

      if (actionSeed > 30) {
        dynamicActions.push({
          id: 'basic-staking',
          title: '💰 Basic Staking Pool',
          description: 'Earn steady rewards with low-risk staking',
          reward: '8% APY + Learning Rewards',
          difficulty: 'Beginner',
          cost: '0.01',
          category: 'staking'
        });
      }
    }

    if (userProfile.level >= 4 && userProfile.level <= 7) {
      // Intermediate actions
      dynamicActions.push({
        id: 'yield-farming',
        title: '🌾 DeFi Yield Farming',
        description: 'Advanced yield farming strategies',
        reward: '15% APY + Strategy NFT',
        difficulty: 'Intermediate',
        cost: '0.05',
        category: 'farming'
      });

      if (actionSeed > 50) {
        dynamicActions.push({
          id: 'liquidity-provision',
          title: '💧 Provide Liquidity',
          description: 'Earn fees by providing liquidity to DEX',
          reward: 'LP Tokens + Trading Fees',
          difficulty: 'Intermediate',
          cost: '0.1',
          category: 'liquidity'
        });
      }
    }

    if (userProfile.level >= 8) {
      // Advanced actions
      dynamicActions.push({
        id: 'ai-portfolio-optimization',
        title: '🤖 AI Portfolio Optimization',
        description: 'Let AI optimize your DeFi strategy automatically',
        reward: 'Projected +25% APY increase',
        difficulty: 'Expert',
        cost: '0.2',
        category: 'advanced'
      });

      if (userProfile.isWhale) {
        dynamicActions.push({
          id: 'whale-exclusive-pool',
          title: '👑 Whale-Only High-Yield Pool',
          description: 'Exclusive access to premium staking with 30%+ APY',
          reward: 'Legendary Status + Exclusive NFTs',
          difficulty: 'Expert',
          cost: '1.0',
          category: 'premium'
        });
      }
    }

    // Social actions (based on viral potential)
    if (socialProfile.viralPotential > 0.3) {
      dynamicActions.push({
        id: 'viral-success-story',
        title: '🔥 Share Your Success Story',
        description: 'Auto-amplify your DeFi wins for massive reach',
        reward: `Cast3 Boost: ${Math.floor(socialProfile.viralPotential * 10000)} impressions`,
        difficulty: 'Social',
        cost: '0.001',
        category: 'viral'
      });
    }

    if (userProfile.isInfluencer && socialProfile.viralPotential > 0.6) {
      dynamicActions.push({
        id: 'ambassador-program',
        title: '📱 Become DeFi Hero Ambassador',
        description: 'Lead community growth and earn revenue sharing',
        reward: `Monthly Budget: $${Math.floor(socialProfile.viralPotential * 1000)}`,
        difficulty: 'Social',
        cost: 'Free',
        category: 'ambassador'
      });
    }

    const selectedAction = requested_action 
      ? dynamicActions.find(a => a.id === requested_action) || dynamicActions[0]
      : dynamicActions[0];

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      user_profile: {
        level: userProfile.level,
        expertise: userProfile.expertise,
        is_whale: userProfile.isWhale,
        is_influencer: userProfile.isInfluencer,
        is_new: userProfile.isNew
      },
      social_profile: {
        platform: socialProfile.platform,
        viral_potential: socialProfile.viralPotential,
        audience_size: socialProfile.audienceSize
      },
      available_actions: dynamicActions,
      selected_action: selectedAction,
      personalized_content: {
        title: selectedAction.title,
        message: `Ready for ${selectedAction.difficulty.toLowerCase()} level action?`,
        call_to_action: userProfile.isNew ? "🚀 Start your DeFi journey!" : "⚡ Continue your quest!"
      }
    };

    res.json(response);

  } catch (error) {
    console.error('❌ Dynamic Actions Error:', error);
    res.status(500).json({
      success: false,
      error: 'Dynamic action generation failed',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    endpoints: [
      '/api/sherry-miniapp',
      '/api/fuji-trigger',
      '/api/network-status',
      '/api/wallet/:address'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'DeFi Hero Quest API Server',
    version: '1.0.0',
    description: 'Sherry Minithon 2025 - API endpoints for DeFi Hero Quest triggers',
    endpoints: {
      sherry_miniapp: '/api/sherry-miniapp',
      fuji_triggers: '/api/fuji-trigger',
      network_status: '/api/network-status',
      wallet_info: '/api/wallet/:address',
      health: '/health'
    },
    documentation: 'See TRIGGER_BEHAVIOR_SPEC.md for detailed API documentation'
  });
});

// Función para obtener parámetros por acción
function getParametersForAction(action) {
  const baseParams = [
    {
      name: 'user_address',
      type: 'string',
      required: true,
      description: 'User wallet address',
      example: '0x8ba1f109551bd432803012645e93093c6c3bf34e'
    },
    {
      name: 'social_context',
      type: 'object',
      required: false,
      description: 'Social platform context',
      properties: {
        platform: { type: 'string', enum: ['twitter', 'discord', 'telegram'] },
        user_handle: { type: 'string' },
        post_content: { type: 'string' },
        engagement_level: { type: 'string', enum: ['low', 'medium', 'high'] }
      }
    }
  ];
  
  const actionSpecificParams = {
    'hero-mint': [
      {
        name: 'hero_class',
        type: 'integer',
        required: false,
        description: 'Hero class type (1-4)',
        enum: [1, 2, 3, 4],
        labels: ['DeFi Knight', 'Yield Wizard', 'Staking Ranger', 'LP Guardian'],
        default: 1
      },
      {
        name: 'hero_name',
        type: 'string',
        required: false,
        description: 'Custom hero name',
        max_length: 32,
        default: 'DeFi Hero'
      },
      {
        name: 'mint_fee',
        type: 'string',
        required: false,
        description: 'Minting fee in AVAX',
        default: '0.01'
      }
    ],
    'defi-quest': [
      {
        name: 'quest_type',
        type: 'integer',
        required: false,
        description: 'Type of DeFi quest',
        enum: [1, 2, 3, 4],
        labels: ['Yield Farming', 'Liquidity Providing', 'Staking', 'Trading'],
        default: 1
      },
      {
        name: 'stake_amount',
        type: 'string',
        required: false,
        description: 'Amount to stake in AVAX',
        minimum: '0.1',
        default: '1.0'
      },
      {
        name: 'duration',
        type: 'integer',
        required: false,
        description: 'Quest duration in days',
        enum: [7, 14, 30, 90],
        default: 30
      },
      {
        name: 'guild_id',
        type: 'string',
        required: false,
        description: 'Guild to join for bonus rewards'
      }
    ],
    'social-quest': [
      {
        name: 'content_type',
        type: 'string',
        required: false,
        description: 'Type of social content',
        enum: ['tutorial', 'strategy', 'review', 'community'],
        default: 'tutorial'
      },
      {
        name: 'content_hash',
        type: 'string',
        required: false,
        description: 'IPFS hash of the content'
      },
      {
        name: 'expected_quality',
        type: 'integer',
        required: false,
        description: 'Expected quality score (1-100)',
        minimum: 1,
        maximum: 100,
        default: 75
      }
    ],
    'bridge-quest': [
      {
        name: 'target_chain',
        type: 'string',
        required: false,
        description: 'Target blockchain for bridging',
        enum: ['base', 'ethereum', 'polygon'],
        default: 'base'
      },
      {
        name: 'bridge_amount',
        type: 'string',
        required: false,
        description: 'Amount to bridge in AVAX',
        minimum: '0.1',
        default: '1.0'
      }
    ]
  };
  
  return [
    ...baseParams,
    ...(actionSpecificParams[action] || [])
  ];
}

// Función para generar resultado de acción
function generateActionResult(action, userAddress, parameters) {
  const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
  const blockNumber = Math.floor(Math.random() * 1000000) + 5000000;
  
  const baseResult = {
    success: true,
    message: `${action} executed successfully`,
    transaction: {
      hash: txHash,
      block_number: blockNumber,
      gas_used: Math.floor(Math.random() * 100000) + 21000,
      network: 'avalanche-fuji',
      explorer_url: `https://testnet.snowtrace.io/tx/${txHash}`,
      timestamp: new Date().toISOString()
    },
    user_address: userAddress,
    action: action,
    parameters: parameters
  };
  
  // Agregar datos específicos por acción
  switch (action) {
    case 'hero-mint':
      baseResult.nft = {
        token_id: Math.floor(Math.random() * 10000) + 1,
        class: 'DeFi Knight',
        stats: {
          attack: Math.floor(Math.random() * 50) + 50,
          defense: Math.floor(Math.random() * 50) + 50,
          intelligence: Math.floor(Math.random() * 50) + 50,
          luck: Math.floor(Math.random() * 50) + 50
        },
        rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)]
      };
      break;
      
    case 'defi-quest':
      baseResult.quest = {
        quest_id: Math.floor(Math.random() * 10000) + 1,
        type: 'Yield Farming Master',
        stake_amount: parameters.stake_amount || '1.0',
        expected_apy: '12.4%',
        duration_days: parameters.duration || 30,
        status: 'active'
      };
      break;
      
    case 'social-quest':
      baseResult.social = {
        content_score: Math.floor(Math.random() * 40) + 60,
        tokens_earned: Math.floor(Math.random() * 100) + 50,
        xp_gained: Math.floor(Math.random() * 200) + 100,
        level_up: Math.random() > 0.7
      };
      break;
  }
  
  // Información social
  baseResult.social_sharing = {
    auto_share: true,
    platforms: ['twitter', 'discord', 'telegram'],
    message: `🎉 Just executed ${action} on DeFi Hero Quest! Join the adventure! 🚀`,
    hashtags: ['#DeFiHero', '#SherryMinithon', '#GameFi', '#Avalanche']
  };
  
  return baseResult;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: [
      '/api/sherry-miniapp',
      '/api/fuji-trigger',
      '/api/network-status',
      '/api/wallet/:address',
      '/health'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 DeFi Hero Quest API Server running on port ${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   - Sherry Mini-app: http://localhost:${PORT}/api/sherry-miniapp`);
  console.log(`   - Fuji Triggers: http://localhost:${PORT}/api/fuji-trigger`);
  console.log(`   - Network Status: http://localhost:${PORT}/api/network-status`);
  console.log(`   - Health Check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for: all origins (development mode)`);
  console.log(`🚀 Ready for Sherry Minithon 2025! Let's win this! 🏆`);
});

export default app; 