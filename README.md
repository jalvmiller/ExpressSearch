/*
login post, todos precisam de sessão
http://localhost:3000/login
{
"login": "admin",
"senha": "admin"
}
*/

/*
cadastrar post
http://localhost:3000/websites
{
"titulo": "Google",
"url": "https://www.google.com",
"palavrasChave": ["pesquisa","busca"],
"descricao": "Motor de busca"
}
*/

/*
buscar get
http://localhost:3000/websites?busca=palavraChave cadastrada do website
*/

/* 
favoritar post
http://localhost:3000/websites/:idwebsite/favorito
{
"nota": 5
}
*/

/*
delete
http://localhost:3000/websites/:idwebsite
*/
