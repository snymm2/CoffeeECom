const { sendError } = require("../helpers");
const { createHash } = require("crypto");

const SESSION_COOKIE = "cc_admin_session";

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

function readCookie(req, name) {
    const cookieHeader = req.headers.cookie || "";

    for (const part of cookieHeader.split(";")) {
        const sep = part.indexOf("=");

        if (sep < 0) continue;

        const key = part.slice(0, sep).trim();

        if (key === name) {
            return part.slice(sep + 1).trim();
        }
    }

    return null;
}

function cookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    };
}

function setSessionCookie(res, token, maxAgeSeconds) {
    const options = cookieOptions();

    const parts = [
        `${SESSION_COOKIE}=${token}`,
        `Path=${options.path}`,
        "HttpOnly",
        "SameSite=Strict",
        `Max-Age=${maxAgeSeconds}`
    ];

    if (options.secure) parts.push("Secure");

    res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res) {
    const options = cookieOptions();

    const parts = [
        `${SESSION_COOKIE}=`,
        `Path=${options.path}`,
        "HttpOnly",
        "SameSite=Strict",
        `Max-Age=0`
    ];

    if (options.secure) parts.push("Secure");
    res.setHeader("Set-Cookie", parts.join("; "));
}

function createAuthMiddleware(db) {

    async function requireAdmin(req, res, next) {
        try {
            const token = readCookie(req, SESSION_COOKIE);

            if (!token || token.length > 200) {
                return sendError(res, 401, "Authentication Required.");
            }

            const session = await db.getSessionByHash(hashToken(token));
            if (!session) {
                clearSessionCookie(res);
                return sendError(res, 401, "Session expired or invalid.");
            }

            const user = await db.getAdminById(session.userId.toString())
            if (!user) {
                await db.removeSessionById(session._id.toString())
                clearSessionCookie(res);
                return sendError(res, 403, "Administrator access required.")
            }

            req.admin = {
                id: user._id.toString(),
                username: user.username,
                role: user.role
            };

            req.adminSessionId = session._id;

            return next();
        } catch (error) {
            return next(error);
        }
    }

    return { requireAdmin };
}

module.exports = { createAuthMiddleware, hashToken, setSessionCookie, clearSessionCookie }