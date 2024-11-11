import axios from 'axios';

export async function Get(url: string) {
  return axios.get(url);
}