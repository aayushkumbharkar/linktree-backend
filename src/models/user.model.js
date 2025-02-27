"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserModel {
    static createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, referred_by } = userData;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const referralCode = (0, uuid_1.v4)().slice(0, 8);
            const query = `
            INSERT INTO users (username, email, password, referral_code, referred_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
            const values = [username, email, hashedPassword, referralCode, referred_by || null];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = yield database_1.default.query(query, [email]);
            return result.rows[0] || null;
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM users WHERE username = $1';
            const result = yield database_1.default.query(query, [username]);
            return result.rows[0] || null;
        });
    }
    static findByReferralCode(referralCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM users WHERE referral_code = $1';
            const result = yield database_1.default.query(query, [referralCode]);
            return result.rows[0] || null;
        });
    }
    static getReferralStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT COUNT(*) as total_referrals
            FROM users
            WHERE referred_by = $1
        `;
            const result = yield database_1.default.query(query, [userId]);
            return { total_referrals: parseInt(result.rows[0].total_referrals) };
        });
    }
    static validatePassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(password, user.password);
        });
    }
}
exports.default = UserModel;
