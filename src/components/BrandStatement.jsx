import React from 'react';
import { Crown, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const BrandStatement = () => {
  const highlights = [
    {
      icon: <Crown size={18} color="#D4AF37" />,
      title: "Haute Couture Standards",
      desc: "Mulberry silks & plush velvets"
    },
    {
      icon: <Sparkles size={18} color="#E8A598" />,
      title: "Bespoke Silhouette",
      desc: "Tailored to your exact fit"
    },
    {
      icon: <ShieldCheck size={18} color="#D4AF37" />,
      title: "Guaranteed Authenticity",
      desc: "Handcrafted atelier quality"
    },
    {
      icon: <Truck size={18} color="#E8A598" />,
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
              <div className="brand-strip-icon">{item.icon}</div>
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
