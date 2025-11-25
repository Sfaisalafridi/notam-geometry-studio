import './PrivacyPolicy.css';

export function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: November 25, 2026</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>NOTAM Studio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our NOTAM parsing service.</p>
          <p>We collect:</p>
          <ul>
            <li>NOTAM text data that you paste into our service for parsing</li>
            <li>Basic usage analytics (page views, feature usage)</li>
            <li>Technical information (browser type, device type, IP address for security purposes)</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and improve our NOTAM parsing service</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Ensure the security and integrity of our service</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Storage and Security</h2>
          <p>Your NOTAM text data is processed in real-time and is not permanently stored on our servers. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.</p>
        </section>

        <section>
          <h2>4. Cookies and Tracking</h2>
          <p>We may use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser preferences.</p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>We may use third-party services for analytics and advertising (such as Google AdSense). These services have their own privacy policies and may collect data according to their terms.</p>
        </section>

        <section>
          <h2>6. Intellectual Property and Copyright</h2>
          <p><strong>All content, features, and functionality of NOTAM Studio (including but not limited to software, algorithms, design, text, graphics, and logos) are the exclusive property of NOTAM Studio and are protected by international copyright, trademark, and other intellectual property laws.</strong></p>
          <p>You may not:</p>
          <ul>
            <li>Copy, reproduce, or redistribute any part of our service without explicit written permission</li>
            <li>Use our content, algorithms, or design elements in your own projects or services</li>
            <li>Remove or modify any copyright notices, trademarks, or proprietary markings</li>
            <li>Reverse engineer, decompile, or attempt to extract the source code</li>
          </ul>
          <p className="warning"><strong>?? Unauthorized use of this service's content, algorithms, or any other intellectual property without proper attribution and written permission may result in legal action for copyright infringement, including but not limited to civil and criminal penalties under applicable copyright laws.</strong></p>
          <p>If you wish to use any content from NOTAM Studio, please contact us for permission at <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer">@Sfaisalafridi</a>.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or wish to request permission to use our content, please contact us:</p>
          <p>
            <a href="https://x.com/Sfaisalafridi" target="_blank" rel="noopener noreferrer">
              @Sfaisalafridi on X (Twitter)
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
