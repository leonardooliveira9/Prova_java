module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/Downloads/Prova Java/lib/db/mysql-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Utilidade para conectar ao MySQL e executar queries
__turbopack_context__.s([
    "closeConnection",
    ()=>closeConnection,
    "executeQuery",
    ()=>executeQuery,
    "getConnection",
    ()=>getConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
let connection = null;
/**
 * Parse uma connection string MySQL no formato: mysql://user:password@host:port/database
 */ function parseConnectionString(connectionString) {
    const url = new URL(connectionString.replace(/^mysql:\/\//, "mysql://"));
    return {
        host: url.hostname || "localhost",
        user: url.username || "root",
        password: url.password || "",
        database: url.pathname.slice(1) || "neurobyte",
        port: url.port ? Number.parseInt(url.port) : 3306
    };
}
async function getConnection(connectionString) {
    if (connection) {
        return connection;
    }
    try {
        let config;
        if (connectionString) {
            config = parseConnectionString(connectionString);
        } else {
            config = {
                host: process.env.MYSQL_HOST || "localhost",
                user: process.env.MYSQL_USER || "root",
                password: process.env.MYSQL_PASSWORD || "",
                database: process.env.MYSQL_DATABASE || "neurobyte",
                port: Number.parseInt(process.env.MYSQL_PORT || "3306")
            };
        }
        connection = await __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0
        });
        console.log("[v0] MySQL connection established successfully");
        return connection;
    } catch (error) {
        console.error("[v0] Failed to connect to MySQL:", error);
        throw new Error(`Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
async function closeConnection() {
    if (connection) {
        await connection.end();
        connection = null;
        console.log("[v0] MySQL connection closed");
    }
}
async function executeQuery(sql, values = []) {
    try {
        const conn = await getConnection();
        const [results] = await conn.execute(sql, values);
        return results;
    } catch (error) {
        console.error("[v0] Query execution error:", error);
        throw new Error(`Database query failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
}),
"[project]/Downloads/Prova Java/lib/db/product-repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Repository para operações de produtos no MySQL
__turbopack_context__.s([
    "createProductInDB",
    ()=>createProductInDB,
    "deleteProductFromDB",
    ()=>deleteProductFromDB,
    "getAllProductsFromDB",
    ()=>getAllProductsFromDB,
    "getCategoriesFromDB",
    ()=>getCategoriesFromDB,
    "getProductByIdFromDB",
    ()=>getProductByIdFromDB,
    "getProductsByCategoryFromDB",
    ()=>getProductsByCategoryFromDB,
    "updateProductInDB",
    ()=>updateProductInDB
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/db/mysql-client.ts [app-route] (ecmascript)");
;
async function getAllProductsFromDB() {
    const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    ORDER BY created_at DESC
  `;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql);
}
async function getProductByIdFromDB(id) {
    const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    WHERE id = ?
    LIMIT 1
  `;
    const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql, [
        id
    ]);
    return results.length > 0 ? results[0] : null;
}
async function getProductsByCategoryFromDB(category) {
    const sql = `
    SELECT id, name, description, price, category, stock, image_url, created_at, updated_at
    FROM products
    WHERE category = ?
    ORDER BY name ASC
  `;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql, [
        category
    ]);
}
async function createProductInDB(product) {
    const sql = `
    INSERT INTO products (name, description, price, category, stock, image_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
    const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.stock,
        product.image_url
    ]);
    return results.insertId;
}
async function updateProductInDB(id, product) {
    const fields = [];
    const values = [];
    if (product.name) {
        fields.push("name = ?");
        values.push(product.name);
    }
    if (product.description) {
        fields.push("description = ?");
        values.push(product.description);
    }
    if (product.price !== undefined) {
        fields.push("price = ?");
        values.push(product.price);
    }
    if (product.category) {
        fields.push("category = ?");
        values.push(product.category);
    }
    if (product.stock !== undefined) {
        fields.push("stock = ?");
        values.push(product.stock);
    }
    if (product.image_url) {
        fields.push("image_url = ?");
        values.push(product.image_url);
    }
    fields.push("updated_at = NOW()");
    values.push(id);
    if (fields.length === 1) return false // Nenhum campo para atualizar
    ;
    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
    const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql, values);
    return results.affectedRows > 0;
}
async function deleteProductFromDB(id) {
    const sql = "DELETE FROM products WHERE id = ?";
    const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql, [
        id
    ]);
    return results.affectedRows > 0;
}
async function getCategoriesFromDB() {
    const sql = "SELECT DISTINCT category FROM products ORDER BY category ASC";
    const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$mysql$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeQuery"])(sql);
    return results.map((row)=>row.category);
}
}),
"[project]/Downloads/Prova Java/app/api/db/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API para buscar produtos do MySQL
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$product$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/Prova Java/lib/db/product-repository.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const products = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$lib$2f$db$2f$product$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllProductsFromDB"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            products,
            count: products.length
        });
    } catch (error) {
        console.error("[v0] Error fetching products:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$Prova__Java$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Erro ao buscar produtos"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fbac00ad._.js.map