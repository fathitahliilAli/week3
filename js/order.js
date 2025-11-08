// order.js
import { loadCart } from './storage.js';
import { clearCart } from './cart.js';

function formatPrice(n){ return `$${n.toFixed(2)}`; }
const TAX_RATE = 0.05;
const DISCOUNT_THRESHOLD = 50;
const DISCOUNT_RATE = 0.10;

const orderList = document.getElementById('order-list');
const subtotalEl = document.getElementById('order-subtotal');
const taxEl = document.getElementById('order-tax');
const totalEl = document.getElementById('order-total');
const discountEl = document.getElementById('order-discount');
const confirmBtn = document.getElementById('confirm-order');
const backBtn = document.getElementById('back-products');
const cartCountNode = document.getElementById('cart-count-order') || document.getElementById('cart-count');

function render(){
  const cart = loadCart() || [];
  if(orderList){
    orderList.innerHTML = '';
    if(cart.length === 0){
      orderList.innerHTML = `<div style="color:var(--muted)">No items in your cart. <a href="index.html">Shop now</a></div>`;
    } else {
      cart.forEach(it => {
        const row = document.createElement('div');
        row.className = 'order-row';
        row.innerHTML = `<div><strong>${it.name}</strong><div style="color:var(--muted);font-size:0.95rem">${it.qty} × ${formatPrice(it.price)}</div></div><div style="font-weight:700">${formatPrice(it.qty * it.price)}</div>`;
        orderList.appendChild(row);
      });
    }
  }
  // totals
  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  let discount = 0;
  if(subtotal > DISCOUNT_THRESHOLD) discount = subtotal * DISCOUNT_RATE;
  const total = subtotal + tax - discount;

  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(taxEl) taxEl.textContent = formatPrice(tax);
  if(discountEl) discountEl.textContent = '-' + formatPrice(discount);
  if(totalEl) totalEl.textContent = formatPrice(total);

  // update cart counts
  if(cartCountNode) cartCountNode.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

if(confirmBtn) confirmBtn.addEventListener('click', () => {
  const cart = loadCart() || [];
  if(cart.length === 0){
    alert('Your cart is empty.');
    return;
  }
  // simulate order confirmation
  const totals = {
    subtotal: cart.reduce((s,i)=>s + i.price * i.qty, 0),
    tax: 0,
    discount: 0,
    total: 0
  };
  totals.tax = totals.subtotal * TAX_RATE;
  if(totals.subtotal > DISCOUNT_THRESHOLD) totals.discount = totals.subtotal * DISCOUNT_RATE;
  totals.total = totals.subtotal + totals.tax - totals.discount;

  // show a friendly confirmation (no backend). Replace with real checkout later.
  alert(`Order confirmed!\n\nSubtotal: $${totals.subtotal.toFixed(2)}\nTax: $${totals.tax.toFixed(2)}\nDiscount: -$${totals.discount.toFixed(2)}\nTotal: $${totals.total.toFixed(2)}\n\n(Checkout is simulated — no backend.)`);

  // clear cart after confirmation
  clearCart();
  render();
});

if(backBtn) backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

render();
