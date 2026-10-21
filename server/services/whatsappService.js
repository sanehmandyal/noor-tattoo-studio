export const waNotify = async text => {
  const {
    WHATSAPP_TOKEN: token,
    WHATSAPP_PHONE_ID: phoneId,
    NOTIFY_WHATSAPP: recipient
  } = process.env;

  if (!token || !phoneId || !recipient) return;

  try {
    await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: text.slice(0, 1000) }
      })
    });
  } catch (err) {
    console.error('WhatsApp notification failed:', err.message);
  }
};
