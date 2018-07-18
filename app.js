let express = require('express');
let path = require('path');
// 验证码
var svgCaptcha = require('svg-captcha');
// session
var session = require('express-session');
// post传值中间件
var bodyParser = require('body-parser');
// 导入tool
let myT = require(path.join(__dirname,'tools/myT'));
let app = express();
// 静态托管
app.use(express.static('static'));
// session
app.use(session({
    secret: 'keyboard cat',
}))
// post传值
app.use(bodyParser.urlencoded({ extended: false }));
// 导入模板
app.engine('art', require('express-art-template'));
app.set('view', '/static/views');
// 显示登录页
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'/static/views/login.html'));
})
// 创建验证码
app.get('/login/captchaImg', function (req, res) {
	var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text.toLocaleLowerCase();
	res.type('svg');
	res.status(200).send(captcha.data);
});
// 验证登录
app.post('/login',(req,res)=>{    
    // console.log(req.session.captcha);
    // console.log(req.body);
    
    let code = req.session.captcha;
    console.log(code);
    if(req.body.code==code){
        // 验证码正确
        let userName = req.body.userName;
        let userPass = req.body.userPass;
        console.log(userName,userPass,req.body);
        // 验证用户名和密码
        myT.find('userList',{
            userName,
            userPass
        },(err,docs)=>{
            if(!err){
                console.log(docs);
                if(docs.length==1){
                    req.session.userInfo = {
                        userName
                    };
                    myT.mess(res,'欢迎回来','/index');
                }
            }else{
                myT.mess(res,'登录失败','/login');
                
            }
        })
    }else{
        // 验证码错误
        res.setHeader('content-type','text/html');
        res.send('<script>alert("验证码错误");window.location.href="/login"</script>');
    }
});
// 显示首页
app.get('/index',(req,res)=>{
    if(req.session.userInfo){
        res.sendFile(path.join(__dirname,'static/views/index.html'));
    }else {
        res.setHeader('content-type','text/html');
        res.send('<script>alert("请登录");window.location.href="/login"</script>');
   
    }
});
// 退出
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    res.redirect('/login');
})
// 显示注册
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'/static/views/register.html'));
})
// 注册
app.post('/register',(req,res)=>{
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    myT.find('userList',{userName},(err,docs)=>{
        if(docs.length==0){
             myT.insert('userList',{
                userName,
                userPass
            },(err,result)=>{
                if(!err)  myT.mess(res,'欢迎加入我们','/login');
            })
        }else{
            myT.mess(res,'用户名已被注册','/register');
        }
    })
})

app.listen(8888,'127.0.0.1',()=>{
    console.log('listen success');
})