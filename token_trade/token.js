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
    const owner = keyring.address
    console.log(owner)

    // 유저의 지갑 주소를 container 추가
    const keyring2 = keyringContainer.keyring.createFromPrivateKey('0x1b02d2bb3012f7218e90d336a935bd919d0741a5814252d51cf5c337984f2192')
    keyringContainer.add(keyring2)

    // approve(권한을 받을 주소, 토큰의 양, from)
    await kip7.approve(owner, _amount, {from : keyring2.address})

    const receipt = await kip7.transferFrom(
        _address, 
        owner, 
        _amount, 
        {from : owner})

    console.log(receipt)

    // 이 함수는 에러가 발생
    // 에러의 원인은 오너가 오너의 지갑이 아닌 
    // 다른 사람의 지갑의 토큰을 이동하려하기 때문
    // 이 함수를 에러가 발생하지 않게 실행을 시키려면
    // 유저가 토큰에 대한 권한을 오너에게 지정
    // 권한을 지정하는 함수는 approve()
    // approve()  
    //      자기 자신의 지갑에서 일정 토큰의 양을 다른 사람이 
    //      이동 시킬 수 있도록 허가하는 함수
    // transferFrom()함수를 실행하기 위해서는 
    // approve() 함수를 이용하여 권한을 지정하고 사용

}
trans_from_token('0xd52863320168D36402EFb31b36515D723656258D', 1000)