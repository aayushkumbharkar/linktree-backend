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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const generateToken = (payload) => {
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
// Register new user
router.post('/register', auth_middleware_1.validateRegistration, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password, referralCode } = req.body;
        // Check if user already exists
        const existingEmail = yield user_model_1.default.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }
        const existingUsername = yield user_model_1.default.findByUsername(username);
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }
        // Handle referral
        let referredBy = null;
        if (referralCode) {
            const referrer = yield user_model_1.default.findByReferralCode(referralCode);
            if (referrer) {
                referredBy = referrer.id;
            }
        }
        // Create new user
        const user = yield user_model_1.default.createUser({
            email,
            username,
            password,
            referred_by: referredBy
        });
        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        });
        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    referralCode: user.referral_code
                }
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
}));
// Login user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_model_1.default.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Validate password
        const isValidPassword = yield user_model_1.default.validatePassword(user, password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        // Generate JWT token
        const token = generateToken({
            id: user.id,
            email: user.email,
            username: user.username
        });
        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    referralCode: user.referral_code
                }
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
}));
// Request password reset
router.post('/forgot-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.default.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Generate reset token
        const resetToken = (0, uuid_1.v4)();
        // TODO: Store reset token in database with expiration
        // TODO: Send reset email to user
        res.json({
            success: true,
            message: 'Password reset instructions sent to email'
        });
    }
    catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset'
        });
    }
}));
exports.default = router;
