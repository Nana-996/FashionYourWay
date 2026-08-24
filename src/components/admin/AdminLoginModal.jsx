import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../BrandLogo';
import { Lock, ShieldCheck, X, KeyRound, ArrowRight } from 'lucide-react';

export const AdminLoginModal = () => {
  const {
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    loginAdmin
  } = useStore();

  const [enteredPasskey, setEnteredPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!enteredPasskey.trim()) {
      setErrorMsg('Please enter the Admin Security Passkey');
      return;
    }

    const success = loginAdmin(enteredPasskey.trim());
    if (!success) {
      setErrorMsg('Incorrect Passkey. Please verify your credentials.');
    } else {
      setEnteredPasskey('');
      setErrorMsg('');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAdminLoginModalOpen(false)}>
      <div
        className="checkout-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          textAlign: 'center',
          padding: '40px 32px'
        }}
      >
        <button
          className="modal-close-btn"
          onClick={() => setIsAdminLoginModalOpen(false)}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <BrandLogo size="md" showSub={true} />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
          Executive Security Access
        </span>

        <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '8px' }}>
          Atelier Management Key
        </h3>

        <p style={{ fontSize: '0.86rem', color: 'rgba(255, 240, 243, 0.7)', marginBottom: '22px', lineHeight: '1.5' }}>
          Enter security passkey to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '18px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Passkey"
                className="form-input"
                style={{ width: '100%', paddingLeft: '40px' }}
                value={enteredPasskey}
                autoFocus
                onChange={e => {
                  setEnteredPasskey(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
              />
              <KeyRound
                size={18}
                color="#E8A598"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            {errorMsg && (
              <span style={{ color: '#F87171', fontSize: '0.8rem', marginTop: '6px', display: 'block' }}>
                {errorMsg}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', gap: '10px' }}
          >
            <Lock size={16} />
            <span>Unlock</span>
          </button>
        </form>
      </div>
    </div>
  );
};
