// product.js - renders product list, uses cart.js addToCart
import { addToCart, getCart, setCart } from './cart.js';

// demo products - you can replace these or load from JSON
const PRODUCTS = [
  // { id: 'p1', name: 'Ethiopian Coffee Beans', price: 9.50, desc: '250g bag' },
  // { id: 'p2', name: 'Arabic Coffee Blend', price: 12.00, desc: '200g can' },
  // { id: 'p3', name: 'Hami Organic Sugar', price: 4.25, desc: '1 kg' },
  // { id: 'p4', name: 'Ceramic Coffee Cup', price: 6.00, desc: 'Single cup' },
  // { id: 'p5', name: 'Reusable Filter', price: 8.75, desc: 'Stainless steel' },
  // { id: 'p6', name: 'Gift Box', price: 18.00, desc: 'Assorted' }
   { id:'p1', img: "https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg", price: 2, name: "Strawberry", category: "fruits" },
  { id:'p2', img: "https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg", price: 3, name: "Fresh Apple", category: "fruits" },
  { id:'p3', img: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg", price: 1, name: "Banana", category: "fruits" },
  { id:'p4', img: "https://images.pexels.com/photos/51958/oranges-fruit-vitamins-healthy-eating-51958.jpeg", price: 5, name: "Lemon", category: "fruits" },
  { id:'p5', img: "https://images.pexels.com/photos/1367243/pexels-photo-1367243.jpeg", price: 6, name: "Tomato", category: "vegetable" },
  { id:'p6', img: "https://images.pexels.com/photos/2893635/pexels-photo-2893635.jpeg", price: 3, name: "Green Pepper", category: "vegetable" },
  { id:'p7', img: "https://images.pexels.com/photos/244394/pexels-photo-244394.jpeg", price: 2, name: "Purple Beet", category: "vegetable" },
  {id:'p8', img: "https://images.pexels.com/photos/5973583/pexels-photo-5973583.jpeg", price: 4, name: "Garlic", category: "vegetable" },
];

const grid = document.getElementById('products-grid');

function createCard(p){
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
  <div class="img-grid">
  <img src="${p.img}" alt="${p.name}">
  </div>
    
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="product-price">${formatPrice(p.price)} • <span style="color:var(--muted)">${p.desc}</span></div>
      <div class="product-actions">
        <button class="btn primary add-to-cart" data-id="${p.id}">Add to Cart</button>
        <button class="btn" data-id="${p.id}" onclick="window.alert('More product details coming soon')">Details</button>
      </div>
    </div>
  `;
  return card;
}

function formatPrice(n){ return `$${n.toFixed(2)}`; }

function renderProducts(){
  if(!grid) return;
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const node = createCard(p);
    grid.appendChild(node);
  });

  // attach add-to-cart actions
  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.dataset.id;
      const prod = PRODUCTS.find(x => x.id === id);
      if(prod){
        addToCart(prod);
      }
    });
  });
}

renderProducts();
