import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: November 25, 2026</p>

        <section>
          <h2>1. What We Collect</h2>
          <p>NOTAM Studio is a simple, privacy-focused tool. We only process the NOTAM text you paste into our service to parse and display geometry. <strong>We do not store your data, track you, or collect any personal information.</strong></p>
        </section>

        <section>
          <h2>2. How It Works</h2>
          <p>When you paste NOTAM text:</p>
          <ul>
            <li>The text is sent to our server for parsing</li>
            <li>The geometry is extracted and sent back to your browser</li>
            <li>Nothing is saved or logged</li>
          </ul>
          <p>That's it. No tracking, no cookies, no data collection.</p>
        </section>

        <section>
          <h2>3. Using Our Service & Content</h2>
          <p><strong>YOU ARE FREE TO USE NOTAM STUDIO AND SHARE IT IN YOUR CONTENT!</strong></p>
          <p>You may:</p>
          <ul>
            <li>? Use this tool for your aviation work</li>
            <li>? Share screenshots or results in your content (videos, articles, social media)</li>
            <li>? Reference or mention NOTAM Studio in your projects</li>
          </ul>
          <p className="credit-requirement"><strong>REQUIREMENT: You MUST give credit to @Sfaisalafridi</strong></p>
          <p>When using our service or content in your work, you must:</p>
          <ul>
            <li>Mention <strong>@Sfaisalafridi</strong> (or link to <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer">https://x.com/Sfaisalafridi</a>)</li>
            <li>Include the website name: <strong>NOTAM Studio</strong></li>
          </ul>
        </section>

        <section>
          <h2>4. Copyright Protection</h2>
          <p className="warning">
            <strong>?? WARNING: Using our service, algorithms, or content WITHOUT giving proper credit to @Sfaisalafridi is copyright infringement and will result in legal action.</strong>
          </p>
          <p>You MAY NOT:</p>
          <ul>
            <li>? Copy our code, algorithms, or design without permission</li>
            <li>? Use our service in your content WITHOUT crediting @Sfaisalafridi</li>
            <li>? Claim our work as your own</li>
            <li>? Remove or hide our branding</li>
          </ul>
          <p>All intellectual property rights belong to NOTAM Studio and are protected by copyright law.</p>
        </section>

        <section>
          <h2>5. Changes to This Policy</h2>
          <p>We may update this policy. Check back occasionally for changes.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>Questions? Need permission for special use cases?</p>
          <p>
            <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer" className="contact-link">
              Contact @Sfaisalafridi on X (Twitter)
            </a>
          </p>
        </section>

        <div className="back-link">
          <a href="/">? Back to NOTAM Studio</a>
        </div>
      </div>
    </div>
  );
}
