const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
// const authMiddleware = require('../middlewares/auth-middleware');
const bcrypt = require('bcrypt');
require('dotenv').config();

// 회원가입
router.post("/signup", async(req, res) => {
    try{
        const {userEmail, password, confirmPassword} = req.body;

        if(password !== confirmPassword){
            res.status(400).send({errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다."});
            return;
        }

        if(userEmail && password  === ''){
            return res.status(400).send({ errorMessage: '필수 항목을 모두 입력해주세요!' });
        }

        const existUserEmail = await User.findOne({
            where: { userEmail: userEmail },
        });

        if(existUserEmail){
            return res.status(400).send({errorMessage: "이미 가입된 이메일 주소 입니다."});
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            userEmail,
            password: hashPassword
        });

        res.status(201).json({ message: '회원가입이 완료되었습니다!' });
    } catch (err) {
        console.log(err);
        res.status(400).send({errorMessage: "요청한 데이터 형식이 올바르지 않습니다."});
    }
});

module.exports = router;