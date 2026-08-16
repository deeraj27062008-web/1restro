"use client";
import { useState, useEffect } from 'react';

const BUSINESS_NAME = "1.resto";
const BUSINESS_WHATSAPP = "919618861300";

type Product = { id: number; name: string; price: number; image: string; category: string; }
type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'DELIVERED';
type Order = { id: string; customerName: string; phone: string; address: string; items: any[]; total: number; status: OrderStatus; time: string; }

const PRODUCTS: Product[] = [
  { id: 1, name: "Paneer Tikka Masala", price: 280, image: "🍛", category: "Main" },
  { id: 2, name: "Butter Chicken", price: 320, image: "🍗", category: "Main" },
  { id: 3, name: "Dal Makhani", price: 240, image: "🥘", category: "Main" },
  { id: 4, name: "Butter Naan", price: 60, image: "🫓", category: "Bread" },
  { id: 5, name: "Tandoori Roti", price: 40, image: "🫓", category: "Bread" },
  { id: 6, name: "Veg Spring Roll", price: 150, image: "🥢", category: "Starter" },
  { id: 7, name: "Chicken 65", price: 180, image: "🍗", category: "Starter" },
  { id: 8, name: "Masala Chai", price: 40, image: "☕", category: "Drink" },
];

export default function Store() {
  const [cart, setCart] = useState<(Product & {qty:number})[]>([]);
  const [view, setView] = useState<'shop'|'admin'|'track'>('shop');
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [trackPhone, setTrackPhone] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('1resto_orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('1resto_orders', JSON.stringify(newOrders));
  }

  const placeOrder = () => {
    if(!form.phone || !form.name) { alert("Please enter name and phone"); return; }
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId, customerName: form.name, phone: form.phone, address: form.address,
      items: cart, total: cart.reduce((s,i)=> s + i.price*i.qty, 0),
      status: 'NEW', time: new Date().toLocaleTimeString()
    };
    const updated = [newOrder, ...orders];
    saveOrders(updated);
    const itemLines = cart.map(i=> `- ${i.name} x${i.qty} (Rs.${i.price*i.qty})`).join('%0A');
    const bizText = `*New Order ${orderId}*%0A${form.name}%0A${form.phone}%0A${form.address}%0A%0AItems:%0A${itemLines}%0A%0ATotal: Rs.${newOrder.total}`;
    setCart([]);
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${bizText}`, '_blank');
    alert(`Order ${orderId} Sent!`);
    setView('track');
  }

  const updateStatus = (id: string, status: OrderStatus) => {
    const updated = orders.map(o => o.id === id ? {...o, status} : o);
    saveOrders(updated);
    const order = updated.find(o=> o.id === id);
    const msg = `Hi ${order?.customerName}, your order ${id} from ${BUSINESS_NAME} is now: ${status}.`;
    window.open(`https://wa.me/91${order?.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const myOrders = orders.filter(o => o.phone.includes(trackPhone) || trackPhone === '');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-600">{BUSINESS_NAME} 🥘</h1>
          <div className="flex gap-2 text-sm">
            <button onClick={()=>setView('shop')} className={`px-3 py-1 rounded ${view==='shop'?'bg-orange-100 text-orange-700':'text-gray-500'}`}>Order</button>
            <button onClick={()=>setView('track')} className={`px-3 py-1 rounded ${view==='track'?'bg-orange-100 text-orange-700':'text-gray-500'}`}>Track</button>
            <button onClick={()=>setView('admin')} className={`px-3 py-1 rounded ${view==='admin'?'bg-black text-white':'text-gray-500'}`}>Admin</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {view === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="font-bold text-lg mb-4">Menu</h2>
              <div className="grid grid-cols-2 gap-4">
                {PRODUCTS.map(p=>(
                  <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="text-4xl mb-2">{p.image}</div>
                      <h3 className="font-bold">{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.category}</p>
                      <p className="font-bold text-orange-600 mt-1">₹{p.price}</p>
                    </div>
                    <button onClick={()=> setCart(prev=>{
                      const f = prev.find(i=>i.id===p.id);
                      return f ? prev.map(i=> i.id===p.id ? {...i, qty:i.qty+1}:i) : [...prev, {...p, qty:1}]
                    })} className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium">Add +</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg h-fit sticky top-20">
              <h2 className="font-bold text-lg mb-4">Your Cart</h2>
              {cart.length === 0 ? <p className="text-gray-400 text-sm">Cart is empty</p> : (
                <div className="space-y-3 mb-4">
                  {cart.map(i=> (
                    <div key={i.id} className="flex justify-between items-center text-sm">
                      <span>{i.name} x{i.qty}</span>
                      <span>₹{i.price*i.qty}</span>
                    </div>
                  ))}
                  <hr/>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{cart.reduce((s,i)=> s + i.price*i.qty, 0)}</span>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <input placeholder="Your Name" className="w-full border p-2 rounded text-sm" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
                <input placeholder="WhatsApp Number" type="tel" className="w-full border p-2 rounded text-sm" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
                <input placeholder="Delivery Address" className="w-full border p-2 rounded text-sm" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
                <button disabled={!cart.length} onClick={placeOrder} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold disabled:bg-gray-300">
                  Order via WhatsApp
                </button>
                <p className="text-xs text-center text-gray-400">No app download needed.</p>
              </div>
            </div>
          </div>
        )}

        {view === 'track' && (
          <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-center mb-4">Track Order</h2>
            <input placeholder="Enter your phone number" className="w-full border p-3 rounded mb-4" value={trackPhone} onChange={e=>setTrackPhone(e.target.value)}/>
            <div className="space-y-4">
              {myOrders.length === 0 && <p className="text-center text-gray-400">No orders found.</p>}
              {myOrders.map(o=> (
                <div key={o.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{o.id}</span>
                    <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700">{o.status}</span>
                  </div>
                  <div className="text-sm text-gray-500">Total: ₹{o.total}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div>
            <h2 className="font-bold text-xl mb-4">Kitchen Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['NEW','ACCEPTED','PREPARING','READY','DELIVERED'] as OrderStatus[]).map(status=>(
                <div key={status} className="bg-white rounded-xl p-3">
                  <h3 className="font-bold text-xs text-gray-500 mb-3">{status}</h3>
                  <div className="space-y-3">
                    {orders.filter(o=>o.status===status).map(o=>(
                      <div key={o.id} className="border p-3 rounded shadow-sm bg-gray-50">
                        <div className="flex justify-between"><b className="text-sm">{o.id}</b><span className="text-xs">₹{o.total}</span></div>
                        <div className="text-xs text-gray-600 mt-1">{o.customerName}</div>
                        {status!=='DELIVERED' && (
                          <button onClick={()=> updateStatus(o.id, status==='NEW'?'ACCEPTED': status==='ACCEPTED'?'PREPARING': status==='PREPARING'?'READY':'DELIVERED')} className="mt-2 w-full bg-black text-white text-xs py-1.5 rounded">
                            Move & Notify ➜
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}