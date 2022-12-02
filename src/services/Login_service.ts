import { IAuthReqDto, IAuthResDto } from '@/api';
import axios from 'axios';
const API_URL = 'http://localhost:3000/auth/';

class LoginService {
  user: IAuthResDto;
  logIn(user: IAuthReqDto) {
    return axios
      .post(API_URL + 'login', {
        username: user.username,
        password: user.password,
      })
      .then(
        (response) => {
          return response;
        },
        (error) => {
          return error.response;
        },
      );
  }
  logOut() {
    localStorage.clear();
  }
}

export default new LoginService();
