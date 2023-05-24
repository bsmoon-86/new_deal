// SPDX-License-Identifier: MIT
pragma solidity = 0.8.19;

contract survey{
    // 설문에 저장하는 데이터
    // 이름, 휴대폰번호, 성별, 연령대, 커피선호도
    // mapping 데이터 해당하는 사람의 설문을 중복으로 받지 않기위해 생성
    // mapping의 key값은 아이디 value는 이름, 성별, 커피선호도
    // 전체 설문에 대한 정보를 출력

    // 구조체 생성
    struct survey_info {
        string name;
        string gender;
        uint8 age;
        string coffee;
    }

    // mapping 데이터를 생성
    mapping(string => survey_info) internal survey;

    // 배열 생성
    survey_info[] internal survey_list;

    // 설문을 참여했는지 여부를 되돌려주는 함수 생성
    function check_survey(string memory _id) public view returns(bool){
        // 설문의 여부를 확인하는 방법?
        // 설문을 참여하지 않았다 -> 
        // mapping 데이터를 조회를 하면 데이터값들이 0
        if (survey[_id].age == 0){
            return false;
        }else{
            return true;
        }
    }

    // 설문을 추가하는 함수
    // mapping 데이터를 추가 
    // 배열에 데이터를 추가
    function add_survey(
        string memory _id, 
        string memory _name, 
        string memory _gender, 
        uint8 _age, 
        string memory _coffee)
        public {
            // 설문 내역을 mapping 저장
            survey[_id].name = _name;
            survey[_id].gender = _gender;
            survey[_id].age = _age;
            survey[_id].coffee = _coffee;
            // 배열에 데이터를 추가 
            survey_list.push(
                survey_info(_name, _gender, _age, _coffee
                ));
        }


        // 배열의 길이를 리턴하는 함수
        function count_list() public view returns(uint){
            uint result = survey_list.length;
            return result;
        }

        // 배열의 정보를 리턴하는 함수
        function get_survey(
            uint _index) public view returns (
                string memory, 
                string memory, 
                uint8, 
                string memory
            ){
                string memory name = survey_list[_index].name;
                string memory gender = survey_list[_index].gender;
                uint8 age = survey_list[_index].age;
                string memory coffee = survey_list[_index].coffee;

                return (name, gender, age, coffee);
            }
        
}