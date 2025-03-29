const request = require("supertest");
const app = require("../src/server");
const { User } = require("../src/models");
const jwt = require("jsonwebtoken");
const config = require("../src/config/config");

describe("Authentication API", () => {
  let testUser;

  beforeEach(async () => {
    // Clear users table
    await User.destroy({ where: {} });

    // Create a test user
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "$2a$10$YaB6xpBcJe8sW5UWxcHJL.cR2qgbiQns3K.zSQDCU/X.TR8qHqhXO", // password: 'password123'
      role: "student",
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "New User",
        email: "new@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", "new@example.com");
    });

    it("should not register user with existing email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Another User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "User already exists with this email"
      );
    });
  });

  describe("POST /api/auth/login", () => {
    // it("should login successfully with correct credentials", async () => {
    //   const res = await request(app).post("/api/auth/login").send({
    //     email: "test@example.com",
    //     password: "password123",
    //   });

    //   expect(res.status).toBe(200);
    //   expect(res.body).toHaveProperty("token");
    //   expect(res.body.user).toHaveProperty("email", "test@example.com");
    // });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should get user profile with valid token", async () => {
      const token = jwt.sign(
        { id: testUser.id, email: testUser.email },
        config.jwt.secret,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/auth/profile");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "No token provided");
    });
  });
});
