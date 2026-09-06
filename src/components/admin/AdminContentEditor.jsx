import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { initialStoreInfo } from '../../data/initialStoreInfo';
import {
  Type,
  Sparkles,
  Crown,
  Eye,
  Save,
  RotateCcw,
  CheckCircle2,
  Bell,
  Package,
  FileText,
  ShieldCheck,
  Truck,
  Heart,
  Award,
  Gem,
  Compass
} from 'lucide-react';

export const AdminContentEditor = () => {
  const { storeInfo, updateStoreText, setCurrentView, showToast } = useStore();

  const [activeSection, setActiveSection] = useState('hero'); // 'hero' | 'highlights' | 'catalog' | 'footer' | 'banner' | 'tracking'
  const [formData, setFormData] = useState({
    // Hero Copy
    heroPill: storeInfo.heroPill ?? initialStoreInfo.heroPill,
    heroTitle: storeInfo.heroTitle ?? initialStoreInfo.heroTitle,
    heroTitleHighlight: storeInfo.heroTitleHighlight ?? initialStoreInfo.heroTitleHighlight,
    heroSubtitle: storeInfo.heroSubtitle ?? initialStoreInfo.heroSubtitle,
    heroPrimaryCta: storeInfo.heroPrimaryCta ?? initialStoreInfo.heroPrimaryCta,
    heroSecondaryCta: storeInfo.heroSecondaryCta ?? initialStoreInfo.heroSecondaryCta,
    heroEmptyTitle: storeInfo.heroEmptyTitle ?? initialStoreInfo.heroEmptyTitle,
    heroEmptyDesc: storeInfo.heroEmptyDesc ?? initialStoreInfo.heroEmptyDesc,

    // Brand Value Highlights (4 items)
    brandHighlights: storeInfo.brandHighlights && storeInfo.brandHighlights.length === 4
      ? storeInfo.brandHighlights
      : initialStoreInfo.brandHighlights,

    // Catalog Section Copy
    catalogTitle: storeInfo.catalogTitle ?? initialStoreInfo.catalogTitle,
    catalogSubtitle: storeInfo.catalogSubtitle ?? initialStoreInfo.catalogSubtitle,
    catalogSearchPlaceholder: storeInfo.catalogSearchPlaceholder ?? initialStoreInfo.catalogSearchPlaceholder,
    catalogEmptyTitle: storeInfo.catalogEmptyTitle ?? initialStoreInfo.catalogEmptyTitle,
    catalogEmptyDesc: storeInfo.catalogEmptyDesc ?? initialStoreInfo.catalogEmptyDesc,

    // Brand Philosophy & Footer Copy
    storeName: storeInfo.storeName ?? initialStoreInfo.storeName,
    tagline: storeInfo.tagline ?? initialStoreInfo.tagline,
    brandDescription: storeInfo.brandDescription ?? initialStoreInfo.brandDescription,
    footerManifesto: storeInfo.footerManifesto ?? initialStoreInfo.footerManifesto,
    footerEdition: storeInfo.footerEdition ?? initialStoreInfo.footerEdition,
    footerSubtext: storeInfo.footerSubtext ?? initialStoreInfo.footerSubtext,
    footerCopyright: storeInfo.footerCopyright ?? initialStoreInfo.footerCopyright,

    // Top Announcement Bar
    noticeBanner: storeInfo.noticeBanner ?? initialStoreInfo.noticeBanner,
    showNoticeBanner: storeInfo.showNoticeBanner ?? true,

    // Order Tracking Copy
    trackingHeroTitle: storeInfo.trackingHeroTitle ?? initialStoreInfo.trackingHeroTitle,
    trackingHeroSubtitle: storeInfo.trackingHeroSubtitle ?? initialStoreInfo.trackingHeroSubtitle,
    trackingBadge: storeInfo.trackingBadge ?? initialStoreInfo.trackingBadge
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleHighlightChange = (index, field, val) => {
    setFormData(prev => {
      const updated = [...prev.brandHighlights];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, brandHighlights: updated };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStoreText(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetSection = () => {
    if (!window.confirm('Reset this section back to original editorial default text?')) return;

    if (activeSection === 'hero') {
      setFormData(prev => ({
        ...prev,
        heroPill: initialStoreInfo.heroPill,
        heroTitle: initialStoreInfo.heroTitle,
        heroTitleHighlight: initialStoreInfo.heroTitleHighlight,
        heroSubtitle: initialStoreInfo.heroSubtitle,
        heroPrimaryCta: initialStoreInfo.heroPrimaryCta,
        heroSecondaryCta: initialStoreInfo.heroSecondaryCta
      }));
    } else if (activeSection === 'highlights') {
      setFormData(prev => ({
        ...prev,
        brandHighlights: initialStoreInfo.brandHighlights
      }));
    } else if (activeSection === 'catalog') {
      setFormData(prev => ({
        ...prev,
        catalogTitle: initialStoreInfo.catalogTitle,
        catalogSubtitle: initialStoreInfo.catalogSubtitle,
        catalogSearchPlaceholder: initialStoreInfo.catalogSearchPlaceholder,
        catalogEmptyTitle: initialStoreInfo.catalogEmptyTitle,
        catalogEmptyDesc: initialStoreInfo.catalogEmptyDesc
      }));
    } else if (activeSection === 'footer') {
      setFormData(prev => ({
        ...prev,
        footerManifesto: initialStoreInfo.footerManifesto,
        footerEdition: initialStoreInfo.footerEdition,
        footerSubtext: initialStoreInfo.footerSubtext,
        footerCopyright: initialStoreInfo.footerCopyright,
        brandDescription: initialStoreInfo.brandDescription
      }));
    } else if (activeSection === 'banner') {
      setFormData(prev => ({
        ...prev,
        noticeBanner: initialStoreInfo.noticeBanner,
        showNoticeBanner: true
      }));
    } else if (activeSection === 'tracking') {
      setFormData(prev => ({
        ...prev,
        trackingHeroTitle: initialStoreInfo.trackingHeroTitle,
        trackingHeroSubtitle: initialStoreInfo.trackingHeroSubtitle,
        trackingBadge: initialStoreInfo.trackingBadge
      }));
    }
    showToast('Defaults Restored', 'Section wording reverted to curated defaults.', 'info');
  };

  const handlePreviewLive = (targetSectionId = null) => {
    setCurrentView('storefront');
    if (targetSectionId) {
      setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Status */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          border: '1px solid rgba(232, 165, 152, 0.25)',
          background: 'rgba(20, 3, 11, 0.65)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#86EFAC',
              boxShadow: '0 0 10px #86EFAC'
            }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '0.94rem' }}>
              Master Site Text & Copy Editor
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 240, 243, 0.7)' }}>
              Edit every headline, button, guarantee, philosophy statement and banner across the site.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handlePreviewLive()}
            style={{ gap: '6px' }}
          >
            <Eye size={15} />
            <span>View Live Storefront</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleResetSection}
            style={{ gap: '6px' }}
            title="Reset current section text back to default"
          >
            <RotateCcw size={14} />
            <span>Reset Section</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '10px',
            padding: '14px 18px',
            color: '#86EFAC',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.92rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <CheckCircle2 size={20} />
          <span>
            <strong>Website Text Saved & Live!</strong> All changes have been applied to the customer storefront and saved persistently.
          </span>
        </div>
      )}

      {/* Section Nav Buttons (Scrollable on mobile) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'hero' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('hero')}
        >
          <Sparkles size={16} />
          <span>Hero Editorial & Headlines</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'highlights' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('highlights')}
        >
          <Crown size={16} />
          <span>Brand Value Guarantees (4)</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'catalog' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('catalog')}
        >
          <Package size={16} />
          <span>Catalog Section Copy</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'footer' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('footer')}
        >
          <FileText size={16} />
          <span>Brand Story & Footer</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'banner' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('banner')}
        >
          <Bell size={16} />
          <span>Announcement Bar</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeSection === 'tracking' ? 'active' : ''}`}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
          onClick={() => setActiveSection('tracking')}
        >
          <Compass size={16} />
          <span>Order Tracking Copy</span>
        </button>
      </div>

      {/* Editor Form Card */}
      <form onSubmit={handleSave} className="admin-settings-card" style={{ maxWidth: '100%' }}>
        {/* SECTION 1: HERO COPY */}
        {activeSection === 'hero' && (
          <div>
            <div className="admin-settings-section-title">
              <Sparkles size={20} color="#E8A598" />
              <span>Hero Section Editorial Copy</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              The very first words clients see when entering FashionYourWay. Keep them bold, sophisticated, and evocative.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Top Season / Badge Pill</label>
                <input
                  type="text"
                  placeholder="e.g. Autumn / Winter Edit"
                  className="form-input"
                  value={formData.heroPill}
                  onChange={e => handleChange('heroPill', e.target.value)}
                />
                <span style={{ fontSize: '0.74rem', color: 'rgba(255,240,243,0.5)' }}>
                  Small badge shown right above the main title
                </span>
              </div>

              <div className="form-group">
                <label>Main Headline Text (Leading part)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Make Them Look"
                  className="form-input"
                  value={formData.heroTitle}
                  onChange={e => handleChange('heroTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Headline Highlight / Accent Word</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Twice."
                  className="form-input"
                  value={formData.heroTitleHighlight}
                  onChange={e => handleChange('heroTitleHighlight', e.target.value)}
                />
                <span style={{ fontSize: '0.74rem', color: '#E8A598' }}>
                  This part receives the luxury gold & blush italic gradient glow!
                </span>
              </div>

              <div className="form-group">
                <label>Primary Button Label (Shop Action)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shop Collection"
                  className="form-input"
                  value={formData.heroPrimaryCta}
                  onChange={e => handleChange('heroPrimaryCta', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Secondary Button Label (Featured Piece)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Featured Design"
                  className="form-input"
                  value={formData.heroSecondaryCta}
                  onChange={e => handleChange('heroSecondaryCta', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Hero Subtitle & Brand Statement</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Fashion designed to match your mood, your confidence, and your individuality. No rules. No limits."
                  className="form-textarea"
                  value={formData.heroSubtitle}
                  onChange={e => handleChange('heroSubtitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Empty Catalog Fallback Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Welcome to FashionYourWay"
                  className="form-input"
                  value={formData.heroEmptyTitle}
                  onChange={e => handleChange('heroEmptyTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Empty Catalog Fallback Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Explore our bespoke handcrafted collections below or contact concierge."
                  className="form-input"
                  value={formData.heroEmptyDesc}
                  onChange={e => handleChange('heroEmptyDesc', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: BRAND VALUE HIGHLIGHTS */}
        {activeSection === 'highlights' && (
          <div>
            <div className="admin-settings-section-title">
              <Crown size={20} color="#D4AF37" />
              <span>Brand Value Guarantees Strip</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              The 4 luxury promise cards rendered directly beneath the hero section. Reinforce quality, bespoke tailoring, and prompt delivery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {formData.brandHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(20, 3, 11, 0.6)',
                    border: '1px solid rgba(232, 165, 152, 0.2)',
                    borderRadius: '12px',
                    padding: '18px 20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#E8A598', fontSize: '0.92rem' }}>
                      Highlight Card #{idx + 1}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'rgba(255,240,243,0.7)' }}>Icon:</label>
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '0.8rem', width: 'auto' }}
                        value={highlight.icon}
                        onChange={e => handleHighlightChange(idx, 'icon', e.target.value)}
                      >
                        <option value="crown">👑 Crown (Haute Couture)</option>
                        <option value="sparkles">✨ Sparkles (Bespoke)</option>
                        <option value="shield">🛡️ Shield (Authenticity)</option>
                        <option value="truck">🚚 Truck (VIP Dispatch)</option>
                        <option value="gem">💎 Gem (Luxury)</option>
                        <option value="heart">💖 Heart (Handcrafted)</option>
                        <option value="award">🏅 Award (Excellence)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={highlight.title}
                        onChange={e => handleHighlightChange(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Short Description</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        value={highlight.desc}
                        onChange={e => handleHighlightChange(idx, 'desc', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: CATALOG SECTION COPY */}
        {activeSection === 'catalog' && (
          <div>
            <div className="admin-settings-section-title">
              <Package size={20} color="#E8A598" />
              <span>Product Catalog Section Copy</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Headings, search box placeholder, and empty state text for the runway garment collection.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Catalog Section Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Collection"
                  className="form-input"
                  value={formData.catalogTitle}
                  onChange={e => handleChange('catalogTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Catalog Subtitle / Tagline (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Ghanaian Luxury Silhouettes"
                  className="form-input"
                  value={formData.catalogSubtitle}
                  onChange={e => handleChange('catalogSubtitle', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Search Input Placeholder</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Search pieces, colors, fabrics..."
                  className="form-input"
                  value={formData.catalogSearchPlaceholder}
                  onChange={e => handleChange('catalogSearchPlaceholder', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Empty Catalog Heading</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catalog Currently Being Curated"
                  className="form-input"
                  value={formData.catalogEmptyTitle}
                  onChange={e => handleChange('catalogEmptyTitle', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Empty Catalog Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Our runway pieces are being prepared. Visit the Admin Portal to add and manage your fashion pieces."
                  className="form-textarea"
                  value={formData.catalogEmptyDesc}
                  onChange={e => handleChange('catalogEmptyDesc', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: BRAND STORY & FOOTER */}
        {activeSection === 'footer' && (
          <div>
            <div className="admin-settings-section-title">
              <FileText size={20} color="#D4AF37" />
              <span>Brand Philosophy, Story & Footer Copy</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Full brand narrative, tagline, footer mission statement, and edition badges.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Store Brand Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.storeName}
                  onChange={e => handleChange('storeName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Main Slogan / Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Own the Room. Fashion Designed Your Way."
                  className="form-input"
                  value={formData.tagline}
                  onChange={e => handleChange('tagline', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Official Brand Story / Manifesto Paragraph</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  value={formData.brandDescription}
                  onChange={e => handleChange('brandDescription', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Footer Brief Manifesto (Displayed under logo in footer)</label>
                <textarea
                  required
                  rows={2}
                  className="form-textarea"
                  value={formData.footerManifesto}
                  onChange={e => handleChange('footerManifesto', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Footer Edition Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Pink Burgundy Luxury Edition"
                  className="form-input"
                  value={formData.footerEdition}
                  onChange={e => handleChange('footerEdition', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Footer Sub-Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Haute Couture"
                  className="form-input"
                  value={formData.footerSubtext}
                  onChange={e => handleChange('footerSubtext', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Footer Copyright Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. All Rights Reserved. Handcrafted with passion."
                  className="form-input"
                  value={formData.footerCopyright}
                  onChange={e => handleChange('footerCopyright', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: ANNOUNCEMENT BAR */}
        {activeSection === 'banner' && (
          <div>
            <div className="admin-settings-section-title">
              <Bell size={20} color="#E8A598" />
              <span>Top Announcement Bar</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Broadcast special coupon codes, promotional delivery notices, or seasonal event alerts at the very top of all pages.
            </p>

            <div className="form-grid">
              <div className="form-group form-grid-full">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
                  <input
                    type="checkbox"
                    checked={formData.showNoticeBanner}
                    onChange={e => handleChange('showNoticeBanner', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#B33D62' }}
                  />
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Show Announcement Bar at top of website</span>
                </label>
              </div>

              <div className="form-group form-grid-full">
                <label>Announcement Message</label>
                <input
                  type="text"
                  placeholder="e.g. ✨ RUNWAY DROP: Enjoy Complimentary Delivery Across Ghana on Orders Over GH₵ 800 with code 'ACCRAVELVET'"
                  className="form-input"
                  value={formData.noticeBanner}
                  onChange={e => handleChange('noticeBanner', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: VIP ORDER TRACKING COPY */}
        {activeSection === 'tracking' && (
          <div>
            <div className="admin-settings-section-title">
              <Compass size={20} color="#E8A598" />
              <span>Order Tracking Page Copy</span>
            </div>
            <p style={{ color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Customize the client concierge portal wording for order tracking and parcel lookups.
            </p>

            <div className="form-grid">
              <div className="form-group">
                <label>Concierge Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Client Concierge"
                  className="form-input"
                  value={formData.trackingBadge}
                  onChange={e => handleChange('trackingBadge', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Tracking Page Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Order Management & Tracking"
                  className="form-input"
                  value={formData.trackingHeroTitle}
                  onChange={e => handleChange('trackingHeroTitle', e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label>Tracking Subtitle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Track your bespoke tailoring, packaging status, and courier dispatch in real time."
                  className="form-input"
                  value={formData.trackingHeroSubtitle}
                  onChange={e => handleChange('trackingHeroSubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(232, 165, 152, 0.15)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handlePreviewLive()}
          >
            <Eye size={16} />
            <span>Storefront Preview</span>
          </button>

          <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
            <Save size={16} />
            <span>Save Website Text</span>
          </button>
        </div>
      </form>
    </div>
  );
};
