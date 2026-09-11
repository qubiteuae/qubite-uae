// Shared outbound contact links, used by every WhatsApp / "Talk to human" / Buy
// button across the site. Update here once real Telegram / sign-in links land.
export const WHATSAPP_LINK =
  'https://wa.me/971556615745?text=' +
  encodeURIComponent(
    "Hello Qubite, I am interested in ASIC mining. I would like information about: [machine purchase / hosting / both]. Please share available models, current prices, electricity rates, setup charges and expected deployment requirements.",
  )
