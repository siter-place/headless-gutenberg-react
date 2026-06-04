import { useState } from 'react';
import { HelloWorld, WordPressPageRenderer } from '../../src';

export function App() {
  const [wpUrl, setWpUrl] = useState('');
  const [postId, setPostId] = useState('1');
  const [showWp, setShowWp] = useState(false);

  const handleLoad = () => {
    setShowWp(true);
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32, maxWidth: 960, margin: '0 auto' }}>
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

      <section
        style={{
          border: '1px solid #ddd',
          borderRadius: 12,
          padding: 24,
          marginTop: 24,
        }}
      >
        <h2>WordPress REST Test</h2>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 200 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>WordPress Base URL</span>
            <input
              type="text"
              data-testid="wp-url-input"
              value={wpUrl}
              onChange={(e) => setWpUrl(e.target.value)}
              placeholder="Leave empty to use proxy (local WP)"
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 100 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Post ID</span>
            <input
              type="number"
              data-testid="wp-post-id-input"
              value={postId}
              onChange={(e) => setPostId(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: 100 }}
            />
          </label>

          <button
            data-testid="wp-load-button"
            onClick={handleLoad}
            style={{
              alignSelf: 'flex-end',
              padding: '8px 20px',
              borderRadius: 6,
              border: '1px solid #0073aa',
              background: '#0073aa',
              color: 'white',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Load Post
          </button>
        </div>

        {showWp && (
          <div data-testid="wp-content-area">
            <WordPressPageRenderer
              wpBaseUrl={wpUrl || window.location.origin}
              id={Number(postId)}
              showTitle
              loadingFallback={
                <p data-testid="wp-loading">Loading WordPress content...</p>
              }
              errorFallback={
                <p data-testid="wp-error" style={{ color: '#d63638' }}>
                  Failed to load WordPress content. Make sure the WordPress
                  instance is running and CORS is configured.
                </p>
              }
            />
          </div>
        )}
      </section>
    </main>
  );
}
