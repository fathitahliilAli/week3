# week3
thisis week3 project of hamiskills


# Hami MiniMarket — Week 3 Task (Modular Shopping Cart)

## What this is
A responsive single-page product listing and order summary example implementing:
- Modular JS files: `product.js`, `cart.js`, `storage.js`, `order.js`.
- Persistent cart using `localStorage`.
- Cart sidebar/modal with add/remove/update quantity.
- Order summary page with subtotal, tax (5%), discount (10% when subtotal > $50).
- Responsive layout for mobile, tablet, and desktop.
- Toast notifications and small UI animations.

## Files
- `index.html` — product listing + cart sidebar
- `order.html` — order summary and confirmation
- `css/style.css` — responsive styles
- `js/storage.js` — localStorage wrapper
- `js/cart.js` — cart logic + sidebar UI glue
- `js/product.js` — product listing + add to cart buttons
- `js/order.js` — order summary page logic

## How to test
1. Open `index.html` in a modern browser (supports ES modules).
2. Click **Add to Cart** on products — the cart count updates and items persist across reloads.
3. Open the cart  to update quantities or remove items. Totals (subtotal, tax, discount, total) update automatically.
4. Click **Proceed to Order** or open `order.html` to view the final order summary.
5. Click **Confirm Order** to simulate placing an order (this clears the cart locally).




