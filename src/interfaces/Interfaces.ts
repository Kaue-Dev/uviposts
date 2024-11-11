export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  genero: string;
  biografia: string;
  numero_de_postagens: number;
}

export interface Comentario {
  id: number;
  texto_do_comentario: string;
  comentado_por: number;
  post_id: number;
}

export interface Post {
  id: number;
  texto_do_post: string;
  numero_de_curtidas: number;
  postado_por: number;
  titulo_do_post: string;
}