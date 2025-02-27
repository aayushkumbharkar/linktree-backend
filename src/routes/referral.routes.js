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
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
// Get referral statistics for the authenticated user
router.get('/stats', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const stats = yield user_model_1.default.getReferralStats(userId);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('Error fetching referral stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referral statistics'
        });
    }
}));
// Get list of referred users
router.get('/referred-users', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT id, username, email, created_at
            FROM users
            WHERE referred_by = $1
            ORDER BY created_at DESC
        `;
        const result = yield database_1.default.query(query, [req.user.id]);
        res.json({
            success: true,
            data: {
                referredUsers: result.rows
            }
        });
    }
    catch (error) {
        console.error('Error fetching referred users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referred users'
        });
    }
}));
// Get referral code for the authenticated user
router.get('/code', auth_middleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const referralLink = `${process.env.FRONTEND_URL}/register?referral=${user.referral_code}`;
        res.json({
            success: true,
            data: {
                referralCode: user.referral_code,
                referralLink
            }
        });
    }
    catch (error) {
        console.error('Error fetching referral code:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching referral code'
        });
    }
}));
exports.default = router;
