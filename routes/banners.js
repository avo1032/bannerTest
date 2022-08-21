const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Banner } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({ storage, 
    limits:{
        fileSize: 1024 * 1024 * 10,
    }
});

// 신규 배너 등록
router.post("/createbanner", authMiddleware, upload.single("imgfile"), async (req, res) => {
    const { title, content, link } = req.body;
    const { user } = res.locals;
    const imageUrl = req.file.filename;

    if(req.file === undefined){
        return res.status(400).send({ errorMessage: "배너 이미지는 필수입니다." });
    }

    if(!title || !content){
        return res.status(400).send({ errorMessage: "배너제목과 내용을 입력해주세요." });
    }



    const createBanner = await Banner.create({ title: title, image: imageUrl,
        content: content, link: link, userId: user.userId})
    res.json({ createBanner })
});

router.get("/bannerlist", async (req, res) => {
    const bannerlist = await Banner.findAll({});

    res.json({ bannerlist });
})

router.get("/managebanner", authMiddleware, async (req, res) => {
    const { user } = res.locals;

    res.json({})
})

module.exports = router;