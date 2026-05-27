import LiquidEther from './LiquidEther';
import './App.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', margin: 0, padding: 0 }}>
      <LiquidEther
        colors={[ '#5227FF', '#FF9FFC', '#B497CF' ]}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', zIndex: 10, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <h1 style={{ margin: 0, fontSize: '3rem' }}>LiquidEther</h1>
        <p style={{ margin: '10px 0 0', fontSize: '1.2rem', opacity: 0.8 }}>Move your mouse to interact</p>
      </div>
    </div>
  );
}

export default App;
