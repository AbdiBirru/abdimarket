type OrderConfirmationEmailProps = {
  customerName: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

export function renderOrderConfirmationEmail({
  customerName,
  orderId,
  items,
  total,
}: OrderConfirmationEmailProps): string {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; color: #1C1B2E;">${item.name} × ${item.quantity}</td>
          <td style="padding: 8px 0; text-align: right; color: #1C1B2E;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #4C3A8C; font-size: 20px;">AbdiMarket</h1>
      <p style="color: #1C1B2E;">Hi ${customerName},</p>
      <p style="color: #1C1B2E;">Your order #${orderId.slice(-8).toUpperCase()} is confirmed. Here's what you ordered:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${itemsHtml}
        <tr>
          <td style="padding: 12px 0 0; border-top: 1px solid #E7E2D8; font-weight: bold; color: #1C1B2E;">Total</td>
          <td style="padding: 12px 0 0; border-top: 1px solid #E7E2D8; text-align: right; font-weight: bold; color: #4C3A8C;">$${total.toFixed(2)}</td>
        </tr>
      </table>
      <p style="margin-top: 24px; color: #1C1B2E; opacity: 0.7; font-size: 13px;">Thanks for shopping with AbdiMarket.</p>
    </div>
  `;
}
