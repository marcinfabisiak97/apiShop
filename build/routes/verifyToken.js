"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenAndAdmin = exports.verifyTokenAndAuthorization = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader && process.env.JWT_SECRET !== undefined) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err)
                res.status(403).json("Token is invalid" + err);
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json("You are not authorized");
    }
};
exports.verifyToken = verifyToken;
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not allowed to that");
        }
    });
};
exports.verifyTokenAndAuthorization = verifyTokenAndAuthorization;
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json("You are not allowed to that");
        }
    });
};
exports.verifyTokenAndAdmin = verifyTokenAndAdmin;
