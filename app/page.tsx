"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  ChefHat,
  CheckCircle2,
  Clock,
  Flame,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";

const BUSINESS_NAME = "1.resto";
const BUSINESS_WHATSAPP = "919618861300";
const ORDER_KEY = "1resto_orders";

type View = "shop" | "track" | "admin";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  tag: string;
  rating: number;
  prep: string;
  description: string;
};

type CartItem = Product & { qty: number };

type OrderStatus = "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "DELIVERED";

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  time: string;
  payment: "COD" | "UPI";
};

type FormState = {
  name: string;
  phone: string;
  address: string;
  payment: "COD" | "UPI";
};

const PRODUCTS: Product[] = [
  { id: 1, name: "Paneer Tikka Masala", price: 280, image: "🍛", category: "Main Course", tag: "Bestseller", rating: 4.8, prep: "20 min", description: "Creamy paneer curry with smoky tikka flavour." },
  { id: 2, name: "Butter Chicken", price: 320, image: "🍗", category: "Main Course", tag: "Chef Special", rating: 4.9, prep: "25 min", description: "Rich butter gravy with tender chicken pieces." },
  { id: 3, name: "Dal Makhani", price: 240, image: "🥘", category: "Main Course", tag: "Popular", rating: 4.7, prep: "18 min", description: "Slow cooked black dal with butter and cream." },
  { id: 4, name: "Chicken Biryani", price: 260, image: "🍚", category: "Rice", tag: "Hot", rating: 4.8, prep: "22 min", description: "Aromatic basmati rice with spicy chicken masala." },
  { id: 5, name: "Veg Fried Rice", price: 180, image: "🍜", category: "Rice", tag: "Quick Bite", rating: 4.5, prep: "15 min", description: "Wok tossed rice with fresh vegetables." },
  { id: 6, name: "Butter Naan", price: 60, image: "🫓", category: "Bread", tag: "Fresh", rating: 4.6, prep: "8 min", description: "Soft tandoori naan topped with butter." },
  { id: 7, name: "Tandoori Roti", price: 40, image: "🫓", category: "Bread", tag: "Healthy", rating: 4.4, prep: "7 min", description: "Classic wheat roti from the tandoor." },
  { id: 8, name: "Chicken 65", price: 190, image: "🔥", category: "Starters", tag: "Spicy", rating: 4.8, prep: "16 min", description: "Crispy spicy fried chicken Indian style." },
  { id: 9, name: "Veg Spring Roll", price: 150, image: "🥢", category: "Starters", tag: "Crunchy", rating: 4.5, prep: "14 min", description: "Crispy rolls stuffed with seasoned vegetables." },
  { id: 10, name: "Masala Chai", price: 40, image: "☕", category: "Drinks", tag: "Classic", rating: 4.7, prep: "5 min", description: "Indian tea brewed with spices and milk." },
];

const STATUS_ORDER: OrderStatus[] = ["NEW", "ACCEPTED", "PREPARING", "READY", "DELIVERED"];

const STATUS_META = {
  NEW: { label: "New", Icon: Clock, pill: "bg-slate-100 text-slate-700 border-slate-200" },
  ACCEPTED: { label: "Accepted", Icon: CheckCircle2, pill: "bg-blue-100 text-blue-700 border-blue-200" },
  PREPARING: { label: "Preparing", Icon: ChefHat, pill: "bg-orange-100 text-orange-700 border-orange-200" },
  READY: { label: "Ready", Icon: Bike, pill: "bg-purple-100 text-purple-700 border-purple-200" },
  DELIVERED: { label: "Delivered", Icon: CheckCircle2, pill: "bg-green-100 text-green-700 border-green-200" },
};

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: "shop", label: "Order" },
  { id: "track", label: "Track" },
  { id: "admin", label: "Admin" },
];

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function whatsappPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function getNextStatus(status: OrderStatus): OrderStatus | undefined {
  const index = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[index + 1];
}

function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.pill}`}>
      <Icon size={13} />
      {meta.label}
    </span>
  );
}

function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  return (
    <div className="mt-4 flex items-center">
      {STATUS_ORDER.map((step, index) => {
        const meta = STATUS_META[step];
        const Icon = meta.Icon;
        const active = index <= currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <motion.div
              initial={false}
              animate={{ scale: active ? 1 : 0.9, opacity: active ? 1 : 0.35 }}
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${active ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200" : "border-zinc-200 bg-white text-zinc-400"}`}
            >
              <Icon size={16} />
            </motion.div>
            {index !== STATUS_ORDER.length - 1 && (
              <div className="mx-2 h-1 flex-1 overflow-hidden rounded-full bg-zinc-200">
                <motion.div
                  initial={false}
                  animate={{ width: active && index < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-green-500"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CartPanel({
  drawer = false,
  cart,
  cartCount,
  total,
  form,
  setForm,
  changeQty,
  removeFromCart,
  placeOrder,
  onClose,
}: {
  drawer?: boolean;
  cart: CartItem[];
  cartCount: number;
  total: number;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  changeQty: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
  placeOrder: () => void;
  onClose: () => void;
}) {
  return (
    <aside className={`${drawer ? "" : "hidden lg:block"} rounded-[2rem] border border-orange-100 bg-white/85 p-5 shadow-2xl shadow-orange-100/70 backdrop-blur-xl lg:sticky lg:top-24 lg:h-fit`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-zinc-900">Your Cart</h2>
          <p className="text-xs text-zinc-500">Fast checkout on WhatsApp</p>
        </div>
        {drawer ? (
          <button onClick={onClose} className="rounded-full bg-zinc-100 p-2 text-zinc-700">
            <X size={18} />
          </button>
        ) : (
          <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
            {cartCount} items
          </div>
        )}
      </div>

      <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-3xl shadow-sm">🛒</div>
            <p className="font-semibold text-zinc-700">Cart is empty</p>
            <p className="mt-1 text-xs text-zinc-400">Add dishes from the menu.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm">
              <div className="flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl">{item.image}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-sm font-black text-orange-600">{formatINR(item.price * item.qty)}</p>
                  </div>
                  <p className="text-xs text-zinc-400">{formatINR(item.price)} each</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full bg-zinc-100 p-1">
                      <button onClick={() => changeQty(item.id, -1)} className="rounded-full bg-white p-1 shadow-sm"><Minus size={13} /></button>
                      <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="rounded-full bg-white p-1 shadow-sm"><Plus size={13} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="rounded-full bg-red-50 p-2 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="my-4 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="mb-4 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Total Amount</span>
          <span className="text-2xl font-black">{formatINR(total)}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">Taxes/delivery can be confirmed on WhatsApp.</p>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input placeholder="Your Name" autoComplete="name" className="w-full rounded-2xl border border-zinc-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="relative">
          <Phone size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input placeholder="WhatsApp Number" type="tel" autoComplete="tel" className="w-full rounded-2xl border border-zinc-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="relative">
          <MapPin size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input placeholder="Delivery Address" autoComplete="street-address" className="w-full rounded-2xl border border-zinc-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1">
          {(["COD", "UPI"] as const).map((payment) => (
            <button key={payment} onClick={() => setForm((f) => ({ ...f, payment }))} className={`rounded-xl py-2 text-sm font-bold transition ${form.payment === payment ? "bg-white text-orange-600 shadow-sm" : "text-zinc-500"}`}>{payment}</button>
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} disabled={!cart.length} onClick={placeOrder} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 py-4 font-black text-white shadow-xl shadow-green-200 transition disabled:from-zinc-300 disabled:to-zinc-300 disabled:shadow-none">
          <MessageCircle size={19} />
          Order via WhatsApp
        </motion.button>
        <p className="text-center text-xs text-zinc-400">No app download needed. Order opens in WhatsApp.</p>
      </div>
    </aside>
  );
}

export default function Store() {
  const [view, setView] = useState<View>("shop");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [trackPhone, setTrackPhone] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", phone: "", address: "", payment: "COD" });

  useEffect(() => {
    const saved = localStorage.getItem(ORDER_KEY);
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch { setOrders([]); }
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem(ORDER_KEY, JSON.stringify(newOrders));
  };

  const categories = useMemo(() => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))], []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const myOrders = useMemo(() => {
    const digits = trackPhone.replace(/\D/g, "");
    if (!digits) return orders;
    return orders.filter((order) => order.phone.replace(/\D/g, "").includes(digits));
  }, [orders, trackPhone]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id: number, change: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: item.qty + change } : item).filter((item) => item.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = () => {
    if (!cart.length) return;
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      alert("Please enter name, WhatsApp number and address.");
      return;
    }
    const orderId = `1R-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      items: cart,
      total,
      status: "NEW",
      time: new Date().toLocaleString("en-IN"),
      payment: form.payment,
    };
    saveOrders([newOrder, ...orders]);

    const itemsText = cart.map((item) => `• ${item.name} x${item.qty} = ${formatINR(item.price * item.qty)}`).join("\n");
    const message = `🔔 *New Order - ${BUSINESS_NAME}*\n\n🧾 Order ID: *${orderId}*\n👤 Name: ${newOrder.customerName}\n📞 Phone: ${newOrder.phone}\n📍 Address: ${newOrder.address}\n\n🛒 *Items*\n${itemsText}\n\n💰 *Total:* ${formatINR(newOrder.total)}\n💳 Payment: ${newOrder.payment}\n\nPlease confirm this order.`;

    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");

    setTrackPhone(form.phone);
    setCart([]);
    setShowCart(false);
    setView("track");
  };

  const updateStatus = (id: string, nextStatus: OrderStatus) => {
    const updatedOrders = orders.map((order) => order.id === id ? { ...order, status: nextStatus } : order);
    saveOrders(updatedOrders);
    const order = updatedOrders.find((item) => item.id === id);
    if (!order) return;
    const extra = nextStatus === "ACCEPTED" ? "We have accepted your order." : nextStatus === "PREPARING" ? "Our kitchen has started preparing your food." : nextStatus === "READY" ? "Your order is ready and will be delivered/picked up soon." : nextStatus === "DELIVERED" ? "Your order has been delivered. Thank you!" : "";
    const message = `Hi ${order.customerName}, update from *${BUSINESS_NAME}*.\n\n🧾 Order ID: *${order.id}*\n📦 Status: *${STATUS_META[nextStatus].label}*\n\n${extra}`;
    window.open(`https://wa.me/${whatsappPhone(order.phone)}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fff8ef] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute right-0 top-32 h-80 w-80 rounded-full bg-green-300/30 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <button onClick={() => setView("shop")} className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 8, scale: 1.05 }} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-xl shadow-lg shadow-orange-200">🥘</motion.div>
            <div className="text-left">
              <h1 className="text-xl font-black tracking-tight text-orange-600">{BUSINESS_NAME}</h1>
              <p className="text-xs font-medium text-zinc-400">WhatsApp ordering</p>
            </div>
          </button>
          <nav className="flex rounded-2xl bg-zinc-100 p-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => setView(item.id)} className={`relative rounded-xl px-4 py-2 text-sm font-bold transition ${view === item.id ? "text-orange-700" : "text-zinc-500"}`}>
                {view === item.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl bg-white shadow-sm" />}
                <span className="relative">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 lg:pb-10">
        {view === "shop" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
            <div className="space-y-6">
              <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-red-500 to-amber-400 p-6 text-white shadow-2xl shadow-orange-200 md:p-8">
                <div className="absolute right-0 top-0 text-[9rem] opacity-20">🍽️</div>
                <div className="relative max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur"><Sparkles size={16} />Fresh food. Fast WhatsApp checkout.</div>
                  <h2 className="text-4xl font-black leading-tight md:text-6xl">Delicious food, ordered in seconds.</h2>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 md:text-base">Browse menu, add to cart, and send your order directly on WhatsApp. No app install. No login.</p>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {[["15-25 min", "Fast prep"], ["4.8 ★", "Customer love"], ["WhatsApp", "Easy updates"]].map(([main, sub]) => (
                      <motion.div whileHover={{ y: -4 }} key={main} className="rounded-2xl bg-white/18 p-4 backdrop-blur">
                        <p className="font-black">{main}</p>
                        <p className="text-xs text-white/75">{sub}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              <section className="rounded-[2rem] border border-orange-100 bg-white/75 p-4 shadow-xl shadow-orange-100/50 backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your favourite dish..." className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setCategory(cat)} className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold transition ${category === cat ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-white text-zinc-500 hover:bg-orange-50"}`}>{cat}</button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black">Today’s Menu</h2>
                    <p className="text-sm text-zinc-500">{filteredProducts.length} items available</p>
                  </div>
                  <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-600 shadow-sm md:flex"><Flame size={17} />Live kitchen</div>
                </div>

                <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <motion.article layout key={product.id} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[1.7rem] border border-orange-100 bg-white/90 p-4 shadow-lg shadow-orange-100/50 backdrop-blur-xl">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 transition group-hover:opacity-100" />
                        <div className="mb-4 flex items-start justify-between">
                          <motion.div whileHover={{ rotate: 8, scale: 1.08 }} className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-orange-50 to-amber-50 text-5xl shadow-inner">{product.image}</motion.div>
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">{product.tag}</span>
                        </div>
                        <div>
                          <div className="mb-1 flex items-start justify-between gap-3">
                            <h3 className="text-lg font-black leading-tight">{product.name}</h3>
                            <p className="font-black text-orange-600">{formatINR(product.price)}</p>
                          </div>
                          <p className="min-h-10 text-sm leading-5 text-zinc-500">{product.description}</p>
                          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                            <div className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /><span className="font-bold">{product.rating}</span></div>
                            <div className="flex items-center gap-1"><Clock size={14} /><span>{product.prep}</span></div>
                          </div>
                          <motion.button whileTap={{ scale: 0.96 }} onClick={() => addToCart(product)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-3 font-black text-white shadow-lg shadow-zinc-200 transition hover:bg-orange-600">Add to Cart<Plus size={17} /></motion.button>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            </div>

            <CartPanel cart={cart} cartCount={cartCount} total={total} form={form} setForm={setForm} changeQty={changeQty} removeFromCart={removeFromCart} placeOrder={placeOrder} onClose={() => setShowCart(false)} />
          </div>
        )}

        {view === "track" && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] border border-orange-100 bg-white/85 p-6 shadow-2xl shadow-orange-100/60 backdrop-blur-xl">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-3xl">📦</div>
                <h2 className="text-3xl font-black">Track Your Order</h2>
                <p className="mt-2 text-sm text-zinc-500">Enter your WhatsApp number to see your order status.</p>
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input value={trackPhone} onChange={(e) => setTrackPhone(e.target.value)} placeholder="Enter phone number" className="w-full rounded-2xl border border-zinc-200 bg-white px-12 py-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
              </div>
              <div className="mt-6 space-y-4">
                {myOrders.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                    <p className="font-bold text-zinc-600">No orders found</p>
                    <p className="mt-1 text-sm text-zinc-400">Place an order first from the Order tab.</p>
                  </div>
                ) : (
                  myOrders.map((order) => (
                    <motion.div layout key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-zinc-400">Order ID</p>
                          <h3 className="text-xl font-black">{order.id}</h3>
                        </div>
                        <StatusPill status={order.status} />
                      </div>
                      <OrderTimeline status={order.status} />
                      <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                        <div className="flex justify-between text-sm"><span className="text-zinc-500">Customer</span><span className="font-bold">{order.customerName}</span></div>
                        <div className="mt-2 flex justify-between text-sm"><span className="text-zinc-500">Total</span><span className="font-black text-orange-600">{formatINR(order.total)}</span></div>
                        <div className="mt-2 flex justify-between text-sm"><span className="text-zinc-500">Payment</span><span className="font-bold">{order.payment || "COD"}</span></div>
                        <p className="mt-3 text-xs text-zinc-400">{order.time}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.section>
        )}

        {view === "admin" && (
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black">Kitchen Dashboard</h2>
                <p className="mt-1 text-sm text-zinc-500">Move orders and notify customers on WhatsApp.</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-600 shadow-sm">Total orders: {orders.length}</div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {STATUS_ORDER.map((status) => {
                const meta = STATUS_META[status];
                const Icon = meta.Icon;
                const statusOrders = orders.filter((order) => order.status === status);
                return (
                  <motion.div layout key={status} className="min-h-64 rounded-[1.7rem] border border-orange-100 bg-white/80 p-4 shadow-xl shadow-orange-100/50 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${meta.pill}`}><Icon size={17} /></div>
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-wide">{meta.label}</h3>
                          <p className="text-xs text-zinc-400">Orders</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-black text-zinc-600">{statusOrders.length}</span>
                    </div>
                    <div className="space-y-3">
                      {statusOrders.map((order) => {
                        const next = getNextStatus(order.status);
                        return (
                          <motion.div layout key={order.id} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <div>
                                <p className="font-black">{order.id}</p>
                                <p className="text-xs text-zinc-400">{order.time}</p>
                              </div>
                              <p className="font-black text-orange-600">{formatINR(order.total)}</p>
                            </div>
                            <div className="space-y-1 rounded-2xl bg-zinc-50 p-3 text-sm">
                              <p className="font-bold">{order.customerName}</p>
                              <p className="text-xs text-zinc-500">{order.phone}</p>
                              <p className="line-clamp-2 text-xs text-zinc-400">{order.address}</p>
                            </div>
                            <div className="mt-3 space-y-1">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-xs text-zinc-500">
                                  <span>{item.name} x{item.qty}</span>
                                  <span>{formatINR(item.price * item.qty)}</span>
                                </div>
                              ))}
                            </div>
                            {next && (
                              <motion.button whileTap={{ scale: 0.97 }} onClick={() => updateStatus(order.id, next)} className="mt-4 w-full rounded-2xl bg-zinc-900 py-3 text-xs font-black text-white transition hover:bg-orange-600">Move to {STATUS_META[next].label} & Notify</motion.button>
                            )}
                          </motion.div>
                        );
                      })}
                      {statusOrders.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-400">No orders here</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}
      </main>

      <AnimatePresence>
        {cartCount > 0 && view === "shop" && (
          <motion.button initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }} onClick={() => setShowCart(true)} className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between rounded-3xl bg-zinc-900 px-5 py-4 font-black text-white shadow-2xl shadow-zinc-400 lg:hidden">
            <span className="flex items-center gap-2"><ShoppingCart size={19} />{cartCount} items</span>
            <span>{formatINR(total)} →</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCart(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="absolute bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-white p-4">
              <CartPanel drawer cart={cart} cartCount={cartCount} total={total} form={form} setForm={setForm} changeQty={changeQty} removeFromCart={removeFromCart} placeOrder={placeOrder} onClose={() => setShowCart(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}