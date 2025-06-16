import React, { useState } from 'react';

interface TriggerKitJob {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  lastRun: string;
  nextRun?: string;
  description: string;
  results?: any;
}

const TriggerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<TriggerKitJob[]>([
    {
      id: 'portfolio-rebalancer',
      name: '🔄 Portfolio Rebalancer',
      status: 'completed',
      lastRun: '2025-01-15T10:30:00Z',
      nextRun: '2025-01-16T10:30:00Z',
      description: 'Analyzes and optimizes user portfolios automatically via Sherry SDK',
      results: {
        currentAPY: 12.7,
        projectedAPY: 15.2,
        improvement: 2.5,
        heroStatBonus: { magic: 5, experience: 125, defense: 1 }
      }
    },
    {
      id: 'quest-monitor',
      name: '🎯 Quest Monitor',
      status: 'running',
      lastRun: '2025-01-15T14:15:00Z',
      description: 'Monitors quest progress and triggers completion rewards through Sherry',
      results: {
        completedQuests: 2,
        totalExpEarned: 750,
        totalCoinsEarned: 450
      }
    },
    {
      id: 'yield-optimizer',
      name: '📈 Yield Optimizer',
      status: 'completed',
      lastRun: '2025-01-15T12:00:00Z',
      nextRun: '2025-01-15T16:00:00Z',
      description: 'AI-powered yield farming optimization suggestions via Sherry protocols',
      results: {
        opportunities: 3,
        strategies: 2,
        aiAnalysis: { confidenceScore: 0.87, marketSentiment: 'bullish' }
      }
    },
    {
      id: 'social-notifications',
      name: '📢 Social Notification System',
      status: 'completed',
      lastRun: '2025-01-15T14:45:00Z',
      description: 'Sends social notifications through Sherry\'s multi-channel system',
      results: {
        deliveryCount: 4,
        successCount: 4,
        channels: ['sherry-app', 'push', 'email', 'discord']
      }
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<TriggerKitJob | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'failed': return '#ef4444';
      case 'scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'scheduled': return '⏰';
      default: return '⚪';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const triggerJob = async (jobId: string) => {
    // Simulate triggering a TriggerKit job through Sherry SDK
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'running' as const, lastRun: new Date().toISOString() }
        : job
    ));

    // Simulate job completion after 3 seconds
    setTimeout(() => {
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const }
          : job
      ));
    }, 3000);
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '20px',
      padding: '30px'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#a855f7', margin: '0 0 20px 0' }}>
        ⚡ TriggerKit Dashboard
      </h2>
      <p style={{ color: '#cbd5e1', marginBottom: '30px', margin: '0 0 30px 0' }}>
        Monitor and manage automated DeFi tasks powered by TriggerKit - 
        the official automation framework designed specifically for Sherry SDK integration.
      </p>

      {/* Why TriggerKit for Sherry */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#10b981' }}>
          🏆 Why TriggerKit + Sherry SDK is Perfect
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔗</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Native Sherry Integration</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Built specifically for Sherry SDK</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🌐</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Web3 Social Optimized</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Designed for social DeFi</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⚡</div>
            <div style={{ fontWeight: 'bold', color: '#a855f7' }}>Real-time Social Updates</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live social interactions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🛡️</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Blockchain Security</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Web3-native safety</div>
          </div>
        </div>
      </div>

      {/* Jobs Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            style={{
              background: 'rgba(71, 85, 105, 0.2)',
              border: `1px solid ${getStatusColor(job.status)}40`,
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: selectedJob?.id === job.id ? 'scale(1.02)' : 'scale(1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#cbd5e1' }}>
                {job.name}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                background: `${getStatusColor(job.status)}20`,
                padding: '4px 8px',
                borderRadius: '8px',
                border: `1px solid ${getStatusColor(job.status)}40`
              }}>
                <span>{getStatusIcon(job.status)}</span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: getStatusColor(job.status),
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {job.status}
                </span>
              </div>
            </div>
            
            <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              {job.description}
            </p>
            
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              <div>Last run: {formatDate(job.lastRun)}</div>
              {job.nextRun && (
                <div>Next run: {formatDate(job.nextRun)}</div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerJob(job.id);
              }}
              disabled={job.status === 'running'}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: job.status === 'running' 
                  ? 'rgba(71, 85, 105, 0.5)' 
                  : 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
                color: 'white',
                fontSize: '0.9rem',
                cursor: job.status === 'running' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              {job.status === 'running' ? '🔄 Running...' : '▶️ Trigger via Sherry'}
            </button>
          </div>
        ))}
      </div>

      {/* Job Details */}
      {selectedJob && (
        <div style={{
          background: 'rgba(71, 85, 105, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#a855f7' }}>
            Job Details: {selectedJob.name}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Status Information</h4>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                <div>Status: <span style={{ color: getStatusColor(selectedJob.status) }}>{selectedJob.status}</span></div>
                <div>Last Run: {formatDate(selectedJob.lastRun)}</div>
                {selectedJob.nextRun && <div>Next Run: {formatDate(selectedJob.nextRun)}</div>}
              </div>
            </div>
            
            {selectedJob.results && (
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Latest Results</h4>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {Object.entries(selectedJob.results).map(([key, value]) => (
                    <div key={key}>
                      {key}: <span style={{ color: '#10b981' }}>
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TriggerKit + Sherry Features */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '15px',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#a855f7' }}>🚀 TriggerKit + Sherry SDK Capabilities</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>⏰</div>
            <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Social Scheduled Jobs</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Community-driven automation</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔄</div>
            <div style={{ fontWeight: 'bold', color: '#10b981' }}>Smart Retry Logic</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Blockchain-aware recovery</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>Social Analytics</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Community insights</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🎮</div>
            <div style={{ fontWeight: 'bold', color: '#ef4444' }}>Gamified Triggers</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Quest-based automation</div>
          </div>
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0', color: '#a855f7', fontWeight: 'bold' }}>
            🎯 TriggerKit is the official automation framework for Sherry SDK, 
            providing seamless Web3 social automation with built-in gamification and community features!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TriggerDashboard;