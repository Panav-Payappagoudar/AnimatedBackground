import BackgroundScene from './BackgroundScene';

function App() {
  return (
    <div style={{ position: 'relative', margin: 0, padding: 0 }}>
      {/* 3D Background - Fixed */}
      <BackgroundScene />
      
      {/* Content overlay that is scrollable */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none', color: 'white', fontFamily: 'sans-serif', textAlign: 'center', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        
        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '4rem', fontWeight: 300, letterSpacing: '0.05em' }}>Ascend.</h1>
          <p style={{ margin: '10px 0 0', fontSize: '1.5rem', opacity: 0.8, fontWeight: 200 }}>Premium Web3 Marketing</p>
          <p style={{ marginTop: '50px', fontSize: '1rem', opacity: 0.5 }}>↓ Scroll to explore</p>
        </section>

        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: 300 }}>Powering the next generation</h2>
          <p style={{ maxWidth: '600px', margin: '20px auto 0', fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.6 }}>We help blockchain, crypto, NFT, and DeFi projects grow through community-first strategy and cutting-edge digital marketing.</p>
        </section>

        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: 300 }}>Trusted by Innovators</h2>
          <p style={{ maxWidth: '600px', margin: '20px auto 0', fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.6 }}>Partnering with forward-thinking startups, protocols, and metaverse brands shaping the future of the internet.</p>
        </section>

        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '3rem', fontWeight: 300 }}>Ready to ascend?</h2>
          <p style={{ maxWidth: '600px', margin: '20px auto 0', fontSize: '1.2rem', opacity: 0.8, lineHeight: 1.6 }}>Speak to your new marketing team today.</p>
        </section>

      </div>
    </div>
  );
}

export default App;
