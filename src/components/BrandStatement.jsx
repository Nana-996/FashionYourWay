import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Crown, Shield, Flame } from 'lucide-react';

export const BrandStatement = () => {
  const { storeInfo } = useStore();

  const values = [
    {
      icon: <Crown size={28} color="#D4AF37" />,
      title: "No Rules. No Limit.",
      description: "Fashion that celebrates your mood and individuality, breaking conventional norms with bold silhouettes."
    },
    {
      icon: <Sparkles size={28} color="#E8A598" />,
      title: "Make Them Look Twice",
      description: "From effortless daytime cuts to breathtaking gala statements that command the spotlight wherever you walk."
    },
    {
      icon: <Shield size={28} color="#D4AF37" />,
      title: "Couture Quality Standard",
      description: "Handpicked mulberry silks, plush velvets, and double-faced Australian wools tailored with precision."
    },
    {
      icon: <Flame size={28} color="#E8A598" />,
      title: "Live Order Concierge",
      description: "Direct tracking, personalized sizing support, and responsive dispatch from our boutique team."
    }
  ];

  return (
    <section id="statement-section" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            padding: '50px 40px',
            background: 'linear-gradient(135deg, rgba(46, 11, 29, 0.9) 0%, rgba(20, 3, 11, 0.95) 100%)',
            border: '1px solid rgba(232, 165, 152, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(183, 33, 76, 0.3) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />

          <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto 50px' }}>
            <span className="badge badge-blush" style={{ marginBottom: '14px' }}>
              The FashionYourWay Manifesto
            </span>
            <h2 style={{ marginBottom: '20px' }}>
              Fashion Designed to Match Your Confidence
            </h2>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#FFF5F7' }}>
              {storeInfo.brandDescription || "FashionYourWay isn't just about what you wear. It's how you make them look twice. From effortless everyday looks to statement pieces that own the room, we bring you fashion designed to match your mood, your confidence and your individuality. No rules. No limit. Just fashion your way."}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(20, 3, 11, 0.6)',
                  border: '1px solid rgba(232, 165, 152, 0.15)',
                  borderRadius: '16px',
                  padding: '28px 24px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ marginBottom: '16px' }}>{v.icon}</div>
                <h4 style={{ fontSize: '1.18rem', marginBottom: '10px', color: '#FFFFFF' }}>{v.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255, 245, 247, 0.75)', lineHeight: '1.6' }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
