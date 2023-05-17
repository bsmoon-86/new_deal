// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract user_info{
    // 유저 정보를 등록하는 컨트렉트 생성

    // 유저의 정보를 입력하는 구조체 하나 생성
    struct info{
        uint8 state;
        string pass;
        string name;
        string phone;
    }

    // public : 어디에서든 사용이 가능한 조건
    // private : 현재 컨트렉트에서만 사용 가능한 조건
    // internal : 현재 컨트렉트와 상속 컨트렉트에서 사용 가능 조건


    // mapping 데이터 생성
    // 유저의 ID를 기준으로 info라는 구조체를 하나씩 생성
    mapping (string => info) internal users;

    // 유저의 정보를 등록하는 함수 생성
    function add_user(
        string memory _id, 
        string memory _pass, 
        string memory _name, 
        string memory _phone) public {
            require(users[_id].state == 0, 'Error');
            // mapping 데이터의 추가 
            // mapping의 이름[키값].구조체의 위치 = value
            users[_id].pass = _pass;
            users[_id].name = _name;
            users[_id].phone = _phone;
            users[_id].state = 1;
        }

        // 유저의 정보를 출력하는 함수
        function view_info(
            string memory _id) public 
            view returns(
                string memory, 
                string memory, 
                string memory) {
                    string memory pass = users[_id].pass;
                    string memory name = users[_id].name;
                    string memory phone = users[_id].phone;
                    return (pass, name, phone);
                } 



}
