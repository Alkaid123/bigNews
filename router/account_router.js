const express = require('express');
const router = express();
const conn = require('../util/sql.js');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded());

// 写接口
// 注册
router.post('/reguser', (req, res) => {

    // 收集数据
    // console.log(req.body);
    const { username, password } = req.body;

    // 判断 是否有注册名重复
    const sqlStrSelect = `select username from users where username="${username}"`;
    console.log(sqlStrSelect);


    // 操作数据库
    conn.query(sqlStrSelect, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: "服务器错误", status: '500' });
            return;
        };
        console.log(result);
        // 如果 result不为空，则表示用户名已被注册
        if (result.length > 0) {
            res.json({ msg: "注册失败，注册名已被占用", status: '1' });
            return;
        };

        // 继续往下走，说明没有被占用
        // 1、拼接sql
        const sqlStr = `insert into users(username,password) values("${username}","${password}")`
        // console.log(sqlStr);
        // 2、操作数据库
        conn.query(sqlStr, (err, result) => {
            console.log('出现的错误是', err);
            if (err) {
                res.json({ "status": 500, "message": "服务器错误" });
                return;
            }
            console.log(result);
            res.json({ "status": 0, "message": "注册成功！" })
        });

    });

});

// 登录
router.post('/login', (req, res) => {
    // console.log(req.body);
    // 收集用户数据
    const { username, password } = req.body;
    // 拼接sql
    const sqlStr = `select * from users where username="${username}" and password="${password}"`
    console.log(sqlStr);
    // 操作数据库
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: '500' });
            return;
        }
        console.log(result);
        // 如果能在result中查找到，则可以登录
        if (result.length > 0) {
            // 添加token
            const token = 'Bearer ' + jwt.sign(
                { name: username },
                'gz61',                 // 加密的密码，要与express-jwt中的验证密码一致
                { expiresIn: 2 * 60 * 60 }     // 过期时间，单位是秒
            )
            res.json({ msg: '登录成功', status: '0', token });
        } else {
            res.json({ msg: '登陆失败', status: '1' });
        }
    });
});


module.exports = router;