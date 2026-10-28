const express = require("express")
const { randomBytes } = require("crypto")

const { sendError } = require("../helpers")
const { verifyPassword } = require("./password")
const { createAuthMiddleware, hashToken, setSessionCookie, clearSessionCookie } = require("./authMiddleware")

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const SESSION_DURATION_SECONDS = SESSION_DURATION_MS / 1000;

function createAuthRouter(db) {
    const router = express.Router();

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
            
            const user = await db.getAdminByUsername(normalizedUsername);
            if (!user || !(await verifyPassword(password, user.passwordSalt, user.passwordHash))) {
                return sendError(res, 401, "Invalid username or password.")
            }

            const token = randomBytes(32).toString("hex");
            await db.createSession(user._id.toString(), hashToken(token), SESSION_DURATION_MS)

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
                await db.removeSessionByHash(hashToken(token))
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