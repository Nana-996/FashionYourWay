import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SocialMediaBar } from '../SocialIcons';
import {
  Save,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  Share2
} from 'lucide-react';

export const AdminStoreSettings = () => {
  const {
    storeInfo,
    updateStoreInfo,
    resetDemoData,
    adminPasskey,
    changeAdminPasskey,
    setCurrentView,
    formatCurrency
  } = useStore();

  const [formData, setFormData] = useState({
    storeName: storeInfo.storeName || 'FashionYourWay',
    tagline: storeInfo.tagline || 'Own the Room. Fashion Designed Your Way.',
    brandDescription: storeInfo.brandDescription || "FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way.",
    location: storeInfo.location || 'Plot 24, Lagos Avenue, East Legon',
    city: storeInfo.city || 'Accra, Ghana',
    landmark: storeInfo.landmark || 'Near A&C Mall & Mensvic Grand Hotel',
    phone: storeInfo.phone || '+233 54 892 4432',
    whatsapp: storeInfo.whatsapp || '+233 55 901 8822',
    email: storeInfo.email || 'concierge@fashionyourway.com',
    workingHours: storeInfo.workingHours || 'Monday – Saturday: 9:00 AM – 8:00 PM (GMT) | Sunday: 12:00 PM – 6:00 PM',
    noticeBanner: storeInfo.noticeBanner || "✨ RUNWAY DROP: Enjoy Complimentary Delivery Across Ghana on Orders Over GH₵ 800 with code 'ACCRAVELVET'",
    currencySymbol: storeInfo.currencySymbol || 'GH₵',
    standardShippingFee: storeInfo.standardShippingFee ?? 45,
    expressShippingFee: storeInfo.expressShippingFee ?? 85,
    freeShippingThreshold: storeInfo.freeShippingThreshold ?? 800,
    socialHandles: {
      instagram: storeInfo.socialHandles?.instagram || storeInfo.instagram || 'fashionyourway_gh',
      tiktok: storeInfo.socialHandles?.tiktok || 'fashionyourway_gh',
      whatsapp: storeInfo.socialHandles?.whatsapp || storeInfo.whatsapp || '+233559018822',
      facebook: storeInfo.socialHandles?.facebook || 'FashionYourWayGhana',
      snapchat: storeInfo.socialHandles?.snapchat || 'fashionyourway',
      twitter: storeInfo.socialHandles?.twitter || 'fashionyourway'
    }
  });

  const [newPasskeyInput, setNewPasskeyInput] = useState('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSocialChange = (platform, val) => {
    setFormData(prev => ({
      ...prev,
      socialHandles: {
        ...prev.socialHandles,
        [platform]: val
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStoreInfo(formData);
    if (newPasskeyInput.trim()) {
      changeAdminPasskey(newPasskeyInput.trim());
      setNewPasskeyInput('');
    }
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 5000);
  };

  const handleVerifyInFooter = () => {
    setCurrentView('storefront');
    setTimeout(() => {
      const footer = document.getElementById('contact-section');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Main Settings Card */}
      <div className="admin-settings-card" style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF' }}>
              Store Profile, Location, Contacts & Social Handles
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 240, 243, 0.7)' }}>
              Ghanaian boutique address, phone numbers, social media handles, and brand description. All changes instantly update the public customer storefront and footer.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleVerifyInFooter}
              style={{ gap: '6px' }}
              title="See how the updated details appear to clients in the footer"
            >
              <Eye size={15} />
              <span>Verify in Live Footer</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={resetDemoData}
              title="Reset to initial curated data"
            >
              <RefreshCw size={14} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {showSavedNotification && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '10px',
              padding: '12px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#86EFAC',
              fontSize: '0.9rem',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} />
              <span><strong>Changes Saved!</strong> Showroom location, phone numbers and social media logos are now live on the website.</span>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleVerifyInFooter}
              style={{ padding: '6px 14px', fontSize: '0.78rem' }}
            >
              View in Footer &rarr;
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="form-grid">
          {/* Section 1: Location & Contact Details */}
          <div className="form-grid-full">
            <div className="admin-settings-section-title">
              <MapPin size={18} color="#E8A598" />
              <span>Boutique Showroom Address & Direct Contacts (Ghana)</span>
            </div>
          </div>

          <div className="form-group form-grid-full">
            <label>Showroom / Store Physical Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. Plot 24, Lagos Avenue, East Legon"
              className="form-input"
              value={formData.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>City & Country *</label>
            <input
              type="text"
              required
              placeholder="e.g. Accra, Ghana"
              className="form-input"
              value={formData.city}
              onChange={e => handleChange('city', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Popular Landmark / Area Guide</label>
            <input
              type="text"
              placeholder="e.g. Near A&C Mall / Mensvic Grand Hotel"
              className="form-input"
              value={formData.landmark}
              onChange={e => handleChange('landmark', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Main Store Phone Number (Direct Call Line) *</label>
            <input
              type="text"
              required
              placeholder="e.g. +233 54 892 4432"
              className="form-input"
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>WhatsApp Orders & Concierge Line</label>
            <input
              type="text"
              placeholder="e.g. +233 55 901 8822"
              className="form-input"
              value={formData.whatsapp}
              onChange={e => handleChange('whatsapp', e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Customer Support & Inquiries Email *</label>
            <input
              type="email"
              required
              placeholder="concierge@fashionyourway.com"
              className="form-input"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Showroom Working & Operating Hours</label>
            <input
              type="text"
              placeholder="e.g. Monday – Saturday: 9:00 AM – 8:00 PM (GMT) | Sunday: 12:00 PM – 6:00 PM"
              className="form-input"
              value={formData.workingHours}
              onChange={e => handleChange('workingHours', e.target.value)}
            />
          </div>

          {/* Section 2: Clean Social Media Handles (No Messy URLs) */}
          <div className="form-grid-full" style={{ marginTop: '16px' }}>
            <div className="admin-settings-section-title">
              <Share2 size={18} color="#E8A598" />
              <span>Social Media Handles (Auto-Generates Official Clickable Logos)</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,240,243,0.7)', marginTop: '-12px', marginBottom: '14px' }}>
              Enter just your usernames/handles below. The website automatically publishes clean official platform logos that take clients directly to your profiles when clicked.
            </p>
          </div>

          <div className="form-group">
            <label>Instagram Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#E8A598', fontSize: '0.9rem' }}>@</span>
              <input
                type="text"
                placeholder="fashionyourway_gh"
                className="form-input"
                style={{ paddingLeft: '32px' }}
                value={formData.socialHandles.instagram}
                onChange={e => handleSocialChange('instagram', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>TikTok Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#E8A598', fontSize: '0.9rem' }}>@</span>
              <input
                type="text"
                placeholder="fashionyourway_gh"
                className="form-input"
                style={{ paddingLeft: '32px' }}
                value={formData.socialHandles.tiktok}
                onChange={e => handleSocialChange('tiktok', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>WhatsApp Number for Direct Chat</label>
            <input
              type="text"
              placeholder="+233559018822"
              className="form-input"
              value={formData.socialHandles.whatsapp}
              onChange={e => handleSocialChange('whatsapp', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Facebook Page / Username</label>
            <input
              type="text"
              placeholder="FashionYourWayGhana"
              className="form-input"
              value={formData.socialHandles.facebook}
              onChange={e => handleSocialChange('facebook', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Snapchat Username</label>
            <input
              type="text"
              placeholder="fashionyourway"
              className="form-input"
              value={formData.socialHandles.snapchat}
              onChange={e => handleSocialChange('snapchat', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>X (Twitter) Username</label>
            <input
              type="text"
              placeholder="fashionyourway"
              className="form-input"
              value={formData.socialHandles.twitter}
              onChange={e => handleSocialChange('twitter', e.target.value)}
            />
          </div>

          {/* Section 3: Brand Identity & Description */}
          <div className="form-grid-full" style={{ marginTop: '16px' }}>
            <div className="admin-settings-section-title">
              <Sparkles size={18} color="#E8A598" />
              <span>Brand Identity & Philosophy Statement</span>
            </div>
          </div>

          <div className="form-group">
            <label>Brand / Business Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.storeName}
              onChange={e => handleChange('storeName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Brand Tagline</label>
            <input
              type="text"
              className="form-input"
              value={formData.tagline}
              onChange={e => handleChange('tagline', e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Website Brand Description (Manifesto) *</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              value={formData.brandDescription}
              onChange={e => handleChange('brandDescription', e.target.value)}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Top Notice & Announcement Banner</label>
            <input
              type="text"
              className="form-input"
              value={formData.noticeBanner}
              onChange={e => handleChange('noticeBanner', e.target.value)}
            />
          </div>

          {/* Section 4: Delivery Fees in Ghana Cedis */}
          <div className="form-grid-full" style={{ marginTop: '16px' }}>
            <div className="admin-settings-section-title">
              <span>Delivery Charges & Free Delivery Threshold ({formData.currencySymbol})</span>
            </div>
          </div>

          <div className="form-group">
            <label>Standard Delivery Fee ({formData.currencySymbol})</label>
            <input
              type="number"
              className="form-input"
              value={formData.standardShippingFee}
              onChange={e => handleChange('standardShippingFee', Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>VIP Priority Same-Day Rider Fee ({formData.currencySymbol})</label>
            <input
              type="number"
              className="form-input"
              value={formData.expressShippingFee}
              onChange={e => handleChange('expressShippingFee', Number(e.target.value))}
            />
          </div>

          <div className="form-group form-grid-full">
            <label>Free Delivery Threshold ({formData.currencySymbol})</label>
            <input
              type="number"
              className="form-input"
              value={formData.freeShippingThreshold}
              onChange={e => handleChange('freeShippingThreshold', Number(e.target.value))}
            />
          </div>

          {/* Section 5: Admin Privacy & Security Passkey */}
          <div className="form-grid-full" style={{ marginTop: '16px' }}>
            <div className="admin-settings-section-title">
              <KeyRound size={18} color="#D4AF37" />
              <span>Private Admin Security Passkey</span>
            </div>
          </div>

          <div className="form-group">
            <label>Current Passkey</label>
            <input
              type="text"
              disabled
              className="form-input"
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
              value={adminPasskey}
            />
          </div>

          <div className="form-group">
            <label>Change Security Passkey (Leave blank to keep current)</label>
            <input
              type="text"
              placeholder="Enter new secret passkey..."
              className="form-input"
              value={newPasskeyInput}
              onChange={e => setNewPasskeyInput(e.target.value)}
            />
          </div>

          <div className="form-grid-full" style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={handleVerifyInFooter}>
              <span>Preview in Footer</span>
              <ExternalLink size={16} />
            </button>

            <button type="submit" className="btn btn-primary" style={{ gap: '10px', padding: '14px 40px' }}>
              <Save size={18} />
              <span>Save & Publish Store Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Storefront Preview Box */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          border: '1px solid rgba(232, 165, 152, 0.3)',
          background: 'rgba(20, 3, 11, 0.7)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8A598', fontWeight: 600 }}>
            <Eye size={18} />
            <span>Live Customer Footer & Social Logos Preview</span>
          </div>
          <span className="badge badge-blush">Public View Simulation</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            background: 'rgba(14, 2, 7, 0.9)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(232, 165, 152, 0.15)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: '#E8A598', textTransform: 'uppercase', marginBottom: '6px' }}>
              📍 Showroom Address:
            </div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
              {formData.location || storeInfo.location}
            </div>
            <div style={{ color: '#F7D6DC', fontSize: '0.82rem' }}>
              {formData.city || storeInfo.city}
            </div>
            {formData.landmark && (
              <div style={{ color: '#E8A598', fontSize: '0.78rem', marginTop: '2px' }}>
                Landmark: {formData.landmark}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#E8A598', textTransform: 'uppercase', marginBottom: '6px' }}>
              📞 Direct Line:
            </div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
              {formData.phone || storeInfo.phone}
            </div>
            {formData.whatsapp && (
              <div style={{ color: '#86EFAC', fontSize: '0.82rem', marginTop: '2px' }}>
                WhatsApp: {formData.whatsapp}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#E8A598', textTransform: 'uppercase', marginBottom: '6px' }}>
              ✉️ Concierge Email:
            </div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.92rem' }}>
              {formData.email || storeInfo.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#E8A598', textTransform: 'uppercase', marginBottom: '8px' }}>
              📱 Published Social Logos:
            </div>
            <SocialMediaBar handles={formData.socialHandles} />
          </div>
        </div>
      </div>
    </div>
  );
};
