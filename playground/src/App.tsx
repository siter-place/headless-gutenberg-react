import { HelloWorld } from '../../src';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <h1>Headless Gutenberg React Playground</h1>
      <p>This is the local development playground for the package.</p>

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 24,
          marginTop: 24,
        }}
      >
        <h2>Phase 1 Component</h2>
        <HelloWorld name="Siter" />
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Future WordPress REST Test Area</h2>
        <p>
          Later this playground will connect to a local WordPress REST endpoint and render
          Gutenberg content.
        </p>
      </section>
    </main>
  );
}
