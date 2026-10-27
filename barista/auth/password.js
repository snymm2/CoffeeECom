const { randomBytes, scrypt, timingSafeEqual } = require("crypto");
const { promisify } = require("util")

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);

    return { salt, passwordHash: Buffer.from(derivedKey).toString("hex")};
}

async function verifyPassword(password, salt, storedHash) {
    if (typeof password !== 'string' || typeof salt !== 'string' || typeof storedHash !== 'string' ||
        !/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(storedHash)) {
            return false;
        }
    
    const derivedKey = await scryptAsync(password, salt, KEY_LENGTH);
    const actual = Buffer.from(derivedKey);
    const expected = Buffer.from(storedHash, 'hex');

    return (actual.length === expected.length && timingSafeEqual(actual, expected));    
}

module.exports = { hashPassword, verifyPassword }