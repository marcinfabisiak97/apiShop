"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const order_1 = __importDefault(require("./routes/order"));
const stripe_1 = __importDefault(require("./routes/stripe"));
const sendEmail_1 = __importDefault(require("./routes/sendEmail"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
if (process.env.MONGODB_URL) {
    mongoose_1.default
        .connect(process.env.MONGODB_URL)
        .then(() => {
        console.log("mongodb database connection established");
    })
        .catch((err) => {
        console.log("something wrong with the connection to mongodb the error is" + err);
    });
}
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://famous-salmiakki-42778d.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "accessToken"],
}));
app.use(express_1.default.json());
app.use("/api/", sendEmail_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/products", products_1.default);
app.use("/api/carts", cart_1.default);
app.use("/api/orders", order_1.default);
app.use("/api/checkout", stripe_1.default);
app.listen(process.env.PORT || 5000, () => {
    console.log("backend server is running");
});
