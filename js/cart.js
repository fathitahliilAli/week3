// cart.js
import { saveCart, loadCart, clearCartStorage } from './storage.js';

const TAX_RATE = 0.05;
const DISCOUNT_THRESHOLD = 50; // optional bonus
const DISCOUNT_RATE = 0.10;

let cart = loadCart() || [];

// helpers
function formatPrice(n){ return `$${n.toFixed(2)}`; }
function findIndexById(id){ return cart.findIndex(it => it.id === id); }

export function getCart(){ return cart; }
export function setCart(newCart){ cart = newCart; saveCart(cart); renderCartCount(); }

export function addToCart(product){
  const idx = findIndexById(product.id);
  if(idx > -1){
    cart[idx].qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  saveCart(cart);
  renderCartCount();
  showToast(`${product.name} added to cart`);
  // animate - optional
}

export function updateQty(id, qty){
  const idx = findIndexById(id);
  if(idx === -1) return;
  cart[idx].qty = qty <= 0 ? 0 : Math.floor(qty);
  cart = cart.filter(i => i.qty > 0);
  saveCart(cart);
  renderCartCount();
}

export function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCartCount();
}

export function clearCart(){
  cart = [];
  saveCart(cart);
  renderCartCount();
}

// calculations
export function calculateTotals(){
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = +(subtotal * TAX_RATE);
  let discount = 0;
  if(subtotal > DISCOUNT_THRESHOLD){
    discount = +(subtotal * DISCOUNT_RATE);
  }
  const total = +(subtotal + tax - discount);
  return { subtotal, tax, discount, total };
}

/* ------------ UI glue for sidebar ------------- */
const cartBtn = document.getElementById('cart-btn') || document.getElementById('cart-btn-order');
const cartSidebar = document.getElementById('cart-sidebar') || document.getElementById('cart-sidebar-order');
const closeCart = document.getElementById('close-cart') || document.getElementById('close-cart-order');

const cartItemsNode = document.getElementById('cart-items') || document.getElementById('cart-items-order');

const subtotalEl = document.getElementById('subtotal') || document.getElementById('subtotal-order');
const taxEl = document.getElementById('tax') || document.getElementById('tax-order');
const discountEl = document.getElementById('discount') || document.getElementById('discount-order');
const totalEl = document.getElementById('total') || document.getElementById('total-order');

const cartCountNode = document.getElementById('cart-count') || document.getElementById('cart-count-order');

const clearCartBtn = document.getElementById('clear-cart') || document.getElementById('clear-cart-order');

const toastNode = document.getElementById('toast') || document.getElementById('toast-order');

function renderCartCount(){
  if(cartCountNode) cartCountNode.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function renderCartItems(){
  if(!cartItemsNode) return;
  cartItemsNode.innerHTML = '';
  if(cart.length === 0){
    cartItemsNode.innerHTML = `<div style="color:var(--muted);padding:12px">Your cart is empty</div>`;
  } else {
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div style="width:54px;height:54px;border-radius:8px;background:#eef2ff;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--primary)">${item.name[0]}</div>
        
        <div style="flex:1">
          <div style="font-weight:700">${item.name}</div>
          <div style="color:var(--muted);font-size:0.95rem">${formatPrice(item.price)} × ${item.qty} = ${formatPrice(item.price * item.qty)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
          <div class="qty">
            <button class="btn qty-minus" data-id="${item.id}">-</button>
            <input class="qty-input" data-id="${item.id}" value="${item.qty}" min="1" style="width:44px;text-align:center;border-radius:8px;border:1px solid rgba(0,0,0,0.06);padding:4px" />
            <button class="btn qty-plus" data-id="${item.id}">+</button>
          </div>
          <button class="btn btn-ghost remove" data-id="${item.id}" style="font-size:0.85rem;color:var(--danger)">Remove</button>
        </div>
      `;
      cartItemsNode.appendChild(div);
    });

    // attach events
    cartItemsNode.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const idx = cart.findIndex(i => i.id === id);
        if(idx > -1){
          cart[idx].qty = Math.max(0, cart[idx].qty - 1);
          cart = cart.filter(i => i.qty > 0);
          saveCart(cart);
          renderCartItems();
          renderCartCount();
        }
      });
    });
    cartItemsNode.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const idx = cart.findIndex(i => i.id === id);
        if(idx > -1){
          cart[idx].qty += 1;
          saveCart(cart);
          renderCartItems();
          renderCartCount();
        }
      });
    });
    cartItemsNode.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.dataset.id;
        let val = parseInt(input.value || '1', 10);
        if(isNaN(val) || val < 1) val = 1;
        updateQty(id, val);
        renderCartItems();
      });
    });
    cartItemsNode.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        renderCartItems();
      });
    });
  }

  const totals = calculateTotals();
  if(subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
  if(taxEl) taxEl.textContent = formatPrice(totals.tax);
  if(discountEl) discountEl.textContent = '-' + formatPrice(totals.discount);
  if(totalEl) totalEl.textContent = formatPrice(totals.total);
}

function toggleSidebar(open = true){
  if(!cartSidebar) return;
  if(open){
    cartSidebar.classList.remove('hidden');
    cartSidebar.setAttribute('aria-hidden', 'false');
    renderCartItems();
  } else {
    cartSidebar.classList.add('hidden');
    cartSidebar.setAttribute('aria-hidden', 'true');
  }
}

function showToast(message){
  if(!toastNode) return;
  toastNode.textContent = message;
  toastNode.classList.remove('hidden');
  toastNode.classList.add('show');
  setTimeout(()=>{ toastNode.classList.remove('show'); toastNode.classList.add('hidden'); }, 1600);
}

/* attach UI events if elements exist on page */
if(cartBtn) cartBtn.addEventListener('click', () => toggleSidebar(true));
if(closeCart) closeCart.addEventListener('click', () => toggleSidebar(false));
if(clearCartBtn) clearCartBtn.addEventListener('click', () => { clearCart(); renderCartItems(); });

/* initialize */
renderCartCount();
renderCartItems();
