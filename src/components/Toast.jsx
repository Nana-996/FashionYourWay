import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => {
        const getIcon = () => {
          if (toast.type === 'success') return <CheckCircle2 size={20} color="#86EFAC" />;
          if (toast.type === 'error') return <AlertCircle size={20} color="#FCA5A5" />;
          return <Info size={20} color="#93C5FD" />;
        };

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(32, 7, 20, 0.95)',
              border: '1px solid rgba(232, 165, 152, 0.3)',
              borderRadius: '12px',
              padding: '14px 18px',
              color: '#FFF5F7',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(183, 33, 76, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#FFFFFF' }}>{toast.title}</div>
              {toast.message && (
                <div style={{ fontSize: '0.82rem', color: 'rgba(255, 240, 243, 0.75)', marginTop: '2px' }}>
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 240, 243, 0.5)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
