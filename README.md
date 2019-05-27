# Teste de Javascript
Para o funcionamento certo do Sistema é preciso ter o servidor Express correndo que será o intermediário entre o site de cliente e a base de dados e um servidor MySQL, pode configurar as conexões na aba de configurações.

## Pre
-correr `npm install` nos dos projetos para instalar todas as dependencias.

## Passos para correr:
1. Ter MySQL configurado preferivelmente com uma base de dados de proba “test_db”, mas se não tiver o servidor cria para você.
2.  `node ./src/app.js` desde o projeto de servidor. 
3.  '<strike>'Accessar o endpoint {express hostname:port}/api/seed_sql para iniciar a carga dos dados de a cordo com o arquivo de excel. Parâmetro “force=true” para recarregar os dados ainda se já tiver feio isto antes Ex: http://localhost:3000/api/seed_sql?force=true . '</strike>' **Pode fazer o seed da DB desde a aba de configuração do app do cliente**.
4.  Correr a single page aplication que se comunica com o servidor com o comando `ng serve` desde este projeto. Ou Pode acessar a SPA hospedada em Cloud Firebase Hosting desde este link (https://angular-dashboard-pr.firebaseapp.com/). **Lembrando de ter o servidor disponível. **
