import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3000' // temporary, will update after backend deploy
});