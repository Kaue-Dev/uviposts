import { useEffect, useState } from "react";
import { Comentario, Post, Usuario } from "./interfaces/Interfaces";
import { Get } from "./services/Get";
import { FormCriarUsuario } from "./components/FormCriarUsuario";
import { Heart, MessageCircle, Pencil, Trash, X } from "lucide-react";
import { Delete } from "./services/Delete";
import { FormCriarPost } from "./components/FormCriarPost";
import axios from "axios";
import { FormComentar } from "./components/FormComentar";
import { FormAlterarPost } from "./components/FormAlterarPost";

export function App() {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const [mostrarCriarUsuario, setMostrarCriarUsuario] = useState(false);
  const [mostrarCriarPost, setMostrarCriarPost] = useState(false);
  const [mostrarComentar, setMostrarComentar] = useState(0);
  const [mostrarAlterarPost, setMostrarAlterarPost] = useState(false);

  const [postSelecionado, setPostSelecionado] = useState<number>(0);

  const [usuarioAtualizado, setUsuarioAtualizado] = useState(0);
  const [postAtualizado, setPostAtualizado] = useState(0);

  const url = "http://localhost:3000";

  useEffect(() => {
    Get(`${url}/usuarios`).then(response => { setUsuarios(response.data) })
  }, [usuarioAtualizado])

  useEffect(() => {
    Get(`${url}/posts`).then(response => { setPosts(response.data) })
    Get(`${url}/comentarios`).then(response => { setComentarios(response.data) })
  }, [postAtualizado])

  function deletarUsuario(id: number) {
    Delete(`${url}/usuarios`, id).then(() => {
      setUsuarios(usuarios.filter(usuario => usuario.id !== id))
      setUsuarioAtualizado(prev => prev + 1);
    })
  }

  function deletarPost(id: number) {
    Delete(`${url}/posts`, id).then(() => {
      setPosts(posts.filter(post => post.id !== id))
      setPostAtualizado(prev => prev + 1);
      setUsuarioAtualizado(prev => prev + 1);
    })
  }

  function deletarComentario(id: number) {
    Delete(`${url}/comentarios`, id).then(() => {
      setComentarios(comentarios.filter(comentario => comentario.id !== id))
      setPostAtualizado(prev => prev + 1);
    })
  }

  function alterarPost(post_id: number) {
    setPostSelecionado(post_id);
    setMostrarAlterarPost(true);
  }

  function curtir(post_id: number) {
    axios.post(`${url}/posts/${post_id}/curtir`).then(() => {
      setPosts(posts.map(post => {
        if (post.id === post_id) {
          post.numero_de_curtidas += 1;
        }
        return post;
      }))
      setPostAtualizado(prev => prev + 1);
    })
  }

  function comentar(post_id: number) {
    setMostrarComentar(prev => prev === post_id ? 0 : post_id);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl font-bold mt-8 mb-4">Usuários</h2>
        {usuarios.length === 0 && <p>Nenhum usuário.</p>}
        <div className="grid grid-cols-3 gap-4">
          {usuarios.map(usuario => (
            <div key={usuario.id} className="bg-white p-4 rounded-lg relative">
              <button onClick={() => deletarUsuario(usuario.id)} className="absolute cursor-pointer top-2 right-2"><Trash size={16} color="red" /></button>
              <h2 className="text-xl font-bold">{usuario.nome}</h2>
              <p><strong>Bio:</strong> {usuario.biografia}</p>
              <p><strong>E-mail:</strong> {usuario.email}</p>
              <p><strong>Sexo:</strong> {usuario.genero}</p>
              <p><strong>N° Posts:</strong> {usuario.numero_de_postagens}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setMostrarCriarUsuario(!mostrarCriarUsuario)} className="bg-yellow-400 text-white font-bold mt-4 text-lg py-2 rounded-lg w-36">Criar Novo</button>
      </div>
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl font-bold mt-8 mb-4">Posts</h2>
        {posts.length === 0 && <p>Nenhum post.</p>}
        <div className="flex flex-col gap-8 items-center justify-center w-full">
          {posts.map(post => (
            <div key={post.id} className="flex flex-col gap-2 relative w-full">
              <div className="absolute cursor-pointer top-4 right-4 flex items-center gap-2">
                <button onClick={() => deletarPost(post.id)} ><Trash size={16} color="red" /></button>
                <button onClick={() => alterarPost(post.id)} ><Pencil size={16} color="red" /></button>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">{post.titulo_do_post}</h2>
                <p className="mb-2">{post.texto_do_post}</p>
                <p className="text-sm italic mb-4">{usuarios.find(usuario => usuario.id === post.postado_por)?.nome}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1" onClick={() => curtir(post.id)}>
                    <Heart />
                    {post.numero_de_curtidas}
                  </button>
                  <button className="flex items-center gap-1" onClick={() => comentar(post.id)}>
                    <MessageCircle />
                    {comentarios.filter(comentario => comentario.post_id === post.id).length}
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Comentários</h3>
                <div className="flex flex-col gap-2 mb-4">
                  {comentarios.length === 0 && <p>Nenhum comentário.</p>}
                  {comentarios
                    .filter(comentario => comentario.post_id === post.id)
                    .map(comentario => (
                      <div key={comentario.id} className="bg-white p-4 rounded-lg relative">
                        <button onClick={() => deletarComentario(comentario.id)} className="absolute cursor-pointer top-2 right-2"><Trash size={16} color="red" /></button>
                        <p className="mb-2">{comentario.texto_do_comentario}</p>
                        <p className="text-sm italic">{usuarios.find(usuario => usuario.id === comentario.comentado_por)?.nome}</p>
                      </div>
                  ))}
                </div>
                {mostrarComentar === post.id && <FormComentar post_id={post.id} setPostAtualizado={setPostAtualizado} setMostrarComentar={setMostrarComentar} />}
              </div>
            </div>
          ))}
          <button onClick={() => setMostrarCriarPost(!mostrarCriarPost)} className="bg-yellow-400 text-white font-bold mt-4 text-lg py-2 rounded-lg w-36">Criar Novo</button>
        </div>
      </div>
      {mostrarCriarUsuario && (
        <div className="fixed top-0 left-0 w-full min-h-screen bg-black/80 flex flex-col justify-center items-center z-10">
          <div className="bg-blue-200 pb-4 px-4 w-full max-w-3xl rounded-lg relative">
            <button onClick={() => setMostrarCriarUsuario(!mostrarCriarUsuario)} className="absolute cursor-pointer top-2 right-2"><X /></button>
            <h2 className="text-center text-3xl font-bold mt-8 mb-4">Criar Usuário</h2>
            <FormCriarUsuario setMostrarCriarUsuario={setMostrarCriarUsuario} setUsuarioAtualizado={setUsuarioAtualizado} />
          </div>
        </div>
      )}
      {mostrarCriarPost && (
        <div className="fixed top-0 left-0 w-full min-h-screen bg-black/80 flex flex-col justify-center items-center z-10">
          <div className="bg-blue-200 pb-4 px-4 w-full max-w-3xl rounded-lg relative">
            <button onClick={() => setMostrarCriarPost(!mostrarCriarPost)} className="absolute cursor-pointer top-2 right-2"><X /></button>
            <h2 className="text-center text-3xl font-bold mt-8 mb-4">Criar Post</h2>
            <FormCriarPost setMostrarCriarPost={setMostrarCriarPost} setPostAtualizado={setPostAtualizado} setUsuarioAtualizado={setUsuarioAtualizado} />
          </div>
        </div>
      )}
      {mostrarAlterarPost && (
        <div className="fixed top-0 left-0 w-full min-h-screen bg-black/80 flex flex-col justify-center items-center z-10">
        <div className="bg-blue-200 pb-4 px-4 w-full max-w-3xl rounded-lg relative">
          <button onClick={() => setMostrarAlterarPost(!mostrarAlterarPost)} className="absolute cursor-pointer top-2 right-2"><X /></button>
          <h2 className="text-center text-3xl font-bold mt-8 mb-4">Alterar Post</h2>
          <FormAlterarPost post_id={postSelecionado} setMostrarAlterarPost={setMostrarAlterarPost} setPostAtualizado={setPostAtualizado} />
        </div>
      </div>
      )}
    </div>
  );
}