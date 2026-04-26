"use client";

import { useCart } from "../cart/use-cart";


type UseWhatsappOptions = {
  phone: string; // contoh: 628123456789
};

export function useWhatsapp({ phone }: UseWhatsappOptions) {
  const { items, totalPrice } = useCart();

  const generateMessage = () => {
    if (items.length === 0) {
      return "Halo, saya ingin bertanya tentang produk.";
    }

    let message = `Halo Admin, saya ingin membeli akun game:\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Harga: Rp ${item.price.toLocaleString("id-ID")}\n`;
      message += `   Qty: ${item.quantity}\n\n`;
    });

    message += `Total: Rp ${totalPrice.toLocaleString("id-ID")}\n\n`;
    message += `Mohon diproses ya 🙏`;

    return message;
  };

  const sendToWhatsapp = () => {
    const message = generateMessage();
    const encoded = encodeURIComponent(message);

    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, "_blank");
  };

  return {
    sendToWhatsapp,
    generateMessage, // optional kalau mau debug
  };
}