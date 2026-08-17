import React from 'react';

// Clean SVG Icons for All Major Social Platforms
export const SocialIconsMap = {
  instagram: {
    name: 'Instagram',
    buildUrl: (handle) => `https://instagram.com/${handle.replace('@', '').trim()}`,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  whatsapp: {
    name: 'WhatsApp',
    buildUrl: (phone) => `https://wa.me/${phone.replace(/[^0-9]/g, '')}`,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    )
  },
  tiktok: {
    name: 'TikTok',
    buildUrl: (handle) => `https://tiktok.com/@${handle.replace('@', '').trim()}`,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    )
  },
  facebook: {
    name: 'Facebook',
    buildUrl: (handle) => `https://facebook.com/${handle.replace('@', '').trim()}`,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    )
  },
  snapchat: {
    name: 'Snapchat',
    buildUrl: (handle) => `https://snapchat.com/add/${handle.replace('@', '').trim()}`,
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a6 6 0 0 0-6 6c0 3.5 1.5 5 1.5 6.5 0 .5-.5 1-1.5 1.5-1.5.7-1.5 1.5-1.5 1.5s.5.5 2.5.5c.5 0 1.5 0 2.5 1 1.2 1.2 2 1.5 2.5 1.5s1.3-.3 2.5-1.5c1-1 2-1 2.5-1 2 0 2.5-.5 2.5-.5s0-.8-1.5-1.5c-1-.5-1.5-1-1.5-1.5 0-1.5 1.5-3 1.5-6.5a6 6 0 0 0-6-6z"/>
      </svg>
    )
  },
  twitter: {
    name: 'X (Twitter)',
    buildUrl: (handle) => `https://x.com/${handle.replace('@', '').trim()}`,
    svg: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733-16z"/>
        <path d="M4 20l6.768-6.768m2.464-2.464l6.768-6.768"/>
      </svg>
    )
  }
};

export const SocialMediaBar = ({ handles = {} }) => {
  if (!handles || Object.keys(handles).length === 0) return null;

  const validEntries = Object.entries(handles).filter(([key, val]) => val && val.trim().length > 0 && SocialIconsMap[key]);

  if (validEntries.length === 0) return null;

  return (
    <div className="footer-social-links" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {validEntries.map(([platform, handle]) => {
        const item = SocialIconsMap[platform];
        if (!item) return null;
        const targetUrl = item.buildUrl(handle);

        return (
          <a
            key={platform}
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-btn"
            title={`${item.name}: @${handle.replace('@', '')}`}
            style={{
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {item.svg}
          </a>
        );
      })}
    </div>
  );
};
