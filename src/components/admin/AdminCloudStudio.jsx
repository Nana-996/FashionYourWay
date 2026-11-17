import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { DEFAULT_LIVE_CLOUD_URL } from '../../utils/cloudSync';
import {
  Globe,
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  Server,
  Zap,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Copy,
  Check,
  FileJson,
  Wifi,
  WifiOff
} from 'lucide-react';

export const AdminCloudStudio = () => {
  const {
    products,
    orders,
    storeInfo,
    cloudSyncStatus,
    lastCloudSyncTime,
    cloudConfig,
    updateCloudConfig,
    testCloudConfig,
    pushAllToCloud,
    pullAllFromCloud,
    syncWithCloudNow,
    importProducts,
    showToast
  } = useStore();

  const [provider, setProvider] = useState(cloudConfig?.provider || 'firebase');
  const [url, setUrl] = useState(cloudConfig?.url || '');
  const [token, setToken] = useState(cloudConfig?.token || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (cloudConfig) {
      setProvider(cloudConfig.provider || 'firebase');
      setUrl(cloudConfig.url || '');
      setToken(cloudConfig.token || '');
    }
  }, [cloudConfig]);

  const handleTestConnection = async () => {
    if (!url.trim()) {
      showToast('URL Required', 'Please enter your Database URL first', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testCloudConfig({
        provider,
        url: url.trim(),
        token: token.trim()
      });
      setTestResult(res);
      if (res.success) {
        showToast('Connection Verified ✨', `Database reachable in ${res.latencyMs}ms!`, 'success');
      } else {
        showToast('Connection Check Notice', res.error || 'Endpoint returned an error', 'warning');
      }
    } catch (err) {
      setTestResult({ success: false, error: err.message });
      showToast('Connection Failed', err.message, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCloudConfig({
        provider,
        url: url.trim(),
        token: token.trim()
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaultCloud = async () => {
    if (window.confirm('Reset database endpoint to the default shared live production cloud?')) {
      await updateCloudConfig({
        provider: 'cloud',
        url: DEFAULT_LIVE_CLOUD_URL,
        token: ''
      });
      setUrl(DEFAULT_LIVE_CLOUD_URL);
      setToken('');
      setTestResult(null);
    }
  };

  // Export JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        catalogName: 'FashionYourWay Store Data',
        exportDate: new Date().toISOString(),
        products,
        storeInfo,
        orders
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fashionyourway_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup Downloaded 📁', 'Catalog saved to your computer', 'success');
  };

  // Status visual colors
  const isConnected = cloudSyncStatus === 'synced' || (cloudConfig?.isConfigured && cloudSyncStatus !== 'error' && cloudSyncStatus !== 'offline');
  const isOffline = cloudSyncStatus === 'offline' || cloudSyncStatus === 'error';
  const isUnconfigured = !cloudConfig?.isConfigured || cloudSyncStatus === 'unconfigured';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview Status Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          border: isConnected
            ? '1px solid rgba(134, 239, 172, 0.4)'
            : isOffline
            ? '1px solid rgba(248, 113, 113, 0.4)'
            : '1px solid rgba(234, 179, 8, 0.4)',
          background: 'rgba(20, 3, 11, 0.75)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isConnected
                  ? 'rgba(34, 197, 94, 0.15)'
                  : isOffline
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(234, 179, 8, 0.15)',
                border: isConnected
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : isOffline
                  ? '1px solid rgba(239, 68, 68, 0.3)'
                  : '1px solid rgba(234, 179, 8, 0.3)'
              }}
            >
              {isConnected ? (
                <Wifi size={24} color="#86EFAC" />
              ) : isOffline ? (
                <WifiOff size={24} color="#F87171" />
              ) : (
                <Database size={24} color="#FDE047" />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#FFFFFF' }}>
                  {isConnected
                    ? 'Global Cloud Live & Synchronized'
                    : isOffline
                    ? 'Cloud Offline (Saved Safely on this Device)'
                    : 'Local-Only Mode (Multi-Device Sync Available)'}
                </h3>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: isConnected
                      ? 'rgba(34, 197, 94, 0.2)'
                      : isOffline
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(234, 179, 8, 0.2)',
                    color: isConnected ? '#86EFAC' : isOffline ? '#F87171' : '#FDE047'
                  }}
                >
                  {cloudSyncStatus.toUpperCase()}
                </span>
              </div>

              <p style={{ margin: '6px 0 0', color: 'rgba(255, 240, 243, 0.75)', fontSize: '0.86rem' }}>
                {isConnected
                  ? `Every piece you add, edit or delete automatically reflects across all devices worldwide (${products.length} live pieces).`
                  : isOffline
                  ? 'Your additions and edits are preserved safely in local storage. Once reconnected, changes will push live.'
                  : 'Your products are currently stored safely in this browser. Connect a free Firebase database below so edits are instantly shared across phones, tablets, and computers.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={syncWithCloudNow}
              disabled={cloudSyncStatus === 'syncing'}
              style={{ gap: '6px' }}
            >
              <RefreshCw size={14} className={cloudSyncStatus === 'syncing' ? 'spin' : ''} />
              <span>{cloudSyncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {cloudConfig?.isConfigured && (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={pushAllToCloud}
                  style={{ gap: '6px' }}
                  title="Force overwrite cloud catalog with your current device catalog"
                >
                  <UploadCloud size={14} />
                  <span>Push Local to Cloud</span>
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={pullAllFromCloud}
                  style={{ gap: '6px' }}
                  title="Download and replace local catalog with the cloud version"
                >
                  <DownloadCloud size={14} />
                  <span>Pull from Cloud</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Diagnostic Metadata Footer */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'rgba(255, 240, 243, 0.65)'
          }}
        >
          <div>
            <span>Active Provider: </span>
            <strong style={{ color: '#E8A598', textTransform: 'capitalize' }}>
              {cloudConfig?.isConfigured ? cloudConfig.provider : 'Local Browser Storage (IndexedDB)'}
            </strong>
          </div>

          {lastCloudSyncTime && (
            <div>
              <span>Last Synchronized: </span>
              <strong style={{ color: '#86EFAC' }}>{new Date(lastCloudSyncTime).toLocaleTimeString()}</strong>
            </div>
          )}

          <div>
            <span>Local Inventory: </span>
            <strong style={{ color: '#FFFFFF' }}>{products.length} products</strong> &middot;{' '}
            <strong style={{ color: '#FFFFFF' }}>{orders.length} orders</strong>
          </div>
        </div>
      </div>

      {/* Cloud Configuration Form */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          border: '1px solid rgba(232, 165, 152, 0.3)',
          background: 'rgba(20, 3, 11, 0.75)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={20} color="#E8A598" />
              <span>Multi-Device Database Configuration</span>
            </h3>
            <p style={{ margin: '4px 0 0', color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.85rem' }}>
              Connect your boutique to a cloud database so you and your team can manage inventory from any device.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowGuide(prev => !prev)}
            style={{ gap: '6px' }}
          >
            <HelpCircle size={15} color="#E8A598" />
            <span>{showGuide ? 'Hide 60-Second Setup Guide' : 'How to set up Free Firebase (60s)'}</span>
          </button>
        </div>

        {/* 60-Second Step-by-Step Setup Guide */}
        {showGuide && (
          <div
            style={{
              background: 'rgba(232, 165, 152, 0.08)',
              border: '1px solid rgba(232, 165, 152, 0.25)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontWeight: 600, color: '#E8A598', fontSize: '0.98rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} />
              <span>60-Second Free Firebase Realtime Database Setup (No Credit Card Required)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(14, 2, 7, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(232, 165, 152, 0.15)' }}>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>STEP 1</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', lineHeight: 1.4 }}>
                  Open{' '}
                  <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: '#E8A598', textDecoration: 'underline' }}>
                    console.firebase.google.com
                  </a>{' '}
                  and click <strong>Add Project</strong>. Give it a name (e.g. <em>FashionYourWay</em>).
                </div>
              </div>

              <div style={{ background: 'rgba(14, 2, 7, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(232, 165, 152, 0.15)' }}>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>STEP 2</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', lineHeight: 1.4 }}>
                  In the left sidebar, click <strong>Build &gt; Realtime Database</strong>, then click <strong>Create Database</strong>. Choose <em>Start in test mode</em> (or allow read/write).
                </div>
              </div>

              <div style={{ background: 'rgba(14, 2, 7, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(232, 165, 152, 0.15)' }}>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>STEP 3</div>
                <div style={{ fontSize: '0.82rem', color: '#FFFFFF', lineHeight: 1.4 }}>
                  Copy your Database URL at the top (e.g.{' '}
                  <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>
                    https://your-app-default-rtdb.firebaseio.com
                  </code>
                  ) and paste it into the URL field below!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSaveConfig}>
          {/* Provider Selector Tabs */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#E8A598', fontWeight: 600, marginBottom: '8px' }}>
              Select Cloud Storage Provider:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${provider === 'firebase' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setProvider('firebase')}
                style={{ gap: '6px' }}
              >
                <FlameIcon />
                <span>Firebase Realtime Database (Recommended)</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${provider === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setProvider('custom')}
                style={{ gap: '6px' }}
              >
                <Globe size={14} />
                <span>Custom REST Webhook / URL</span>
              </button>

              <button
                type="button"
                className={`btn btn-sm ${provider === 'supabase' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setProvider('supabase')}
                style={{ gap: '6px' }}
              >
                <Database size={14} />
                <span>Supabase / PostgreSQL</span>
              </button>
            </div>
          </div>

          {/* Database URL Field */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {provider === 'firebase'
                  ? 'Firebase Database URL'
                  : provider === 'supabase'
                  ? 'Supabase Project REST URL'
                  : 'Custom Cloud REST Endpoint URL'}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'rgba(255, 240, 243, 0.6)' }}>
                {provider === 'firebase' ? 'e.g. https://your-project-default-rtdb.firebaseio.com' : 'Full HTTP(S) URL'}
              </span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder={
                provider === 'firebase'
                  ? 'https://your-store-default-rtdb.firebaseio.com'
                  : 'https://api.yourdomain.com/store-data'
              }
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
            />
          </div>

          {/* Optional Token / Secret Field */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                {provider === 'firebase'
                  ? 'Database Secret / Auth Token (Optional if Test Mode is enabled)'
                  : 'API Key / Bearer Token'}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'rgba(255, 240, 243, 0.6)' }}>
                {provider === 'firebase' ? 'Optional' : 'Required for private access'}
              </span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder={provider === 'firebase' ? 'Leave empty if using test rules' : 'eyJhbGciOi...'}
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </div>

          {/* Live Test Results Alert */}
          {testResult && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: testResult.success ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: testResult.success ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: testResult.success ? '#86EFAC' : '#F87171',
                fontSize: '0.85rem'
              }}
            >
              {testResult.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <div>
                <strong>{testResult.success ? 'Database Reachable!' : 'Connection Check Notice:'}</strong>{' '}
                {testResult.success
                  ? `Response latency: ${testResult.latencyMs}ms. Ready for live multi-device syncing.`
                  : testResult.error}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestConnection}
                disabled={isTesting || !url.trim()}
                style={{ gap: '6px' }}
              >
                <Zap size={15} color="#D4AF37" className={isTesting ? 'spin' : ''} />
                <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
              </button>

              {cloudConfig?.isCustom && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleResetToDefaultCloud}
                >
                  <span>Reset to Live Default Cloud</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving || !url.trim()}
              style={{ gap: '8px', padding: '12px 30px' }}
            >
              <CheckCircle2 size={16} />
              <span>{isSaving ? 'Saving & Syncing...' : 'Save & Enable Multi-Device Cloud'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Offline Backup & Migration Studio */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          border: '1px solid rgba(232, 165, 152, 0.25)',
          background: 'rgba(20, 3, 11, 0.65)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileJson size={18} color="#D4AF37" />
              <span>Offline Backup & Catalog Transfer</span>
            </h4>
            <p style={{ margin: '4px 0 0', color: 'rgba(255, 240, 243, 0.7)', fontSize: '0.82rem' }}>
              Export your entire store catalog, text copy, and orders as a JSON file to transfer between devices without internet.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportJson}
            style={{ gap: '6px' }}
          >
            <DownloadCloud size={14} />
            <span>Download Backup JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mini Flame Icon for Firebase
const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
