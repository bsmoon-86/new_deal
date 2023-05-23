const CaverExtKAS = require('caver-js-ext-kas')

const caver = new CaverExtKAS()

// KAS에 접속하기 위한 KAS ID, PASSWORD
const kas_info = require('./kas.json')
const accesskeyId = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
// testnet chainid를 지정
const chainId = 1001

caver.initKASAPI(chainId, accesskeyId, secretAccessKey)

// 사용할 외부의 지갑 주소를 등록
const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey('0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6')
keyringContainer.add(keyring)

// 토큰을 생성하는 함수 (kip7)
async function create_token(_name, _symbol, _decimal, _amount){
    const kip7 = await caver.kct.kip7.deploy({
        name : _name,                   //토큰의 이름
        symbol : _symbol,               //토큰의 심볼
        decimals : _decimal,            //토큰 소수점 자리수
        initialSupply : _amount         //토큰 발행량
    }, 
    keyring.address, 
    keyringContainer
    )
    console.log(kip7._address)
}

// 토큰 생성 함수 호출
// create_token('Test', 'TS', 0, 100000000)

// 토큰을 거래하는 함수 
async function trans_token(_address, _amount){
    // 발행한 토큰의 주소를 keyringContainer에 등록
    const kip7 = await new caver.kct.kip7('0x8475da976e3A3E34882B7b3445da5A5D3c6d537F')
    kip7.setWallet(keyringContainer)

    // 발행한 토큰을 매개변수 _address에게 _amount 만큼 보내준다. 
    const receipt = await kip7.transfer(
        _address, 
        _amount, 
        {from : keyring.address})

    console.log(receipt)
}

// trans_token('0xd52863320168D36402EFb31b36515D723656258D', 10000)


// 유저가 토큰 발행자에게 토큰을 보내는 함수
async function trans_from_token(_address, _amount){
    // 발행한 토큰의 주소를 keyringContainer에 등록
    const kip7 = await new caver.kct.kip7('0x8475da976e3A3E34882B7b3445da5A5D3c6d537F')
    kip7.setWallet(keyringContainer)  

    // 토큰 발행자의 지갑 주소
    

}