const request = require("supertest");
const app = require("../src/server");
const { Book, User } = require("../src/models");
const jwt = require("jsonwebtoken");
const config = require("../src/config/config");

describe("Book API", () => {
  let testBook;
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Clear books table
    await Book.destroy({ where: {} });

    // Create test book
    testBook = await Book.create({
      title: "Test Book",
      author: "Test Author",
      isbn: "1234567890",
      category: "Test Category",
      totalCopies: 5,
      availableCopies: 5,
    });

    // Create admin user and generate token
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "$2a$10$YaB6xpBcJe8sW5UWxcHJL.cR2qgbiQns3K.zSQDCU/X.TR8qHqhXO",
      role: "admin",
    });

    adminToken = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      config.jwt.secret,
      { expiresIn: "1h" }
    );

    // Create regular user and generate token
    const user = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "$2a$10$YaB6xpBcJe8sW5UWxcHJL.cR2qgbiQns3K.zSQDCU/X.TR8qHqhXO",
      role: "student",
    });

    userToken = jwt.sign(
      { id: user.id, email: user.email, role: "student" },
      config.jwt.secret,
      { expiresIn: "1h" }
    );
  });

  //   describe("GET /api/books", () => {
  //     it("should get all books", async () => {
  //       const res = await request(app).get("/api/books");

  //       expect(res.status).toBe(200);
  //       expect(res.body.books).toHaveLength(1);
  //       expect(res.body.books[0]).toHaveProperty("title", "Test Book");
  //     });

  //     it("should filter books by title", async () => {
  //       const res = await request(app).get("/api/books").query({ title: "Test" });

  //       expect(res.status).toBe(200);
  //       expect(res.body.books).toHaveLength(1);
  //     });
  //   });

  //   describe("POST /api/books", () => {
  //     it("should create new book with admin token", async () => {
  //       const newBook = {
  //         title: "New Book",
  //         author: "New Author",
  //         isbn: "0987654321",
  //         category: "Fiction",
  //         totalCopies: 3,
  //       };

  //       const res = await request(app)
  //         .post("/api/books")
  //         .set("Authorization", `Bearer ${adminToken}`)
  //         .send(newBook);

  //       expect(res.status).toBe(201);
  //       expect(res.body.book).toHaveProperty("title", "New Book");
  //     });

  //     it("should not create book without admin token", async () => {
  //       const newBook = {
  //         title: "New Book",
  //         author: "New Author",
  //         isbn: "0987654321",
  //       };

  //       const res = await request(app)
  //         .post("/api/books")
  //         .set("Authorization", `Bearer ${userToken}`)
  //         .send(newBook);

  //       expect(res.status).toBe(403);
  //     });
  //   });

  //   describe("PUT /api/books/:id", () => {
  //     it("should update book with admin token", async () => {
  //       const res = await request(app)
  //         .put(`/api/books/${testBook.id}`)
  //         .set("Authorization", `Bearer ${adminToken}`)
  //         .send({
  //           title: "Updated Book Title",
  //         });

  //       expect(res.status).toBe(200);
  //       expect(res.body.book).toHaveProperty("title", "Updated Book Title");
  //     });
  //   });

  describe("DELETE /api/books/:id", () => {
    it("should delete book with admin token", async () => {
      const res = await request(app)
        .delete(`/api/books/${testBook.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const deletedBook = await Book.findByPk(testBook.id);
      expect(deletedBook).toBeNull();
    });
  });
});
