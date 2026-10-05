# Pages & Modals Breakdown

**Legend:** 🔹 = MVP · ⭐ = enhancement option (the tag in brackets points back to the feature number, e.g. [4A])

---

## 🛍️ Customer Side

### Pages

**1. Home Page**
- 🔹 Navbar (logo, search bar, categories, cart icon, login/account)
- 🔹 Hero banner with tagline and "Shop Now" button
- 🔹 Featured products and new arrivals
- 🔹 Category shortcuts (Men, Women, Unisex, Body Mist, Perfume Oil, Gift Sets)
- 🔹 Footer (business info, social links, policy links)
- ⭐ Newsletter subscription box [13B]
- ⭐ "Find Your Scent" quiz banner [2B]

**2. Shop / Product Listing Page**
- 🔹 Product grid (image, name, price, size)
- 🔹 Keyword search
- 🔹 Filters: category, price range, size
- 🔹 Sort: price low/high, newest
- 🔹 Out-of-stock label
- ⭐ Scent family filters (Floral, Woody, Fresh, Oriental) [2A]
- ⭐ Autocomplete search suggestions [3A]
- ⭐ Advanced filters: notes, longevity, day/night [3B]

**3. Product Detail Page**
- 🔹 Image, name, description, price, stock status
- 🔹 Size options and quantity selector
- 🔹 Fragrance notes (top, middle, base)
- 🔹 Add to Cart button
- ⭐ Reviews and star ratings (verified buyers) [4A]
- ⭐ "You may also like" section [4B]
- ⭐ Add to Wishlist button [5B]

**4. Cart Page**
- 🔹 Item list with image, price, quantity editor, remove button
- 🔹 Real-time subtotal
- 🔹 Proceed to Checkout button
- ⭐ Saved cart across devices [5A]
- ⭐ "Save for later" section [5B]

**5. Checkout Page**
- 🔹 Delivery details form (name, address, contact number)
- 🔹 Shipping fee computation
- 🔹 Payment method selection (COD + one online option)
- 🔹 Order summary review and Place Order button
- ⭐ Promo code field [6A]
- ⭐ Guest checkout option [6B]
- ⭐ Multiple payment methods [7B]
- ⭐ Payment gateway redirect (test mode) [7A]

**6. Order Confirmation Page**
- 🔹 Order number and summary
- 🔹 Payment instructions (if online/bank transfer)
- 🔹 "View My Orders" and "Continue Shopping" buttons

**7. Login / Register Page**
- 🔹 Login form
- 🔹 Registration form (name, email, contact number, password)
- ⭐ Google/Facebook login [1A]
- ⭐ Forgot password link and email verification [1B]

**8. My Account Page**
- 🔹 Profile info (view and edit)
- 🔹 Saved delivery address
- 🔹 Change password
- ⭐ Wishlist tab [5B]

**9. My Orders Page**
- 🔹 Order history list (order no., date, total, status)
- 🔹 View details button
- ⭐ Reorder button [8B]

**10. Order Details Page**
- 🔹 Items, delivery info, payment status, order status
- 🔹 Cancel button (only while Pending)
- ⭐ Visual tracking timeline [8A]
- ⭐ "Write a review" button per delivered item [4A]

**11. Static Pages**
- 🔹 About Us
- 🔹 Contact Us (business info and map or address)
- 🔹 Shipping and Return Policy
- ⭐ FAQ with inquiry form [13A]

### Modals

- 🔹 **Added to Cart / Mini-cart modal:** confirms the item added, with "View Cart" and "Continue Shopping"
- 🔹 **Cancel Order confirmation:** "Are you sure?" with a reason dropdown
- 🔹 **Upload Payment Proof modal:** for bank transfer/GCash receipts
- 🔹 **Edit Address modal:** update delivery address from account or checkout
- 🔹 **Login required modal:** shown if a guest tries to checkout (not needed if you build 6B)
- ⭐ **Scent Finder Quiz modal:** multi-step questions with recommended results [2B]
- ⭐ **Write Review modal:** star rating and comment [4A]
- ⭐ **Forgot Password modal:** email input and OTP/reset link [1B]
- ⭐ **Newsletter popup:** first-visit email signup [13B]

---

## 🛠️ Admin Side

### Pages

**1. Admin Login Page**
- 🔹 Email and password login (admin role only)

**2. Dashboard Page**
- 🔹 Summary cards: total sales, total orders, total customers
- 🔹 Recent orders table
- 🔹 Best-selling products list
- ⭐ Sales charts: daily/weekly/monthly [12A]
- ⭐ Export reports to Excel/PDF [12B]
- ⭐ Low-stock alert widget [10A]

**3. Products Management Page**
- 🔹 Product table (image, name, category, price, stock, status)
- 🔹 Search and filter by category
- 🔹 Add, edit, delete buttons
- 🔹 Active/inactive toggle
- ⭐ Bulk CSV upload button [9A]

**4. Inventory Page**
- 🔹 Stock list per product
- 🔹 Out-of-stock indicators
- 🔹 Automatic deduction on order (system behavior)
- ⭐ Low-stock threshold settings [10A]
- ⭐ Stock movement history log [10B]

**5. Orders Management Page**
- 🔹 Orders table with filters (status, date)
- 🔹 Quick status update dropdown
- 🔹 View order button
- 🔹 Mark payment as received

**6. Order Detail Page (Admin)**
- 🔹 Customer and delivery details
- 🔹 Items ordered and payment info
- 🔹 Status update controls
- ⭐ Print invoice / packing slip PDF [11A]
- ⭐ Auto email/SMS notification on status change [11B]

**7. Customers Page (optional, keep if time allows)**
- 🔹 Customer list (name, email, contact, date joined)
- 🔹 View order history per customer

### Modals

- 🔹 **Add / Edit Product modal:** name, category, price, description, notes, image upload, stock, status
- 🔹 **Delete Confirmation modal:** for products
- 🔹 **Update Stock modal:** add or deduct quantity
- 🔹 **Update Order Status modal:** status dropdown with optional note
- 🔹 **View Payment Proof modal:** image preview with Approve/Reject
- ⭐ **Variants Manager modal:** add sizes (30/50/100ml) with their own price and stock [9B]
- ⭐ **CSV Upload modal:** file picker, template download, preview [9A]
- ⭐ **Stock History modal:** log per product [10B]
- ⭐ **Promo Code modal:** create code, type, value, expiry [6A] (or make this its own admin page)

---

## 📊 Build Summary

| Area | Pages | Modals (MVP) |
|---|---|---|
| Customer | 11 | 4 |
| Admin | 6 (+1 optional) | 5 |
| **Total** | **17 to 18** | **9** |

## Suggested Build Order
1. **Foundation:** database, authentication, layout/navbar
2. **Catalog flow:** Home → Shop → Product Detail
3. **Purchase flow:** Cart → Checkout → Confirmation
4. **Customer account:** My Account, My Orders, Order Details
5. **Admin core:** Products, Inventory, Orders
6. **Admin dashboard and static pages**
7. **Enhancements:** add your chosen picks last, once the MVP works end to end

