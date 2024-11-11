export async function Delete(url: string, id: number) {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE"
  });
  return response.json();
}