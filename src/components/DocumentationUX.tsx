import React, { useState } from 'react';

const DOC_SECTIONS = [
  { id: 'overview', label: 'Resumen Ejecutivo', icon: '🎯' },
  { id: 'sherry', label: 'Integración Sherry', icon: '🔗' },
  { id: 'architecture', label: 'Arquitectura', icon: '🏗️' },
  { id: 'features', label: 'Características', icon: '⚡' },
  { id: 'technical', label: 'Detalles Técnicos', icon: '🛠️' },
  { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
  { id: 'api', label: 'API Reference', icon: '📡' }
];

function OverviewSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2.2rem', marginBottom: 20 }}>🏆 DeFi Hero Quest - Sherry Minithon 2025</h1>
      <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #a855f7', borderRadius: 12, padding: 25, marginBottom: 30 }}>
        <h2 style={{ color: '#3b82f6', marginBottom: 10 }}>🎯 Visión del Proyecto</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
          <strong>DeFi Hero Quest</strong> es una plataforma revolucionaria de Social DeFi Gaming que transforma posts sociales en experiencias DeFi gamificadas. Un solo clic genera yields reales y viralidad social.
        </p>
      </div>
      {/* Agrega más bloques aquí según tu contenido */}
    </section>
  );
}

function SherryIntegrationSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>🔗 Integración con Sherry SDK</h1>
      <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid #a855f7', borderRadius: 12, padding: 25, marginBottom: 30 }}>
        <h2 style={{ color: '#3b82f6', marginBottom: 10 }}>Integración 100% Real</h2>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
          Nuestro proyecto utiliza el <strong>SDK oficial de Sherry</strong> sin simulaciones. Todas las transacciones son reales en Avalanche Fuji testnet con MetaMask.
        </p>
      </div>
      {/* Agrega más bloques aquí según tu contenido */}
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>🏗️ Arquitectura del Sistema</h1>
      {/* Agrega aquí tu contenido de arquitectura */}
    </section>
  );
}

function FeaturesSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>⚡ Características Principales</h1>
      {/* Agrega aquí tu contenido de características */}
    </section>
  );
}

function TechnicalSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>🛠️ Detalles Técnicos</h1>
      {/* Agrega aquí tu contenido técnico */}
    </section>
  );
}

function RoadmapSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>🗺️ Roadmap</h1>
      {/* Agrega aquí tu roadmap */}
    </section>
  );
}

function APIReferenceSection() {
  return (
    <section>
      <h1 style={{ color: '#a855f7', fontSize: '2rem', marginBottom: 20 }}>📡 API Reference</h1>
      {/* Agrega aquí tu referencia de API */}
    </section>
  );
}

export default function DocumentationUX() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div style={{ display: 'flex', minHeight: '80vh', background: 'rgba(15,23,42,0.7)' }}>
      {/* Sidebar */}
      <nav style={{
        minWidth: 220,
        background: 'rgba(30,41,59,0.98)',
        borderRight: '1px solid #a855f7',
        padding: '30px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 10
      }}>
        {DOC_SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: activeSection === sec.id ? 'linear-gradient(45deg, #a855f7, #3b82f6)' : 'transparent',
              color: activeSection === sec.id ? 'white' : '#cbd5e1',
              border: 'none',
              borderLeft: activeSection === sec.id ? '4px solid #a855f7' : '4px solid transparent',
              borderRadius: '0 8px 8px 0',
              padding: '12px 24px',
              fontWeight: activeSection === sec.id ? 700 : 400,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{sec.icon}</span> {sec.label}
          </button>
        ))}
      </nav>
      {/* Contenido */}
      <main style={{
        flex: 1,
        padding: '40px 5vw',
        minHeight: '80vh',
        overflowX: 'auto'
      }}>
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'sherry' && <SherryIntegrationSection />}
        {activeSection === 'architecture' && <ArchitectureSection />}
        {activeSection === 'features' && <FeaturesSection />}
        {activeSection === 'technical' && <TechnicalSection />}
        {activeSection === 'roadmap' && <RoadmapSection />}
        {activeSection === 'api' && <APIReferenceSection />}
      </main>
    </div>
  );
} 