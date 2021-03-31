const express = require('express');
const router = express();
const conn = require('../util/sql.js');
const jwt = require('jsonwebtoken');
const sql = require('../util/sql.js');

router.use(express.urlencoded());

// 写接口
// 获取文章分类列表
router.get('/cates', (req, res) => {
    console.log(req.query);
    // 拼接 sql
    const sqlStr = `select * from categories`
    console.log(sqlStr);
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ status: 1, msg: '服务器错误' });
            return;
        };
        console.log(result);
        res.json({
            msg: '获取文章分类列表成功',
            status: 0,
            data: { result }
        });
    })
});

// 新增文章分类
router.post('/addcates', (req, res) => {
    // console.log(req.body);
    // 收集用户信息
    const { name, slug } = req.body;
    // 拼接sql
    const sqlStr = `insert into categories(name,slug) values("${name}","${slug}")`
    // console.log(sqlStr);
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: 1 });
            return;
        };
        res.json({ msg: '新增文章分类成功', status: 0 });

    });
});

// 根据 Id 删除文章分类
router.get('/deletecate', (req, res) => {
    // console.log(req.query);
    // 收集数据
    const { id } = req.query;
    // 拼接 sql
    const sqlStr = `delete from categories where id=${id}`
    console.log(sqlStr);
    // 操作 sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: 1 });
            return;
        };
        res.json({ msg: '删除文章分类成功！', status: 0 });
    })
});

// 根据 Id 获取文章分类数据
router.get('/getCatesById', (req, res) => {
    // console.log(req.query);
    // 收集数据
    const { id } = req.query;
    // 拼接 sql
    const sqlStr = `select * from categories where id=${id}`
    console.log(sqlStr);
    // 操作 sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ status: '1', msg: '服务器错误' });
            return;
        };
        console.log(result);
        res.json({ msg: '获取文章分类数据成功！', status: '0', data: result });
    })

});

// 根据 Id 更新文章分类数据
router.post('/updatecate', (req, res) => {
    // console.log(req.body);
    // 收集数据
    const { id, name, slug } = req.body;
    // 拼接 sql
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    console.log(sqlStr);
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log('错误是', err);
        if (err) {
            res.json({ msg: '服务器错误', status: '1' });
            return;
        };
        res.json({ msg: "更新文章分类数据成功", status: '0' });
    })
})


module.exports = router;