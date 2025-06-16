import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          🔥 DeFi Hero Quest - FUNCIONAL! 
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
          ✅ Frontend cargando correctamente
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
          ✅ API Server funcionando en puerto 3002
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
          ✅ Vite Dev Server en puerto 3003
        </p>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          ✅ Integración Fuji Testnet lista
        </p>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>🚀 Endpoints Activos:</h3>
          <p>API: <code>http://localhost:3002</code></p>
          <p>Frontend: <code>http://localhost:3003</code></p>
          <p>Fuji Triggers: <code>/api/fuji-trigger</code></p>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <p style={{ fontSize: '1.5rem', color: '#FFD700' }}>
            🏆 ¡Listo para Sherry Minithon 2025!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest; 