import React from 'react';

// Official FashionYourWay WhatsApp Concierge & Direct Payment Hotline
export const STORE_WHATSAPP_NUMBER = '+233596568466';
export const STORE_WHATSAPP_DISPLAY = '+233 59 656 8466';
export const STORE_WHATSAPP_RAW = '233596568466';

/**
 * Official WhatsApp Brand SVG Icon
 */
export const WhatsAppIcon = ({ size = 18, color = 'currentColor', style = {}, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.778.978-.954 1.179-.176.2-.352.226-.653.075-.3-.15-1.271-.469-2.42-1.494-.894-.798-1.498-1.784-1.674-2.085-.176-.3-.019-.463.132-.613.136-.135.301-.351.452-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.239-.245-.59-.494-.51-.678-.52-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.124 3.243 5.145 4.549.719.31 1.28.496 1.718.636.722.23 1.378.197 1.9.12.58-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.892.524 3.662 1.434 5.176L2 22l4.966-1.402C8.423 21.493 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.637 0-3.155-.47-4.437-1.282l-.318-.202-2.95.834.829-2.87-.209-.333A8.136 8.136 0 013.818 12c0-4.512 3.67-8.182 8.182-8.182 4.512 0 8.182 3.67 8.182 8.182 0 4.512-3.67 8.182-8.182 8.182z" />
  </svg>
);

/**
 * Generate direct WhatsApp order & inquiry link for an individual product
 */
export const getProductWhatsAppUrl = (product, options = {}) => {
  const rawNumber = STORE_WHATSAPP_RAW;
  const size = options.size ? `\n• Size: ${options.size}` : '';
  const color = options.color ? `\n• Color: ${options.color}` : '';
  const qty = options.quantity && options.quantity > 1 ? `\n• Quantity: ${options.quantity}` : '';
  const price = options.formattedPrice || (product?.price ? `GH₵ ${Number(product.price).toLocaleString()}` : '');

  const text = `Hello FashionYourWay! 👑\n\nI am interested in purchasing this piece:\n🛍️ *${product?.name || 'Fashion Piece'}*\n💰 Price: ${price}${size}${color}${qty}\n\nI would like to reach out to the admin and pay directly (MTN MoMo / Telecel / Card / Bank). Please share payment details and delivery timeline.`;

  return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate direct WhatsApp order link for entire shopping bag
 */
export const getCartWhatsAppUrl = (cartItems, totalFormatted) => {
  const rawNumber = STORE_WHATSAPP_RAW;
  const itemsList = (cartItems || [])
    .map((item, idx) => `${idx + 1}. *${item.name}* (${item.selectedSize || 'Standard'} / ${item.selectedColor || 'Default'}) x${item.quantity} - GH₵ ${item.price * item.quantity}`)
    .join('\n');

  const text = `Hello FashionYourWay! 👑\n\nI would like to order the following pieces from my shopping bag:\n\n${itemsList}\n\n*Total: ${totalFormatted}*\n\nPlease provide your direct Mobile Money payment details or assist with my order.`;

  return `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
};
