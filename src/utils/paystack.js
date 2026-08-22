/**
 * Paystack Integration Helper for FashionYourWay
 * Handles dynamic script loading, popup initialization, and verification callbacks for Ghana Cedis (GHS).
 */

const PAYSTACK_INLINE_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

/**
 * Ensures Paystack inline script is loaded in the browser
 */
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }

    const existingScript = document.querySelector(`script[src="${PAYSTACK_INLINE_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.PaystackPop));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Paystack script')));
      return;
    }

    const script = document.createElement('script');
    script.src = PAYSTACK_INLINE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error('Could not load Paystack SDK'));
    document.body.appendChild(script);
  });
};

/**
 * Initializes and launches the Paystack Pop Modal
 *
 * @param {Object} options
 * @param {string} options.key - Paystack public key (pk_live_...)
 * @param {string} options.email - Customer email address
 * @param {number} options.amount - Amount in Ghana Cedis (GHS) (will be converted to pesewas x100)
 * @param {string} [options.currency='GHS'] - Currency code
 * @param {string} [options.reference] - Unique payment reference
 * @param {Object} [options.metadata] - Custom order metadata
 * @param {Function} options.onSuccess - Callback on successful transaction (receives response)
 * @param {Function} [options.onClose] - Callback when user closes payment modal
 * @param {Function} [options.onError] - Callback on initialization error
 */
export const payWithPaystack = async ({
  key,
  email,
  amount,
  currency = 'GHS',
  reference,
  metadata = {},
  onSuccess,
  onClose,
  onError
}) => {
  try {
    const PaystackPop = await loadPaystackScript();

    if (!PaystackPop) {
      throw new Error('Paystack SDK is not available.');
    }

    const publicKey = key || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_a26e85b3fef0ef53ad3e564547c2a77f12b3bcf4';
    const amountInPesewas = Math.round(Number(amount) * 100);
    const paymentRef = reference || `FYW_PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const handler = PaystackPop.setup({
      key: publicKey,
      email: email,
      amount: amountInPesewas,
      currency: currency,
      ref: paymentRef,
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: metadata.customerName || ''
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone_number',
            value: metadata.customerPhone || ''
          },
          {
            display_name: 'Delivery Address',
            variable_name: 'delivery_address',
            value: `${metadata.shippingAddress || ''}, ${metadata.city || ''}`
          }
        ],
        ...metadata
      },
      callback: (response) => {
        if (onSuccess) {
          onSuccess({
            ...response,
            reference: response.reference || paymentRef,
            amount: amount,
            currency: currency
          });
        }
      },
      onClose: () => {
        if (onClose) {
          onClose();
        }
      }
    });

    handler.openIframe();
  } catch (err) {
    console.error('Paystack initialization error:', err);
    if (onError) {
      onError(err);
    }
  }
};
