import apiInstance from "../config/api-instance";

const uri = 'user/';


const UserApi = {
    register: (nickname, password, firstname, lastname, mail, birthDate) => apiInstance.post(`${uri}register`, {
        nickname: nickname,
        password: password, 
        firstname: firstname, 
        lastname: lastname, 
        mail: mail, 
        birthDate: birthDate
    }),
}

export default UserApi;