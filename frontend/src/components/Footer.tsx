import './Footer.css';

export function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <a 
          href="https://x.com/Sfaisalafridi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="twitter-link"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          @Sfaisalafridi
        </a>
        <span className="separator">•</span>
        <a href="/privacy" className="privacy-link">Privacy Policy</a>
        <span className="separator">•</span>
        <span className="copyright">© 2024 NOTAM Studio</span>
      </div>
    </div>
  );
}
