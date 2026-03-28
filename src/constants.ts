/**
 * EDIT THESE CONSTANTS TO CUSTOMIZE YOUR STORE
 */

export const STORE_CONFIG = {
  STORE_NAME: "Lumina Essentials",
  PRODUCT_NAME: "Aura Smart Lamp",
  PRODUCT_DESCRIPTION: "Experience the perfect ambiance with our Aura Smart Lamp. Featuring 16 million colors, voice control, and a sleek minimalist design that fits any modern home.",
  PRICE_PER_UNIT: 49,
  CURRENCY: "USD",
  VARIANTS: ["Midnight Black", "Arctic White", "Soft Sand"],
  DEFAULT_COUNTRY: "United States",
  
  // Featured Products
  FEATURED_PRODUCTS: [
    {
      name: "Pro Smart Watch",
      price: 129,
      image: "https://picsum.photos/seed/smartwatch/600/600",
      description: "Next-gen fitness tracking and notifications."
    },
    {
      name: "Classic Cotton T-Shirt",
      price: 25,
      image: "https://picsum.photos/seed/tshirt/600/600",
      description: "Premium organic cotton for everyday comfort."
    },
    {
      name: "Urban Runner Shoes",
      price: 89,
      image: "https://picsum.photos/seed/shoes/600/600",
      description: "Lightweight design with superior cushioning."
    },
    {
      name: "The Art of Design Book",
      price: 35,
      image: "https://picsum.photos/seed/book/600/600",
      description: "A deep dive into modern aesthetic principles."
    }
  ],
  
  // Supabase Configuration
  SUPABASE_URL: "https://trkodfskditafxahfoed.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_ihF2vOO9kl_l5YXdg_we8A_QCrYcfkX",
};

export const BENEFITS = [
  {
    title: "Premium Quality",
    description: "Crafted with the finest materials to ensure durability and a luxury feel in every detail.",
    icon: "ShieldCheck",
  },
  {
    title: "Eco-Friendly",
    description: "Sustainable manufacturing processes and energy-efficient LED technology.",
    icon: "Leaf",
  },
  {
    title: "2-Year Warranty",
    description: "We stand behind our products. Enjoy peace of mind with our comprehensive warranty.",
    icon: "Award",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Place Your Order",
    description: "Fill out the order form with your delivery details. No payment required upfront.",
  },
  {
    step: "02",
    title: "Order Confirmation",
    description: "Our team will process your order and prepare it for immediate shipping.",
  },
  {
    step: "03",
    title: "Pay on Delivery",
    description: "Pay the courier in cash only when you receive your product at your doorstep.",
  },
];

export const FAQS = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping usually takes 3-5 business days depending on your location.",
  },
  {
    question: "Is there any extra charge for COD?",
    answer: "No, Cash on Delivery is a free service we provide for your convenience.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee if you are not completely satisfied with your purchase.",
  },
];
