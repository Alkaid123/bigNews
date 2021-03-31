const express = require('express');
const router = express();
const conn = require('../util/sql.js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const sql = require('../util/sql.js');

router.use(express.urlencoded());

// const upload = multer({ dest: 'uploads' })
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName)
    }
})

const upload = multer({ storage })

// 写接口
// 获取用户的基本信息
router.get('/userinfo', (req, res) => {
    // console.log(req.query);
    // 收集用户信息
    const { username } = req.query;
    // 拼接 sql
    const sqlStr = `select * from users where username="${username}"`
    console.log(sqlStr);
    // 操作 sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: '500' });
            return;
        };
        console.log(result);
        res.json({ msg: '获取用户的基本信息成功', status: '0', data: result[0] });
    })

});

// 上传用户头像
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // console.log('本次上传的文件是', req.file);

    res.json({
        msg: '上传成功',
        status: 0,
        src: 'http://localhost:3005/' + req.file.filename
    });
})

// 更新用户的基本信息
router.post('/userinfo', (req, res) => {
    // console.log(req.body);
    // 收集用户信息
    const { id, nickname, email, userPic } = req.body;
    // 拼接 sql
    const sqlStr = `update users set nickname="${nickname}",email="${email}",userPic="${userPic}" where id=${id}`
    console.log(sqlStr);
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: 500 });
            return;
        };
        res.json({ msg: '请求成功', status: 0 });
    })
});

// 重置密码
router.post('/updatepwd', (req, res) => {
    // console.log(req.body);
    const { oldPwd, newPwd, id } = req.body;
    // 查询当前id是否有对应的密码
    const sqlStrSelect = `select password from users where id=${id}`
    // console.log(sqlStrSelect);
    // 操作 sql
    conn.query(sqlStrSelect, (err, result) => {
        console.log(oldPwd);
        console.log('错误是', err);
        if (err) {
            res.json({ status: 1, msg: '服务器错误' });
            return;
        };
        console.log(result);
        if (result[0].password != oldPwd) {
            res.json({ status: 1, msg: '旧密码错误' });
            return;
        };

        // 拼接 sql
        const sqlStr = `update users set password="${newPwd}" where id=${id} `
        console.log(sqlStr);
        conn.query(sqlStr, (err, result) => {
            console.log('错误是', err);
            if (err) {
                res.json({ msg: '服务器错误', status: 1 });
            };
            res.json({ msg: '修改密码成功', status: 0 });
        });
    });

});


module.exports = router;