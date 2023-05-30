const express = require('express')
const router = express.Router()

const contract_info = require("../build/contracts/survey.json")
// smartcontract를 로드 
const Caver = require('caver-js')
// 사용할 블록체인 네트워크 주소를 지정
const caver = new Caver('https://api.baobab.klaytn.net:8651') 
// 블록체인 네트워크에 있는 컨트렉트를 연결
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)
// 지갑의 정보를 등록
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
caver.klay.accounts.wallet.add(account)

const token = require('./token')

module.exports = function(){

    router.get('/', function(req, res){
        if(!req.session.login){
            res.redirect("/")
        }else{
            const _id = req.session.login.id


            // 컨트렉트와 연동하여 설문에 참여한지 여부를 체크
            smartcontract
            .methods
            .check_survey(_id)
            .call()
            .then(function(result){
                console.log(result)
                // check_survey라는 함수가 돌려주는 데이터는 bool의 형태 -> result라는 변수에 대입되어있다.
                if (result) {   // 설문을 한 경우
                    // 설문에 참여했다면 localhost:3000/ 이동
                    console.log('설문 이력이 있는 경우')
                    res.redirect('/')
                }else{          // 설문을 참여하지 않은 경우
                    // 설문에 참여하지 않았다면 localhost:3000/survey 이동
                    console.log('설문 이력이 없는 경우')
                    // 유저의 정보를 ejs 파일과 함께 보내준다
                    res.render("survey")
                }
            })

        }
    })

    router.get('/submit', function(req, res){
        if(!req.session.login){
            res.redirect("/")
        }else{
            const _id = req.session.login.id
            const _name = req.session.login.name
            const _gender = req.query.gender
            const _age = req.query.age
            const _coffee = req.query.coffee
            console.log(_id, _name, _gender, _age, _coffee)

            // 컨트렉트에서 key 값과 value의 값이 필요하다
            // add_survey(user, gender, age, coffee)
            // 유저가 보낸 설문 대답을 컨트렉트를 이용하여 데이터를 저장
            smartcontract
            .methods
            .add_survey(_id, _name, _gender, _age, _coffee)
            .send({
                from : account.address, 
                gas : 2000000
            })
            .then(async function(receipt){
                console.log(receipt)
                // 설문이 완료되면 토큰을 보상한다. 
                // 토큰의 주소를 .env에 작성한 주소를 사용한다. 
                const token_address = process.env.token_address
                // 토큰을 보상해주는 지갑의 주소 값을 넣어준다.
                const address = '0x6A12A3909D0737d7e4CDeDB3Cde300406700d672'
                // 토큰을 양을 지정
                const amount = 10000
                const result = await token.trans_token(token_address, address, amount)
                console.log(result)
                // 저장이 완료되면 localhost:3000/ 이동
                res.redirect("/")
            })

        }
    })

    router.get("/list", async function(req, res){
        // 설문 내역의 개수를 저장한 변수를 지정
        let count = 0
        // 설문 내역이 몇개가 존재하는 확인
        // 컨트렉트에 있는 count_list() 함수가 리턴하는 값이 설문 내역의 개수
        await smartcontract
        .methods
        .count_list()
        .call()
        .then(function(_count){
            // count_list() 함수에서 리턴한 결과 값을 _count에 담아둔다.
            count = _count
        })
        console.log(count)
        // 배열의 데이터를 담는 array를 생성
        let survey_list = new Array()
        // 배열의 길이만큼 반복적으로 get_survey 함수를 호출
        // 반복문 생성
        // 배열의 길이만큼 반복
        // 배열의 모든 데이터를 받아온다 
        // 반복을 할 때마다 새로운 array에 추가해준다
        for (var i =0; i < count; i++){
            await smartcontract
            .methods
            // get_survey(i)-> 모든 배열의 값들을 불러온다
            .get_survey(i)
            .call()
            .then(function(result){
                // get_survey 함수의 리턴값은 json 형태로 들어온다
                // 키값이 0은 부분에는 유저의 정보
                // 키 값이 1인 부분에는 성별
                // 2인 부분에는 연령대
                // 3인 부분에는 커피 선호
                // 결과를 survey_list에 추가해준다
                survey_list.push(result)
            })
        }
        // survey_list.ejs 파일을 보내면서 컨트렉트에 있는 설문 내역(data라는 이름으로)을 같이 보내준다.
        res.render("survey_list", {data : survey_list})


    })




    return router
}