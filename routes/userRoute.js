import express from "express";
import { allFav, allTests, bookTest, cancelTest, createUser, toFav } from "../controllers/userCntrl.js";
const router = express.Router()

router.post("/register", createUser)
router.post("/booktest/:id", bookTest)
router.post("/alltests", allTests)
router.post("/canceltest/:id", cancelTest)
router.post("/tofav/:rid", toFav)
router.post("/allfav", allFav)

export {router as userRoute}