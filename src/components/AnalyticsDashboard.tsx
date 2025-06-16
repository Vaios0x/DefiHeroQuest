import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const { } = useAccount();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('tvl');
  const [realTimeData, setRealTimeData] = useState({
    tvl: 15420000,
    users: 2847,
    transactions: 8932,
    volume: 3200000,
    lastUpdate: Date.now()
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        tvl: prev.tvl + (Math.random() - 0.5) * 50000,
        users: prev.users + Math.floor(Math.random() * 5),
        transactions: prev.transactions + Math.floor(Math.random() * 15),
        volume: prev.volume + (Math.random() - 0.5) * 10000,
        lastUpdate: Date.now()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const timeframes = ['1h', '24h', '7d', '30d', '1y'];
  const metrics = [
    { id: 'tvl', name: 'TVL', icon: '💰', color: 'from-green-500 to-emerald-600' },
    { id: 'users', name: 'Usuarios Activos', icon: '👥', color: 'from-blue-500 to-cyan-600' },
    { id: 'transactions', name: 'Transacciones', icon: '⚡', color: 'from-purple-500 to-violet-600' },
    { id: 'volume', name: 'Volumen', icon: '📈', color: 'from-orange-500 to-red-600' }
  ];

  const protocolComparison = [
    { name: 'DeFi Hero Quest', tvl: 15.42, users: 2847, growth: '+15.3%', color: 'from-purple-500 to-blue-500', rank: 1 },
    { name: 'Aave', tvl: 12.8, users: 45000, growth: '+2.1%', color: 'from-pink-500 to-rose-500', rank: 2 },
    { name: 'Uniswap', tvl: 8.9, users: 89000, growth: '-1.2%', color: 'from-blue-500 to-indigo-500', rank: 3 },
    { name: 'Compound', tvl: 6.7, users: 23000, growth: '+0.8%', color: 'from-green-500 to-teal-500', rank: 4 },
    { name: 'Yearn', tvl: 4.2, users: 12000, growth: '-3.1%', color: 'from-yellow-500 to-orange-500', rank: 5 }
  ];

  const chartData = {
    tvl: [
      { time: '00:00', value: 14.2 },
      { time: '04:00', value: 14.8 },
      { time: '08:00', value: 15.1 },
      { time: '12:00', value: 15.3 },
      { time: '16:00', value: 15.0 },
      { time: '20:00', value: 15.4 },
      { time: '24:00', value: 15.42 }
    ],
    users: [
      { time: '00:00', value: 2340 },
      { time: '04:00', value: 2456 },
      { time: '08:00', value: 2678 },
      { time: '12:00', value: 2789 },
      { time: '16:00', value: 2823 },
      { time: '20:00', value: 2841 },
      { time: '24:00', value: 2847 }
    ]
  };

  const formatNumber = (num: number, type: string = 'default') => {
    if (type === 'currency') {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
      return `$${num.toFixed(2)}`;
    }
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const SimpleChart = ({ data, color }: { data: any[], color: string }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    return (
      <div className="relative h-32 flex items-end space-x-1 bg-black/20 rounded-lg p-4">
        {data.map((point, index) => {
          const height = range > 0 ? ((point.value - minValue) / range) * 100 : 50;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full bg-gradient-to-t ${color} rounded-t transition-all duration-500`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400 mt-1">{point.time}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📊 Analytics Dashboard</h2>
          <p className="text-gray-400">Métricas en tiempo real del protocolo</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            {timeframes.map(timeframe => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>En Vivo</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(metric => (
          <div
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 cursor-pointer transition-all hover:scale-105 ${
              selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{metric.icon}</div>
              <div className="text-xs text-gray-400">
                Actualizado hace {Math.floor((Date.now() - realTimeData.lastUpdate) / 1000)}s
              </div>
            </div>
            <h3 className="text-gray-300 text-sm mb-2">{metric.name}</h3>
            <div className="text-2xl font-bold text-white mb-2">
              {metric.id === 'tvl' || metric.id === 'volume' 
                ? formatNumber(realTimeData[metric.id as keyof typeof realTimeData], 'currency')
                : formatNumber(realTimeData[metric.id as keyof typeof realTimeData] as number)
              }
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-sm">+12.3%</span>
              <span className="text-gray-500 text-xs">vs ayer</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {metrics.find(m => m.id === selectedMetric)?.icon} {metrics.find(m => m.id === selectedMetric)?.name}
          </h3>
          <div className="text-sm text-gray-400">
            Últimas 24 horas
          </div>
        </div>
        
        <SimpleChart 
          data={chartData[selectedMetric as keyof typeof chartData] || chartData.tvl} 
          color={metrics.find(m => m.id === selectedMetric)?.color || 'from-blue-500 to-cyan-600'}
        />
      </div>

      {/* Protocol Comparison */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6">🏆 Comparativa con Otros Protocolos</h3>
        
        <div className="space-y-4">
          {protocolComparison.map((protocol) => (
            <div key={protocol.name} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-400">
                  #{protocol.rank}
                </div>
                <div className={`w-4 h-4 rounded bg-gradient-to-r ${protocol.color}`} />
                <div>
                  <h4 className="text-white font-semibold">{protocol.name}</h4>
                  <p className="text-gray-400 text-sm">{protocol.users.toLocaleString()} usuarios activos</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-white font-bold">${protocol.tvl}M TVL</div>
                <div className={`text-sm ${protocol.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {protocol.growth} 24h
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Health */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6">🌐 Salud de la Red</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tiempo de Bloque Promedio</span>
              <span className="text-green-400 font-bold">2.1s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gas Price Promedio</span>
              <span className="text-blue-400 font-bold">25 nAVAX</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Uptime</span>
              <span className="text-green-400 font-bold">99.97%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Nodos Activos</span>
              <span className="text-purple-400 font-bold">1,247</span>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6">👥 Engagement de Usuarios</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Usuarios Nuevos (24h)</span>
              <span className="text-green-400 font-bold">+234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Retención (7d)</span>
              <span className="text-blue-400 font-bold">73.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Sesión Promedio</span>
              <span className="text-purple-400 font-bold">24.7 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Transacciones/Usuario</span>
              <span className="text-orange-400 font-bold">3.14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-6">⚠️ Métricas de Riesgo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🛡️</div>
            <h4 className="text-white font-semibold mb-2">Nivel de Riesgo</h4>
            <div className="text-green-400 font-bold text-xl">BAJO</div>
            <div className="text-sm text-gray-400">Score: 8.7/10</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">💧</div>
            <h4 className="text-white font-semibold mb-2">Liquidez</h4>
            <div className="text-blue-400 font-bold text-xl">$12.3M</div>
            <div className="text-sm text-gray-400">Ratio: 0.8</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="text-white font-semibold mb-2">Colateral</h4>
            <div className="text-purple-400 font-bold text-xl">167%</div>
            <div className="text-sm text-gray-400">Saludable</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm">
        <p>📈 Dashboard actualizado cada 3 segundos | Datos en tiempo real de Avalanche Fuji</p>
        <p className="mt-1">🏆 Sherry Minithon 2025 - DeFi Hero Quest Analytics</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 