const auth = require("../controllers/auth.controller");
const userMiddelware = require("../middlewares/user.middleware");

const router = require("express").Router();
const authRouter = require("express").Router();

router.post("/register", userMiddelware.validateRegister, auth.register);
router.post("/login", userMiddelware.validateLogin, auth.login);
router.get("/verify/:id", auth.verify);
router.get("/me", auth.me);
//router.post("/login", auth.register);

authRouter.use("/auth", router);

module.exports = authRouter;
