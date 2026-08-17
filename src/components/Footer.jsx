import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, Send, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { SocialMediaBar } from './SocialIcons';

export const Footer = () => {
  const { storeInfo, setCurrentView, isAdminAuthenticated, setIsAdminLoginModalOpen } = useStore();

  const [clickCount, setClickCount] = useState(0);

  // Discreet covert trigger: Clicking the small (c) copyright 3 times opens the secret authentication
  const handleSecretCopyrightClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        if (isAdminAuthenticated) {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setIsAdminLoginModalOpen(true);
        }
        return 0;
      }
      return next;
    });

    setTimeout(() => setClickCount(0), 1200);
  };

  const handleNav = (view, sectionId = null) => {
    setCurrentView(view);
    if (sectionId && view === 'storefront') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact-section" className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Manifesto Column */}
          <div className="footer-brand-col">
            <div className="brand-logo" onClick={() => handleNav('storefront')}>
              <span className="brand-name">{storeInfo.storeName || 'FashionYourWay'}</span>
              <span className="brand-sub">LUXURY ATELIER</span>
            </div>

            <p className="footer-desc">
              {storeInfo.brandDescription || "FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way."}
            </p>

            {/* Clean Platform Logos (No Messy URLs) */}
            <SocialMediaBar handles={storeInfo.socialHandles || { instagram: storeInfo.instagram, whatsapp: storeInfo.whatsapp }} />
          </div>

          {/* Quick Links (Customer Only) */}
          <div>
            <h4 className="footer-col-title">Client Services</h4>
            <ul className="footer-links-list">
              <li>
                <button className="footer-link" onClick={() => handleNav('storefront', 'catalog-section')}>
                  Ready-to-Wear Catalog
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => handleNav('track')}>
                  Track Active Order
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => handleNav('storefront', 'statement-section')}>
                  Our Brand Philosophy
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => handleNav('storefront', 'contact-section')}>
                  Showroom & Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom Location & Operating Hours */}
          <div>
            <h4 className="footer-col-title">Showroom & Atelier</h4>
            
            <div className="footer-contact-item">
              <MapPin size={18} className="footer-contact-icon" />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Main Showroom:</strong>
                <span>{storeInfo.location || 'Plot 24, Lagos Avenue, East Legon'}</span>
                {storeInfo.city && <div style={{ color: '#E8A598', fontSize: '0.82rem' }}>{storeInfo.city}</div>}
              </div>
            </div>

            <div className="footer-contact-item">
              <Clock size={18} className="footer-contact-icon" />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Opening Hours:</strong>
                <span>{storeInfo.workingHours || 'Mon – Sat: 9:00 AM – 8:00 PM (GMT)'}</span>
              </div>
            </div>
          </div>

          {/* Direct Phone & Concierge */}
          <div>
            <h4 className="footer-col-title">Personal Concierge</h4>

            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Direct Line:</strong>
                <a href={`tel:${storeInfo.phone}`}>{storeInfo.phone || '+233 54 892 4432'}</a>
              </div>
            </div>

            {storeInfo.whatsapp && (
              <div className="footer-contact-item">
                <MessageSquare size={18} className="footer-contact-icon" />
                <div>
                  <strong style={{ color: '#FFFFFF', display: 'block' }}>WhatsApp Orders:</strong>
                  <a href={`https://wa.me/${storeInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
                    {storeInfo.whatsapp}
                  </a>
                </div>
              </div>
            )}

            <div className="footer-contact-item">
              <Mail size={18} className="footer-contact-icon" />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Inquiries & Styling:</strong>
                <a href={`mailto:${storeInfo.email}`}>{storeInfo.email || 'concierge@fashionyourway.com'}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            <span
              onClick={handleSecretCopyrightClick}
              style={{ cursor: 'default', userSelect: 'none' }}
              title=""
            >
              &copy;
            </span>{' '}
            {new Date().getFullYear()} {storeInfo.storeName || 'FashionYourWay'}. All Rights Reserved. Handcrafted with passion.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#E8A598' }}>Pink Burgundy Luxury Edition</span>
            <span>&middot;</span>
            <span style={{ color: 'rgba(255, 240, 243, 0.4)' }}>Haute Couture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
