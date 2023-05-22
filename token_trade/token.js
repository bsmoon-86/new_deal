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

create_token('Test', 'TS', 0, 100000000)