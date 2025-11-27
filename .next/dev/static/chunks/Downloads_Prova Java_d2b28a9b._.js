(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/Prova Java/lib/models/product.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Product",
    ()=>Product
]);
class Product {
    _id;
    _name;
    _description;
    _price;
    _stock;
    _category;
    _imageUrl;
    _createdAt;
    _reviews;
    constructor(name, description, price, stock, category, imageUrl = '/diverse-products-still-life.png'){
        this._id = this.generateId();
        this._name = name;
        this._description = description;
        this._price = price;
        this._stock = stock;
        this._category = category;
        this._imageUrl = imageUrl;
        this._createdAt = new Date();
        this._reviews = [];
        this.validate();
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get price() {
        return this._price;
    }
    get stock() {
        return this._stock;
    }
    get category() {
        return this._category;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    get createdAt() {
        return this._createdAt;
    }
    get reviews() {
        return this._reviews;
    }
    // Setters with validation
    set name(value) {
        if (!value || value.trim().length === 0) {
            throw new Error('Nome do produto não pode ser vazio');
        }
        this._name = value;
    }
    set price(value) {
        if (value < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        this._price = value;
    }
    set stock(value) {
        if (value < 0) {
            throw new Error('Estoque não pode ser negativo');
        }
        this._stock = value;
    }
    // Business methods
    decreaseStock(quantity) {
        if (quantity > this._stock) {
            throw new Error(`Estoque insuficiente. Disponível: ${this._stock}`);
        }
        this._stock -= quantity;
    }
    increaseStock(quantity) {
        if (quantity < 0) {
            throw new Error('Quantidade deve ser positiva');
        }
        this._stock += quantity;
    }
    isAvailable() {
        return this._stock > 0;
    }
    addReview(userName, rating, comment) {
        if (rating < 1 || rating > 5) {
            throw new Error('Avaliação deve ser entre 1 e 5');
        }
        this._reviews.push({
            id: Math.random().toString(36).substr(2, 9),
            userName,
            rating,
            comment,
            date: new Date()
        });
    }
    getAverageRating() {
        if (this._reviews.length === 0) return 0;
        const sum = this._reviews.reduce((acc, review)=>acc + review.rating, 0);
        return sum / this._reviews.length;
    }
    validate() {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error('Nome do produto é obrigatório');
        }
        if (this._price < 0) {
            throw new Error('Preço não pode ser negativo');
        }
        if (this._stock < 0) {
            throw new Error('Estoque não pode ser negativo');
        }
    }
    generateId() {
        return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            description: this._description,
            price: this._price,
            stock: this._stock,
            category: this._category,
            imageUrl: this._imageUrl,
            createdAt: this._createdAt.toISOString(),
            reviews: this._reviews
        };
    }
    static fromJSON(data) {
        const product = new Product(data.name, data.description, data.price, data.stock, data.category, data.imageUrl);
        product._id = data.id;
        product._createdAt = new Date(data.createdAt);
        if (data.reviews) {
            product._reviews = data.reviews.map((r)=>({
                    ...r,
                    date: new Date(r.date)
                }));
        }
        return product;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/exceptions/ecommerce-exceptions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomerNotFoundException",
    ()=>CustomerNotFoundException,
    "ECommerceException",
    ()=>ECommerceException,
    "InsufficientStockException",
    ()=>InsufficientStockException,
    "InvalidOrderStatusException",
    ()=>InvalidOrderStatusException,
    "OrderNotFoundException",
    ()=>OrderNotFoundException,
    "ProductNotFoundException",
    ()=>ProductNotFoundException,
    "ValidationException",
    ()=>ValidationException
]);
class ECommerceException extends Error {
    constructor(message){
        super(message);
        this.name = 'ECommerceException';
    }
}
class ProductNotFoundException extends ECommerceException {
    constructor(productId){
        super(`Produto não encontrado: ${productId}`);
        this.name = 'ProductNotFoundException';
    }
}
class InsufficientStockException extends ECommerceException {
    constructor(productName, available, requested){
        super(`Estoque insuficiente para ${productName}. Disponível: ${available}, Solicitado: ${requested}`);
        this.name = 'InsufficientStockException';
    }
}
class CustomerNotFoundException extends ECommerceException {
    constructor(customerId){
        super(`Cliente não encontrado: ${customerId}`);
        this.name = 'CustomerNotFoundException';
    }
}
class OrderNotFoundException extends ECommerceException {
    constructor(orderId){
        super(`Pedido não encontrado: ${orderId}`);
        this.name = 'OrderNotFoundException';
    }
}
class InvalidOrderStatusException extends ECommerceException {
    constructor(currentStatus, newStatus){
        super(`Transição de status inválida: ${currentStatus} -> ${newStatus}`);
        this.name = 'InvalidOrderStatusException';
    }
}
class ValidationException extends ECommerceException {
    constructor(message){
        super(`Erro de validação: ${message}`);
        this.name = 'ValidationException';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/validators/input-validator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InputValidator",
    ()=>InputValidator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/exceptions/ecommerce-exceptions.ts [app-client] (ecmascript)");
;
class InputValidator {
    // Sanitize user input to prevent XSS attacks
    static sanitizeString(input, maxLength = 500) {
        if (!input || typeof input !== "string") {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Input must be a non-empty string");
        }
        if (input.length > maxLength) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"](`Input exceeds maximum length of ${maxLength} characters`);
        }
        // Remove HTML tags and dangerous characters
        return input.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
    }
    // Validate email format
    static validateEmail(email) {
        const sanitized = this.sanitizeString(email, 255);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Email format is invalid");
        }
        return sanitized;
    }
    // Validate phone number
    static validatePhone(phone) {
        const sanitized = this.sanitizeString(phone, 20);
        // Accept digits, spaces, hyphens, parentheses, and plus sign (for country codes)
        const phoneRegex = /^[\d\s\-()+ ]+$/;
        if (!phoneRegex.test(sanitized)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Phone format is invalid");
        }
        return sanitized;
    }
    // Validate address
    static validateAddress(address) {
        return this.sanitizeString(address, 500);
    }
    // Validate positive number (for prices, quantities)
    static validatePositiveNumber(value, fieldName) {
        if (typeof value !== "number" || value <= 0 || !isFinite(value)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"](`${fieldName} must be a positive number`);
        }
        return Math.round(value * 100) / 100 // Round to 2 decimal places
        ;
    }
    // Validate product quantity
    static validateQuantity(quantity) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Quantity must be between 1 and 1000");
        }
        return quantity;
    }
    // Validate product ID
    static validateProductId(id) {
        const sanitized = this.sanitizeString(id, 100);
        if (!/^[a-zA-Z0-9\-_]+$/.test(sanitized)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Invalid product ID format");
        }
        return sanitized;
    }
    // Validate promo code
    static validatePromoCode(code) {
        const sanitized = this.sanitizeString(code, 50);
        if (!/^[A-Z0-9]{1,50}$/.test(sanitized)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ValidationException"]("Promo code must contain only uppercase letters and numbers");
        }
        return sanitized;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/models/customer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Customer",
    ()=>Customer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/validators/input-validator.ts [app-client] (ecmascript)");
;
class Customer {
    _id;
    _name;
    _email;
    _phone;
    _address;
    _createdAt;
    _loyaltyPoints;
    constructor(name, email, phone, address){
        this._id = this.generateId();
        this._name = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].sanitizeString(name, 100);
        this._email = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validateEmail(email);
        this._phone = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validatePhone(phone);
        this._address = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validateAddress(address);
        this._createdAt = new Date();
        this._loyaltyPoints = 0;
        this.validate();
    }
    // Getters
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get phone() {
        return this._phone;
    }
    get address() {
        return this._address;
    }
    get createdAt() {
        return this._createdAt;
    }
    get loyaltyPoints() {
        return this._loyaltyPoints;
    }
    // Setters with validation
    set name(value) {
        this._name = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].sanitizeString(value, 100);
    }
    set email(value) {
        this._email = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validateEmail(value);
    }
    set phone(value) {
        this._phone = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validatePhone(value);
    }
    set address(value) {
        this._address = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$validators$2f$input$2d$validator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InputValidator"].validateAddress(value);
    }
    validate() {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error("Nome do cliente é obrigatório");
        }
        if (!this._email) {
            throw new Error("Email inválido");
        }
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    generateId() {
        return `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    // Loyalty points methods
    addLoyaltyPoints(points) {
        if (points < 0) {
            throw new Error("Pontos devem ser positivos");
        }
        this._loyaltyPoints += points;
    }
    redeemLoyaltyPoints(points) {
        if (points < 0) {
            throw new Error("Pontos devem ser positivos");
        }
        if (points > this._loyaltyPoints) {
            throw new Error("Pontos insuficientes");
        }
        this._loyaltyPoints -= points;
    }
    getLoyaltyDiscount() {
        // 100 pontos = R$1 de desconto
        return this._loyaltyPoints / 100;
    }
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            phone: this._phone,
            address: this._address,
            createdAt: this._createdAt.toISOString(),
            loyaltyPoints: this._loyaltyPoints
        };
    }
    static fromJSON(data) {
        const customer = new Customer(data.name, data.email, data.phone, data.address);
        customer._id = data.id;
        customer._createdAt = new Date(data.createdAt);
        customer._loyaltyPoints = data.loyaltyPoints || 0;
        return customer;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/models/promo-code.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PromoCode",
    ()=>PromoCode
]);
class PromoCode {
    _code;
    _discountType;
    _value;
    _minOrderValue;
    _isActive;
    constructor(code, discountType, value, minOrderValue = 0){
        this._code = code.toUpperCase();
        this._discountType = discountType;
        this._value = value;
        this._minOrderValue = minOrderValue;
        this._isActive = true;
    }
    get code() {
        return this._code;
    }
    get discountType() {
        return this._discountType;
    }
    get value() {
        return this._value;
    }
    get minOrderValue() {
        return this._minOrderValue;
    }
    get isActive() {
        return this._isActive;
    }
    calculateDiscount(orderTotal) {
        if (!this._isActive || orderTotal < this._minOrderValue) {
            return 0;
        }
        if (this._discountType === 'percentage') {
            return orderTotal * (this._value / 100);
        } else {
            return Math.min(this._value, orderTotal);
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/services/storage-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "storageService",
    ()=>storageService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/models/product.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$customer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/models/customer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$promo$2d$code$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/models/promo-code.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/exceptions/ecommerce-exceptions.ts [app-client] (ecmascript)");
;
;
;
;
class StorageService {
    products;
    customers;
    orders;
    productsByCategory;
    promoCodes;
    wishlists;
    stockNotifications;
    comparisonList;
    constructor(){
        this.products = new Map();
        this.customers = new Map();
        this.orders = new Map();
        this.productsByCategory = new Map();
        this.promoCodes = new Map();
        this.wishlists = new Map();
        this.stockNotifications = new Map();
        this.comparisonList = new Set();
        this.initializeSampleData();
        if ("TURBOPACK compile-time truthy", 1) {
            this.loadFromStorage();
        }
    }
    saveToStorage() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            // Save comparison list
            localStorage.setItem('comparisonList', JSON.stringify(Array.from(this.comparisonList)));
            // Save wishlist (guest only for now)
            const guestWishlist = this.wishlists.get('guest_user');
            if (guestWishlist) {
                localStorage.setItem('guestWishlist', JSON.stringify(Array.from(guestWishlist)));
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }
    loadFromStorage() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            // Load comparison list
            const comparisonData = localStorage.getItem('comparisonList');
            if (comparisonData) {
                const ids = JSON.parse(comparisonData);
                this.comparisonList = new Set(ids);
            }
            // Load wishlist
            const wishlistData = localStorage.getItem('guestWishlist');
            if (wishlistData) {
                const ids = JSON.parse(wishlistData);
                this.wishlists.set('guest_user', new Set(ids));
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }
    // Product methods
    addProduct(product) {
        this.products.set(product.id, product);
        if (!this.productsByCategory.has(product.category)) {
            this.productsByCategory.set(product.category, new Set());
        }
        this.productsByCategory.get(product.category).add(product.id);
    }
    getProduct(id) {
        const product = this.products.get(id);
        if (!product) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductNotFoundException"](id);
        }
        return product;
    }
    getAllProducts() {
        return Array.from(this.products.values());
    }
    getProductsByCategory(category) {
        const productIds = this.productsByCategory.get(category);
        if (!productIds) return [];
        return Array.from(productIds).map((id)=>this.products.get(id)).filter((p)=>p !== undefined);
    }
    getCategories() {
        return Array.from(this.productsByCategory.keys());
    }
    updateProduct(id, updates) {
        const product = this.getProduct(id);
        Object.assign(product, updates);
    }
    deleteProduct(id) {
        const product = this.getProduct(id);
        this.products.delete(id);
        const categorySet = this.productsByCategory.get(product.category);
        if (categorySet) {
            categorySet.delete(id);
        }
    }
    // Customer methods
    addCustomer(customer) {
        this.customers.set(customer.id, customer);
    }
    getCustomer(id) {
        const customer = this.customers.get(id);
        if (!customer) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomerNotFoundException"](id);
        }
        return customer;
    }
    getAllCustomers() {
        return Array.from(this.customers.values());
    }
    updateCustomer(id, updates) {
        const customer = this.getCustomer(id);
        Object.assign(customer, updates);
    }
    deleteCustomer(id) {
        this.customers.delete(id);
    }
    // Order methods
    addOrder(order) {
        this.orders.set(order.id, order);
    }
    getOrder(id) {
        const order = this.orders.get(id);
        if (!order) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$exceptions$2f$ecommerce$2d$exceptions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderNotFoundException"](id);
        }
        return order;
    }
    getAllOrders() {
        return Array.from(this.orders.values());
    }
    getOrdersByCustomer(customerId) {
        return this.getAllOrders().filter((order)=>order.customer.id === customerId);
    }
    updateOrder(id, updates) {
        const order = this.getOrder(id);
        Object.assign(order, updates);
    }
    deleteOrder(id) {
        this.orders.delete(id);
    }
    // Promo Code methods
    addPromoCode(promoCode) {
        this.promoCodes.set(promoCode.code, promoCode);
    }
    getPromoCode(code) {
        return this.promoCodes.get(code.toUpperCase());
    }
    getAllPromoCodes() {
        return Array.from(this.promoCodes.values());
    }
    // Wishlist methods
    addToWishlist(customerId, productId) {
        if (!this.wishlists.has(customerId)) {
            this.wishlists.set(customerId, new Set());
        }
        this.wishlists.get(customerId).add(productId);
        if (customerId === 'guest_user') this.saveToStorage();
    }
    removeFromWishlist(customerId, productId) {
        if (this.wishlists.has(customerId)) {
            this.wishlists.get(customerId).delete(productId);
            if (customerId === 'guest_user') this.saveToStorage();
        }
    }
    getWishlist(customerId) {
        const productIds = this.wishlists.get(customerId);
        if (!productIds) return [];
        return Array.from(productIds).map((id)=>this.products.get(id)).filter((p)=>p !== undefined);
    }
    isInWishlist(customerId, productId) {
        return this.wishlists.get(customerId)?.has(productId) || false;
    }
    // Comparison List methods
    addToComparison(productId) {
        if (this.comparisonList.size >= 4) {
            throw new Error('Máximo de 4 produtos para comparação');
        }
        this.comparisonList.add(productId);
        this.saveToStorage();
    }
    removeFromComparison(productId) {
        this.comparisonList.delete(productId);
        this.saveToStorage();
    }
    getComparisonList() {
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && this.comparisonList.size === 0) {
            this.loadFromStorage();
        }
        return Array.from(this.comparisonList).map((id)=>this.products.get(id)).filter((p)=>p !== undefined);
    }
    clearComparison() {
        this.comparisonList.clear();
        this.saveToStorage();
    }
    isInComparison(productId) {
        return this.comparisonList.has(productId);
    }
    initializeSampleData() {
        // Sample products
        const products = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Notebook Dell XPS 13', 'Notebook ultrafino com processador Intel i7', 5499.99, 15, 'Eletrônicos'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Mouse Logitech MX Master', 'Mouse ergonômico sem fio', 349.99, 50, 'Acessórios'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Teclado Mecânico Keychron', 'Teclado mecânico RGB', 599.99, 30, 'Acessórios'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Monitor LG UltraWide', 'Monitor 34 polegadas ultrawide', 2199.99, 10, 'Eletrônicos'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Webcam Logitech C920', 'Webcam Full HD 1080p', 449.99, 25, 'Acessórios'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$product$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Product"]('Headset HyperX Cloud', 'Headset gamer com microfone', 399.99, 40, 'Acessórios')
        ];
        products.forEach((product)=>this.addProduct(product));
        // Sample customers
        const customers = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$customer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Customer"]('João Silva', 'joao@email.com', '(11) 98765-4321', 'Rua das Flores, 123'),
            new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$customer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Customer"]('Maria Santos', 'maria@email.com', '(21) 99876-5432', 'Av. Paulista, 456')
        ];
        customers.forEach((customer)=>this.addCustomer(customer));
        // Sample Promo Codes
        this.addPromoCode(new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$promo$2d$code$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromoCode"]('BEMVINDO10', 'percentage', 10));
        this.addPromoCode(new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$promo$2d$code$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromoCode"]('VERCEL20', 'fixed', 20, 100));
        this.addPromoCode(new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$models$2f$promo$2d$code$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PromoCode"]('PROMO50', 'percentage', 50));
    }
}
const storageService = new StorageService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/Downloads/Prova Java/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrderConfirmationPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$services$2f$storage$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/services/storage-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function OrderConfirmationPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrderConfirmationPage.useEffect": ()=>{
            try {
                const foundOrder = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$services$2f$storage$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageService"].getOrder(params.id);
                setOrder(foundOrder);
            } catch (error) {
                router.push('/');
            }
        }
    }["OrderConfirmationPage.useEffect"], [
        params.id,
        router
    ]);
    if (!order) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background flex items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-2xl w-full bg-card border p-8 md:p-12 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                        className: "h-10 w-10"
                    }, void 0, false, {
                        fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl md:text-4xl font-serif font-bold mb-4",
                    children: "Pedido Confirmado!"
                }, void 0, false, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-muted-foreground text-lg mb-8",
                    children: [
                        "Obrigado pela sua compra, ",
                        order.customer.name,
                        ".",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 36,
                            columnNumber: 59
                        }, this),
                        "Enviamos um email de confirmação para ",
                        order.customer.email,
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-muted/50 p-6 text-left mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-4 pb-4 border-b",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-medium",
                                    children: "Número do Pedido"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono text-sm",
                                    children: [
                                        "#",
                                        order.id.slice(-8).toUpperCase()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 43,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 mb-6",
                            children: order.items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                item.quantity,
                                                "x ",
                                                item.product.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                            lineNumber: 49,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(item.getSubtotal())
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                            lineNumber: 50,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 48,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center pt-4 border-t font-bold text-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Total"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(order.total)
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-2 gap-4 mb-8 text-left text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border bg-background",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2 font-medium",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this),
                                        " Endereço de Entrega"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: order.customer.address
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border bg-background",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-2 font-medium",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                            lineNumber: 70,
                                            columnNumber: 15
                                        }, this),
                                        " Previsão de Entrega"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-muted-foreground",
                                    children: "3 a 5 dias úteis"
                                }, void 0, false, {
                                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 61,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    asChild: true,
                    size: "lg",
                    className: "w-full md:w-auto gap-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        children: [
                            "Continuar Comprando ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                                lineNumber: 78,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Downloads/Prova Java/app/order-confirmation/[id]/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_s(OrderConfirmationPage, "uxCksDqJo1gcTem1XZVD5SFPMac=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = OrderConfirmationPage;
var _c;
__turbopack_context__.k.register(_c, "OrderConfirmationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Downloads_Prova%20Java_d2b28a9b._.js.map