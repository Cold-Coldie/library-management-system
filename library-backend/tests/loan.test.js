const request = require("supertest");
const app = require("../src/server");
const { Book, User, Loan } = require("../src/models");
const jwt = require("jsonwebtoken");
const config = require("../src/config/config");

describe("Loan API", () => {
  let testBook;
  let testUser;
  let userToken;
  let testLoan;

  beforeEach(async () => {
    // Clear tables
    await Loan.destroy({ where: {} });
    await Book.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create test book
    testBook = await Book.create({
      title: "Test Book",
      author: "Test Author",
      isbn: "1234567890",
      totalCopies: 5,
      availableCopies: 5,
    });

    // Create test user
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "$2a$10$YaB6xpBcJe8sW5UWxcHJL.cR2qgbiQns3K.zSQDCU/X.TR8qHqhXO",
      role: "student",
    });

    userToken = jwt.sign(
      { id: testUser.id, email: testUser.email, role: "student" },
      config.jwt.secret,
      { expiresIn: "1h" }
    );

    // Create test loan
    testLoan = await Loan.create({
      userId: testUser.id,
      bookId: testBook.id,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: "borrowed",
    });
  });

  describe("POST /api/loans", () => {
    it("should create new loan successfully", async () => {
      await testLoan.destroy(); // Remove existing loan

      const res = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          bookId: testBook.id,
        });

      expect(res.status).toBe(201);
      expect(res.body.loan).toHaveProperty("status", "borrowed");
    });

    it("should not allow borrowing already borrowed book", async () => {
      const res = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          bookId: testBook.id,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "User already has an active loan for this book"
      );
    });
  });

  describe("PUT /api/loans/:id/return", () => {
    it("should return book successfully", async () => {
      const res = await request(app)
        .put(`/api/loans/${testLoan.id}/return`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.loan).toHaveProperty("status", "returned");

      // Check if book available copies increased
      const updatedBook = await Book.findByPk(testBook.id);
      expect(updatedBook.availableCopies).toBe(testBook.availableCopies + 1);
    });
  });

  describe("GET /api/loans/user/:userId", () => {
    it("should get user active loans", async () => {
      const res = await request(app)
        .get(`/api/loans/user/${testUser.id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.activeLoans).toHaveLength(1);
      expect(res.body.activeLoans[0]).toHaveProperty("status", "borrowed");
    });
  });
});
