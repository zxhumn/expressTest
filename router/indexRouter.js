let express = require('express');
let path = require('path');
let myT = require(path.join(__dirname,'../tools/myT'));
let indexRouter = express.Router();
let objectId = require('mongodb').ObjectId;
// 显示根目录
indexRouter.get('/',(req,res)=>{
    if(req.session.userInfo){
        let userName = req.session.userInfo.userName;
        res.render(path.join(__dirname,'../static/views/index.art'),{
            userName
        });

    }else {
        res.setHeader('content-type','text/html');
        res.send('<script>alert("请登录");window.location.href="/login"</script>');
    }
});
// 增
indexRouter.get('/insert',(req,res)=>{
    myT.insert('studentsList',req.query,(err,docs)=>{
        if(!err) res.json({
            mess:"新增成功",
            code:200
        })
    })
});
// 删
indexRouter.get('/delete',(req,res)=>{
    let deleteId = req.query.id;
    myT.delete('studentsList',{_id:objectId(deleteId)},(err,docs)=>{
        if(!err) res.json({
            mess:"删除成功",
            code:200
        })
    })
});
// 改
indexRouter.get('/update',(req,res)=>{
    let name = req.query.name;
    let age = req.query.age;
    let sex = req.query.sex;
    let address = req.query.address;
    let phone = req.query.phone;
    let introduction = req.query.introduction;
    let id = req.query.id;
    myT.update('studentsList',{_id:objectId(id)},{name,age,sex,phone,address,introduction},(err,docs)=>{
        if(!err) res.json({
            mess:"删除成功",
            code:200
        })
    })
});
// 查
// 查所有列表
indexRouter.get('/list',(req,res)=>{
    myT.find('studentsList',{},(err,docs)=>{
        if(!err) res.json({
            mess:"数据",
            code:200,
            list:docs
        })
    })
});
// 模糊查询关键字
indexRouter.get('/search',(req,res)=>{
    let query = {};
    // 传id
    if(req.query.id){
        console.log(req.query.id);
        console.log(objectId(req.query.id));;
        query._id = objectId(req.query.id);
    }
    // 传用户名
    if(req.query.userName){
        query.name = new RegExp(req.query.userName);
    }
    myT.find('studentsList',query,(err,docs)=>{
        if(!err) res.json({
            mess:"数据",
            code:200,
            list:docs
        })
    })
})

module.exports = indexRouter;