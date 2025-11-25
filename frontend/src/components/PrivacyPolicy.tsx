import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <a href="/" className="close-button" aria-label="Close">×</a>
        </div>
        <p className="last-updated">Last updated: November 25, 2026</p>

        <section>
          <h2>1. Overview</h2>
          <p>NOTAM Studio is a privacy-first tool designed for aviation professionals. We believe in transparency and simplicity. <strong>We do not track you, store your data, or sell your information.</strong></p>
        </section>

        <section>
          <h2>2. Data Handling</h2>
          <p>When you use NOTAM Studio:</p>
          <ul>
            <li><strong>Input Data:</strong> The NOTAM text you paste is processed in real-time to extract geometry. It is not saved to any database.</li>
            <li><strong>Local Processing:</strong> Whenever possible, calculations are done locally or ephemerally on our servers.</li>
            <li><strong>No Cookies:</strong> We do not use tracking cookies or third-party analytics pixels.</li>
          </ul>
        </section>

        <section>
          <h2>3. Usage Rights & Credits</h2>
          <div className="usage-card">
            <h3>? You Are Free To:</h3>
            <ul>
              <li>Use this tool for personal or commercial aviation projects.</li>
              <li>Share screenshots, maps, and results in your reports, videos, or social media.</li>
              <li>Integrate the outputs into your workflow.</li>
            </ul>
            
            <div className="credit-requirement">
              <h3>?? Requirement: Give Credit</h3>
              <p>If you use NOTAM Studio in your public content (videos, articles, posts), you <strong>MUST</strong> credit the creator:</p>
              <div className="credit-box">
                <p>Created by <strong>@Sfaisalafridi</strong></p>
                <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer">https://x.com/Sfaisalafridi</a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>4. Copyright Notice</h2>
          <p className="warning">
            <strong>?? COPYRIGHT WARNING</strong><br/>
            The algorithms, design, and code of NOTAM Studio are the intellectual property of @Sfaisalafridi. 
            <strong>Unauthorized copying, reproduction, or use without credit is strictly prohibited and constitutes copyright infringement.</strong>
            We actively monitor for unauthorized use and will take legal action against violators.
          </p>
        </section>

        <section>
          <h2>5. Contact & Permissions</h2>
          <p>For permission requests, feature suggestions, or privacy questions, please contact the creator directly:</p>
          <div className="contact-section">
            <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer" className="contact-button">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Message @Sfaisalafridi
            </a>
          </div>
        </section>

        <div className="back-link-container">
          <a href="/" className="back-button">? Back to Map</a>
        </div>
      </div>
    </div>
  );
}
