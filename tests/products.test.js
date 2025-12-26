import supertest from "supertest";
import app from '../src/app.js';
import mongoose from "mongoose";

const requester = supertest(app);



afterAll(async () => {
  await mongoose.connection.close();
});


const productTest = {
    title: 'titleTest',
    shortDescription: 'shortDescriptionTest',
    longDescription: 'longDescriptionTest',
    price: 100,
    stock: 10,
    brand: 'Sony',
    category: 'consolas',
    discount: 5,
    tags: ['popular', 'classic', 'discounts'],
    mainImage: ['imagenTest'],
};

let productTest_id = null;

test("GET /api/products", async () => {
    const response = await requester.get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.payload)).toBe(true);
});




test("POST /api/products", async () => {
    const response = await requester
        .post("/api/products")
        .send(productTest);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");

    const product = response.body.payload;
    productTest_id = product._id;

    expect(product).toHaveProperty("mainImage");
    expect(product.mainImage).toEqual([]);
    expect(Array.isArray(product.mainImage)).toBe(true);
    expect(product.mainImage.length).toBe(0);
});



test("GET /api/products/:pid should return product by id", async () => {
    const response = await requester.get(`/api/products/${productTest_id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");

    const product = response.body.payload;

    expect(typeof product).toBe("object");

    expect(product._id).toBe(productTest_id);
    expect(product._id).toMatch(/^[0-9a-fA-F]{24}$/);

    expect(product).toHaveProperty("title");
    expect(product).toHaveProperty("price");

    expect(product).toHaveProperty("mainImage");
    expect(Array.isArray(product.mainImage)).toBe(true);
})


test("GET /api/products/:pid with invalid id should fail", async () => {
    const response = await requester.get("/api/products/123");

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("error");
});


test("PUT /api/products/:pid should update product", async () => {
    const response = await requester
        .put(`/api/products/${productTest_id}`)
        .send({ title: 'NuevoProductoTest' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    const product = response.body.payload;

    expect(product).toBeDefined();
    expect(product._id).toBe(productTest_id);

    expect(product.title).toBe('NuevoProductoTest');

    // sanity checks (para que no rompa otras cosas)
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("mainImage");
    expect(Array.isArray(product.mainImage)).toBe(true);
});

test("DELETE /api/products/:pid", async () => {
    const response = await requester
        .delete(`/api/products/${productTest_id}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
})

test("GET deleted product should fail", async () => {
    const response = await requester.get(`/api/products/${productTest_id}`);
    expect(response.statusCode).toBe(500); // o 404 si lo manejás
});