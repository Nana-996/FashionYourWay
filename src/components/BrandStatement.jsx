import React from 'react';
import { useStore } from '../context/StoreContext';
import { Crown, Sparkles, ShieldCheck, Truck, Heart, Award, Gem } from 'lucide-react';

const renderIcon = (iconName) => {
  switch (iconName) {
    case 'sparkles':
      return <Sparkles size={18} color="#E8A598" />;
    case 'shield':
      return <ShieldCheck size={18} color="#D4AF37" />;
    case 'truck':
      return <Truck size={18} color="#E8A598" />;
    case 'heart':
      return <Heart size={18} color="#E8A598" />;
    case 'award':
      return <Award size={18} color="#D4AF37" />;
    case 'gem':
      return <Gem size={18} color="#D4AF37" />;
    case 'crown':
    default:
      return <Crown size={18} color="#D4AF37" />;
  }
};

export const BrandStatement = () => {
  const { storeInfo } = useStore();

  const highlights = storeInfo.brandHighlights || [
    {
      icon: "crown",
      title: "Haute Couture Standards",
      desc: "Mulberry silks & plush velvets"
    },
    {
      icon: "sparkles",
      title: "Bespoke Silhouette",
      desc: "Tailored to your exact fit"
    },
    {
      icon: "shield",
      title: "Guaranteed Authenticity",
      desc: "Handcrafted atelier quality"
    },
    {
      icon: "truck",
      title: "VIP Dispatch",
      desc: "Doorstep delivery nationwide"
    }
  ];

  return (
    <section id="statement-section" className="brand-strip-section">
      <div className="container">
        <div className="brand-strip-grid">
          {highlights.map((item, i) => (
            <div key={i} className="brand-strip-item">
              <div className="brand-strip-icon">{renderIcon(item.icon)}</div>
              <div>
                <h4 className="brand-strip-title">{item.title}</h4>
                <p className="brand-strip-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
