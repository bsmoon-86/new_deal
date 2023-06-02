
const express = require('express')
const app = express()

const request = require('request')

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

app.get("/", function(req, res){
    res.render('index')
})

app.post('/login', function(req, res){
    const _id = req.body._id
    const _pass = req.body._pass
    console.log(_id, _pass)

    const option = {
        url : 'http://192.168.0.37:80/login', 
        qs : {
            '_id' : _id, 
            '_pass' : _pass
        }
    }

    // 컨트렉트 서버와의 접속 
    request.get(option, function(err, result, body){
        if(err){
            console.log(err)
        }
        console.log('result : ', result)

        console.log('body : ', body)
        
        res.send(body)
    })
})


app.listen(3000, function(){
    console.log('server start')
})

