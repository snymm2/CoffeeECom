const express = require("express")
const { sendError } = require("../helpers")
const { randomBytes } = require("node:crypto")
const { verifyPassword } = require("./password")
const { createAuthMiddleware, hashToken, setSessionCookie, clearSessionCookie } = require("./authMiddleware")
const { send } = require("node:process")
const { use } = require("react")

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const SESSION_DURATION_SECONDS = SESSION_DURATION_MS / 1000;

function createAuthRouter(db) {
    const router = express.Router();

    const users = db.collection("users");
    const sessions = db.collection("adminSessions");

    const { requireAdmin } = createAuthMiddleware(db);

    router.post("/login", async (req, res, next) => {
        try {
            const {username, password} = req.body || {};

            if (typeof username !== "string" || typeof password !== "string" ||
                username.length > 100 || password.length > 1024 ||
                !username.trim() || !password) {

                    return sendError(res, 400, "Username and Password are required.");
                }
            
            const normalizedUsername = username.trim();

            const user = await users.findOne({username: normalizedUsername, isActive: true, role: "admin"});
            if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash))) {
                return sendError(res, 401, "Invalid username or password.")
            }

            const now = new Date();
            const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

            const token = randomBytes(32).toString("hex");

            await sessions.insertOne({userId: user._id, tokenHash: hashToken(token), createdAt: now, expiresAt})

            setSessionCookie(res, token, SESSION_DURATION_SECONDS);

            return res.json({authenticated: true, user: {username: user.username, role: user.role}});
        } catch (err) {
            return next(err)
        }
    });


    router.get("/me", requireAdmin, (req, res) => {
        return res.json({authenticated: true, user: req.admin,});
    });

    router.post("/logout", async (req, res, next) => {
        try {
            const token = req.headers.cookie
                ?.split(";")
                .map((part) => part.trim())
                .find((part) => part.startsWith("cc_admin_session="))
                ?.slice("cc_admin_session=".length);

            if (token) {
                await sessions.deleteOne({tokenHash: hashToken(token)})
            }

            clearSessionCookie(res);

            return res.json({success: true});
        } catch (error) {
            return next(error);
        }
    })

    return router;
}

module.exports = createAuthRouter;