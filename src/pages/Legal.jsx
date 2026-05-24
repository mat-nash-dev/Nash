import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const Legal = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <AnimatedSection>
        <h1 className="page-title">Legal <span className="gradient-text">Information</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Information regarding privacy, data collection, and terms of use based on international legal requirements.
        </p>
      </AnimatedSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <AnimatedSection delay={0.1}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Privacy Policy & Data Collection</h2>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                <strong>We do not collect your personal data for tracking or advertising.</strong> Signing up is solely to prevent botting, allow you to contact the site administrator, and post reviews under your identity.
              </p>
              <p>
                <strong>Information Automatically Collected:</strong> When you visit this website, we may collect your IP address and browser user agent to track the total number of unique visits and ensure website security. This data is only accessible to the site administrator.
              </p>
              <p>
                <strong>Authentication Data:</strong> If you sign in via Google or Discord, we receive basic profile information (like your email and name) provided by those services. We do not have access to your passwords for those services.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Cookies</h2>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                This website uses essential cookies necessary for authentication and session management (powered by Supabase). We do not use third-party tracking or advertising cookies.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Discord Integration</h2>
            <div style={{ color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p>
                By linking your Discord account, you grant this application permission to view your basic profile. If you choose to join the server via the website, we may use the provided Discord OAuth token to add you to the community server. This token is securely stored and only used for the permissions you explicitly granted.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Reference</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              These policies are designed to comply with general web legal requirements. For more information on website legal requirements, please refer to the <a href="https://termly.io/resources/articles/legal-requirements-for-websites/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Termly Legal Requirements Guide</a>.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Legal;
