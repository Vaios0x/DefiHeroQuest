import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction } from 'wagmi';


interface OnboardingTutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  // Hook para detectar tamaño de pantalla
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(130); // 2 minutos y 10 segundos para 11 pasos
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setCompletedSteps] = useState<number[]>([]);

  
  const { address, isConnected } = useAccount();
  const { } = useSendTransaction();

  const tutorialSteps = [
    {
      id: 0,
      title: "¡Bienvenido a DeFi Hero Quest! 🏰",
      content: "En 2 minutos dominarás el ecosistema DeFi más avanzado. ¡Empecemos tu aventura épica!",
      action: "start",
      duration: 8,
      highlight: ".tutorial-welcome",
      icon: "🚀"
    },
    {
      id: 1,
      title: "Conecta tu Wallet 💳",
      content: "Conecta tu wallet MetaMask con un solo clic para empezar tu aventura en Avalanche Fuji",
      action: "connect-wallet",
      duration: 12,
      highlight: ".connect-button",
      icon: "🔗"
    },
    {
      id: 2,
      title: "AI Actions con IA 🧠",
      content: "Acciones de IA personalizadas que optimizan tus rendimientos automáticamente usando machine learning",
      action: "explore-actions",
      duration: 12,
      highlight: ".dynamic-actions",
      icon: "🧠"
    },
    {
      id: 3,
      title: "Fuji Triggers ⚡",
      content: "Triggers automáticos en Avalanche Fuji que ejecutan transacciones basadas en condiciones del mercado",
      action: "setup-fuji-triggers",
      duration: 12,
      highlight: ".fuji-triggers",
      icon: "⚡"
    },
    {
      id: 4,
      title: "Hero Gallery ⚔️",
      content: "Explora tu colección de héroes NFT, stats, habilidades y mintea nuevos héroes",
      action: "explore-gallery",
      duration: 10,
      highlight: ".hero-gallery",
      icon: "⚔️"
    },
    {
      id: 5,
      title: "DeFi Quests 🏆",
      content: "Las quests te dan recompensas reales mientras aprendes DeFi y completas desafíos",
      action: "join-quest",
      duration: 10,
      highlight: ".quests-demo",
      icon: "🏆"
    },
    {
      id: 6,
      title: "Social Triggers 🌟",
      content: "Automatiza tu presencia social y gana recompensas por engagement en Twitter, Discord y más",
      action: "setup-social",
      duration: 10,
      highlight: ".social-triggers",
      icon: "🌟"
    },
    {
      id: 7,
      title: "Portfolio 💼",
      content: "Gestiona tu portfolio DeFi, visualiza rendimientos y optimiza tus inversiones",
      action: "manage-portfolio",
      duration: 10,
      highlight: ".portfolio",
      icon: "💼"
    },
    {
      id: 8,
      title: "Cross-Chain Bridge 🌉",
      content: "Transfiere activos entre Avalanche, Ethereum, BSC y Polygon con un solo clic",
      action: "explore-bridge",
      duration: 12,
      highlight: ".cross-chain-bridge",
      icon: "🌉"
    },
    {
      id: 9,
      title: "AI Agents 🤖",
      content: "Agentes de IA que trabajan 24/7 monitoreando oportunidades DeFi y ejecutando estrategias",
      action: "setup-ai-agents",
      duration: 12,
      highlight: ".ai-agents",
      icon: "🤖"
    },
    {
      id: 10,
      title: "Analytics Dashboard 📊",
      content: "Analiza métricas en tiempo real, TVL, usuarios activos y rendimiento del protocolo",
      action: "view-analytics",
      duration: 10,
      highlight: ".analytics",
      icon: "📊"
    }
  ];

  // Auto-iniciar el tutorial
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, timeRemaining]);

  const nextStep = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    setCurrentStep(prev => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const skipToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    localStorage.setItem('defi-hero-onboarding-completed', 'true');
    onComplete();
  };



  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div style={{
      background: 'transparent',
      borderRadius: '0',
      padding: '0',
      maxWidth: '100%',
      width: '100%'
    }}>
      <div style={{
        background: 'transparent',
        borderRadius: '0',
        padding: '0',
        border: 'none',
        boxShadow: 'none'
      }}>
        {/* Header del paso actual */}
        <div className="mobile-stack" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isMobile ? '20px' : '30px',
          padding: isMobile ? '0 5px' : '0 10px'
        }}>
          <div className="mobile-stack" style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '10px' : '15px'
          }}>
            <div style={{
              fontSize: isMobile ? '2rem' : '3rem',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              width: isMobile ? '60px' : '80px',
              height: isMobile ? '60px' : '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
              animation: 'glow 2s ease-in-out infinite'
            }}>
              {currentStepData?.icon}
            </div>
            <div>
              <h2 className="mobile-text-sm" style={{
                margin: '0 0 5px 0',
                fontSize: isMobile ? '1.2rem' : '1.8rem',
                fontWeight: '700',
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                {currentStepData?.title}
              </h2>
              <p className="mobile-text-sm" style={{
                margin: '0',
                color: '#94a3b8',
                fontSize: isMobile ? '0.8rem' : '1rem',
                fontWeight: '500'
              }}>
                Paso {currentStep + 1} de {tutorialSteps.length}
              </p>
            </div>
          </div>
          
          <div className="mobile-stack" style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '15px'
          }}>
            {/* Timer mejorado */}
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              padding: isMobile ? '8px 12px' : '12px 20px',
              borderRadius: isMobile ? '8px' : '12px',
              color: 'white',
              fontWeight: '700',
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '8px'
            }}>
              ⏱️ {timeRemaining}s
            </div>
          </div>
        </div>

        {/* Barra de progreso mejorada */}
        <div style={{ marginBottom: isMobile ? '20px' : '30px' }}>
          <div className="mobile-stack" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? '10px' : '15px'
          }}>
            <span className="mobile-text-sm" style={{
              fontSize: isMobile ? '0.8rem' : '1rem',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>
              {isMobile ? 'Progreso' : 'Progreso del Tutorial'}
            </span>
            <span className="mobile-text-sm" style={{
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              fontWeight: '700',
              color: '#3b82f6',
              background: 'rgba(59, 130, 246, 0.1)',
              padding: isMobile ? '3px 8px' : '4px 12px',
              borderRadius: isMobile ? '6px' : '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Barra de progreso principal */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: isMobile ? '8px' : '12px',
            height: isMobile ? '6px' : '8px',
            overflow: 'hidden',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
              height: '100%',
              borderRadius: isMobile ? '8px' : '12px',
              width: `${progress}%`,
              transition: 'all 0.5s ease',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }} />
          </div>
          
          {/* Indicadores de pasos */}
          <div className={isMobile ? 'mobile-hidden' : ''} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: isMobile ? '10px' : '15px',
            paddingLeft: '5px',
            paddingRight: '5px'
          }}>
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => skipToStep(index)}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: index <= currentStep 
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                    : 'rgba(71, 85, 105, 0.5)',
                  transform: index === currentStep ? 'scale(1.4)' : 'scale(1)',
                  boxShadow: index <= currentStep 
                    ? '0 4px 15px rgba(59, 130, 246, 0.4)' 
                    : 'none',
                  border: index === currentStep 
                    ? '2px solid white' 
                    : '1px solid rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentStep) {
                    e.currentTarget.style.transform = 'scale(1.2)';
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentStep) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = index <= currentStep 
                      ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                      : 'rgba(71, 85, 105, 0.5)';
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Contenido principal del paso */}
        <div className="card-mobile" style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(30, 41, 59, 0.3) 100%)',
          borderRadius: isMobile ? '15px' : '20px',
          padding: isMobile ? '20px' : '35px',
          marginBottom: isMobile ? '20px' : '30px',
          minHeight: isMobile ? '220px' : '280px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Efecto de fondo decorativo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 className="mobile-text-sm" style={{
              margin: isMobile ? '0 0 15px 0' : '0 0 20px 0',
              fontSize: isMobile ? '1.2rem' : '1.6rem',
              fontWeight: '700',
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.2'
            }}>
              {currentStepData?.title}
            </h3>
            <p className="mobile-text-sm" style={{
              margin: isMobile ? '0 0 20px 0' : '0 0 30px 0',
              color: '#cbd5e1',
              fontSize: isMobile ? '0.9rem' : '1.1rem',
              lineHeight: '1.6',
              fontWeight: '400'
            }}>
              {currentStepData?.content}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentStep === 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎮</div>
                <p style={{
                  color: '#e2e8f0',
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  Te guiaremos paso a paso para que domines todas las funcionalidades de DeFi Hero Quest.
                </p>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <h4 style={{ color: '#3b82f6', margin: '0 0 15px 0', fontWeight: '600' }}>
                    🎯 Lo que aprenderás:
                  </h4>
                  <div style={{ textAlign: 'left', color: '#cbd5e1' }}>
                    <div style={{ marginBottom: '8px' }}>• 🔗 Conectar tu wallet MetaMask</div>
                    <div style={{ marginBottom: '8px' }}>• 🧠 Usar AI Actions (IA)</div>
                    <div style={{ marginBottom: '8px' }}>• ⚡ Configurar Fuji Triggers</div>
                    <div style={{ marginBottom: '8px' }}>• ⚔️ Explorar Hero Gallery</div>
                    <div style={{ marginBottom: '8px' }}>• 🏆 Participar en DeFi Quests</div>
                    <div style={{ marginBottom: '8px' }}>• 🌟 Configurar Social Triggers</div>
                    <div style={{ marginBottom: '8px' }}>• 💼 Gestionar Portfolio</div>
                    <div style={{ marginBottom: '8px' }}>• 🌉 Cross-Chain Bridge</div>
                    <div style={{ marginBottom: '8px' }}>• 🤖 AI Agents Avanzados</div>
                    <div>• 📊 Analytics Dashboard</div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div style={{ textAlign: 'center' }}>
                {!isConnected ? (
                  <div>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔗</div>
                    <div style={{ marginBottom: '25px' }}>
                      <ConnectButton />
                    </div>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'left'
                    }}>
                      <h4 style={{ color: '#10b981', margin: '0 0 15px 0', fontWeight: '600' }}>
                        💡 ¿Por qué conectar tu wallet?
                      </h4>
                      <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        <div style={{ marginBottom: '8px' }}>• Tu wallet es tu identidad en DeFi</div>
                        <div style={{ marginBottom: '8px' }}>• Permite realizar transacciones seguras</div>
                        <div style={{ marginBottom: '8px' }}>• Guarda tus NFTs y tokens automáticamente</div>
                        <div>• Solo tú tienes control de tus fondos</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#10b981' }}>✅</div>
                    <p style={{ color: '#10b981', fontWeight: '700', fontSize: '1.2rem', marginBottom: '10px' }}>
                      ¡Wallet conectada exitosamente!
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>
                      Dirección: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '12px',
                      padding: '15px'
                    }}>
                      <p style={{ color: '#10b981', margin: '0', fontSize: '0.9rem' }}>
                        🎉 ¡Perfecto! Ahora puedes interactuar con la blockchain de Avalanche
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
                <h3 style={{ color: '#8b5cf6', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  AI Actions: IA que Trabaja para Ti
                </h3>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#8b5cf6', margin: '0 0 20px 0', fontWeight: '600', textAlign: 'center' }}>
                    🤖 IA Actions Disponibles:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🎯</span>
                      <div>
                        <p style={{ color: '#22c55e', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Yield Hunter AI
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Encuentra automáticamente los mejores pools de farming
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🛡️</span>
                      <div>
                        <p style={{ color: '#ef4444', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Risk Manager
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Protege tus fondos con stop-loss automático
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>⚡</span>
                      <div>
                        <p style={{ color: '#3b82f6', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Arbitrage Bot
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Aprovecha diferencias de precio entre DEXs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#f59e0b', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "🧠 AI Actions" para configurar tu primera IA
                  </p>
                </div>
              </div>
            )}

            {/* Paso 3: Fuji Triggers */}
            {currentStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚡</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  Fuji Triggers Avanzados ⚡
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 20px 0', fontWeight: '600', textAlign: 'center' }}>
                    ⚡ Triggers Configurados:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>📈</span>
                        <div>
                          <p style={{ color: '#10b981', fontWeight: '600', margin: '0' }}>
                            Price Alert AVAX &gt; $50
                          </p>
                          <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: '0' }}>
                            Compra automática cuando AVAX sube
                          </p>
                        </div>
                      </div>
                      <span style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        Activo
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🌾</span>
                        <div>
                          <p style={{ color: '#10b981', fontWeight: '600', margin: '0' }}>
                            Auto-Harvest Rewards
                          </p>
                          <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: '0' }}>
                            Recolecta rewards cada 24h
                          </p>
                        </div>
                      </div>
                      <span style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#8b5cf6', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "⚡ Fuji Triggers" para configurar más automatizaciones
                  </p>
                </div>
              </div>
            )}

            {/* Paso 4: Hero Gallery */}
            {currentStep === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚔️</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  Hero Gallery: Tu Colección NFT
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    ⚔️ Tu Colección de Héroes:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🗡️</span>
                      <div>
                        <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Newbie Knight (Gratis)
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Level 1 | +5% APY bonus | Basic Attack
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🏹</span>
                      <div>
                        <p style={{ color: '#8b5cf6', fontWeight: '600', margin: '0 0 5px 0' }}>
                          DeFi Archer (Rare)
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Level 3 | +12% APY bonus | Precision Strike
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#3b82f6', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "⚔️ Hero Gallery" para mintear más héroes
                  </p>
                </div>
              </div>
            )}

            {/* Paso 5: DeFi Quests */}
            {currentStep === 5 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏆</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  DeFi Quests: Aprende y Gana
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    🎯 Quest Recomendada: "DeFi Beginner's Journey"
                  </h4>
                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '12px' }}>• 💰 Recompensa: 50 HERO tokens + NFT badge</div>
                    <div style={{ marginBottom: '12px' }}>• ⏱️ Duración: 3 días</div>
                    <div style={{ marginBottom: '12px' }}>• 📚 Aprende: Staking, Yield Farming, LP tokens</div>
                    <div style={{ marginBottom: '12px' }}>• 🎮 Actividades: 5 transacciones DeFi reales</div>
                    <div>• 🏅 Dificultad: Principiante</div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#10b981', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "🏆 DeFi Quests" para unirte a tu primera quest
                  </p>
                </div>
              </div>
            )}

            {/* Paso 6: Social Triggers */}
            {currentStep === 6 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌟</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  Social Triggers: Automatiza tu Presencia
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    🌟 Social Triggers Activos:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🐦</span>
                      <div>
                        <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Twitter Engagement Bot
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Auto-like y retweet de contenido DeFi relevante
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>💬</span>
                      <div>
                        <p style={{ color: '#8b5cf6', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Discord Announcer
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Anuncia tus logros DeFi automáticamente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#3b82f6', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "🌟 Social Triggers" para configurar más automatizaciones
                  </p>
                </div>
              </div>
            )}

            {/* Paso 7: Portfolio */}
            {currentStep === 7 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💼</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  Portfolio: Gestiona tus Inversiones
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    💼 Tu Portfolio DeFi:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>Total Value Locked</span>
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '1.1rem' }}>$2,847.32</span>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#3b82f6', fontWeight: '600' }}>APY Promedio</span>
                        <span style={{ color: '#3b82f6', fontWeight: '700', fontSize: '1.1rem' }}>18.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#8b5cf6', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "💼 Portfolio" para optimizar tus inversiones
                  </p>
                </div>
              </div>
            )}

            {/* Paso 8: Cross-Chain Bridge */}
            {currentStep === 8 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌉</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  Cross-Chain Bridge: Conecta Ecosistemas
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    🌉 Bridges Disponibles:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ color: '#10b981', fontWeight: '600', margin: '0' }}>
                          Avalanche ↔ Ethereum
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: '0' }}>
                          Fee: 0.1% | Tiempo: ~15 min
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ color: '#3b82f6', fontWeight: '600', margin: '0' }}>
                          Avalanche ↔ Polygon
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.8rem', margin: '0' }}>
                          Fee: 0.05% | Tiempo: ~5 min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#8b5cf6', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "🌉 Cross-Chain" para transferir activos
                  </p>
                </div>
              </div>
            )}

            {/* Paso 9: AI Agents */}
            {currentStep === 9 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤖</div>
                <h3 style={{ color: '#8b5cf6', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  AI Agents: Automatización Avanzada
                </h3>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#8b5cf6', margin: '0 0 20px 0', fontWeight: '600', textAlign: 'center' }}>
                    🤖 AI Agents Configurados:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🎯</span>
                      <div>
                        <p style={{ color: '#10b981', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Portfolio Optimizer
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Rebalancea tu portfolio automáticamente 24/7
                        </p>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>🛡️</span>
                      <div>
                        <p style={{ color: '#ef4444', fontWeight: '600', margin: '0 0 5px 0' }}>
                          Risk Guardian
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0' }}>
                          Monitorea riesgos y ejecuta stop-loss inteligentes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#f59e0b', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    💡 Tip: Ve a la pestaña "🤖 AI Agents" para configurar más agentes
                  </p>
                </div>
              </div>
            )}

            {/* Paso 10: Analytics Dashboard */}
            {currentStep === 10 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
                <h3 style={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>
                  ¡Felicidades! Dominas DeFi Hero Quest 🎉
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(234, 88, 12, 0.2) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'left'
                }}>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 15px 0', fontWeight: '700', textAlign: 'center' }}>
                    📊 Analytics Dashboard:
                  </h4>
                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '12px' }}>• 📈 TVL en tiempo real: $15.42M</div>
                    <div style={{ marginBottom: '12px' }}>• 👥 Usuarios activos: 2,847</div>
                    <div style={{ marginBottom: '12px' }}>• 💰 Volumen 24h: $3.2M</div>
                    <div style={{ marginBottom: '12px' }}>• ⚡ Transacciones: 8,932</div>
                    <div>• 🏆 Ranking: #1 en Avalanche DeFi</div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <p style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '700', textAlign: 'center' }}>
                    🚀 ¡Ahora eres un DeFi Hero!
                  </p>
                  <p style={{ color: '#cbd5e1', margin: '0', fontSize: '0.9rem', textAlign: 'center' }}>
                    Explora todas las pestañas y empieza a generar rendimientos reales
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Botón de navegación simplificado */}
        <div style={{
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '30px'
        }}>
          {currentStep === tutorialSteps.length - 1 ? (
            <button
              onClick={handleComplete}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '700',
                fontSize: '1.2rem',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
              }}
            >
              🎉 ¡Empezar a Usar DeFi Hero Quest!
            </button>
          ) : (
            <button
              onClick={nextStep}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '700',
                fontSize: '1.2rem',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial; 