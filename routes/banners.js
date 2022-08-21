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

// 첫화면 배너리스트 조회
router.get("/bannerlist", async (req, res) => {
    const bannerlist = await Banner.findAll({where: {state: true}});

    res.json({ bannerlist });
})

router.get("/managebanner", authMiddleware, async (req, res) => {
    try{
        const { user } = res.locals;
        if(user.grade==='gold'){
            const bannerlist = await Banner.findAll({});
            res.status(201).json({ bannerlist });
        }else{
            res.status(400).send({errorMessage: "관리자만 관리페이지로 이동할 수 있습니다."});
        }
        
    }catch(error){
        console.log(error);
        return res.status(400).send({ errorMessage: "오류가 발생했습니다." });
    }
    


})

// 배너수정화면 조회
router.get("/bannerdetail/:bannerId", async (req, res) => {
    try{
        const { bannerId } = req.params;

        const detail = await Banner.findOne({where: {bannerId: bannerId}});
        res.json({detail})
    }catch(error){
        console.log(error);
        return res.status(400).send({ errorMessage: "DB정보를 받아오지 못했습니다." });
    }
    
})

// 배너 삭제
router.delete("/delete/:bannerId", async (req, res) => {
    try{
        const { bannerId } = req.params;

        await Banner.destroy({ where: {bannerId: bannerId }})
        res.status(201).json({ message: '배너가 삭제 되었습니다.' });
    }catch(error){
        console.log(error);
        return res.status(400).send({ errorMessage: "DB정보를 받아오지 못했습니다." });
    }
    
})

// 배너 수정
router.patch("/updatebanner/:bannerId", authMiddleware, upload.single("imgfile"), async (req, res) => {
    try{
        const { bannerId } = req.params;
        const { title, content, link, state } = req.body;

        if(req.file === undefined){
            await Banner.update({ title: title, content: content, link: link, state: state },{where:{bannerId:bannerId}})
        }else{
            const imageUrl = req.file.filename;
            await Banner.update({ title: title, content: content, link: link, state: state, image: imageUrl },{where:{bannerId:bannerId}})
        }
        res.status(201).json({ message: '배너가 수정 되었습니다.' });
    }catch(error){
        console.log(error);
        return res.status(400).send({ errorMessage: "DB정보를 받아오지 못했습니다." });
    }
    
})


module.exports = router;