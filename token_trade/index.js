const express = require('express')
const app = express()

// 화면 파일들의 기본경로와 엔진 설정
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')
// post 형식으로 들어온 데이터를 확인하기 위해서 사용
app.use(express.urlencoded({extended : false}))

// token.js 파일을 로드 
const token = require('./token.js')


// api 생성

app.get('/', function(req, res){
    res.render('index')
})

// 지갑 생성 api
app.get('/create_wallet', async function(req, res){
    const wallet = await token.create_wallet()
    console.log(wallet)
    res.send(wallet)
})

// 토큰은 생성하는 화면을 보여주는 api
app.get('/create_token', function(req, res){
    res.render('create_token')
})

// 토큰 발행 하는 api
app.post('/create_token2', async function(req, res){
    const name = req.body._name
    const symbol = req.body._symbol
    const decimal = Number(req.body._decimal)
    const amount = Number(req.body._amount)
    console.log(name, symbol, decimal, amount)

    const token_address = await token.create_token(name, symbol, decimal, amount)

    console.log(token_address)

    res.send(token_address)
})

// 토큰을 거래하는 화면 api
app.get('/trans_token', function(req, res){
    res.render('trans_token')
})

//  토큰을 거래하는 transaction api
app.post('/trans_token2', async function(req, res){
    const _token = req.body._token
    const _address = req.body._address
    const _amount = Number(req.body._amount)
    console.log(_token, _address, _amount)

    await token.trans_token(_token, _address, _amount)

    res.redirect("/")
    

})


// 토큰의 양을 확인 화면 api
app.get('/token_balance', function(req, res){
    res.render('token_balance')
})

app.post('/token_balance2', async function(req, res){
    const _address = req.body._address
    const _token = req.body._token
    console.log(_address, _token)

    const balance = await token.balance_of(_token, _address)

    res.send(balance)
})

app.listen(3000, function(){
    console.log('Server Start')
})