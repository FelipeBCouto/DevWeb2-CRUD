const express = require("express");
const { pool } = require("./data/data");
const app = express();
app.use(express.json());
app.listen(8080, () => {
    console.log("O servidor está ativo na porta 8080")
});

// estabelecendo rota > http://localhost:8080/getUsers
app.get("/getUsers", async(req, res) => {
    try{
        const client = await pool.connect(); // verifica se a conexão está funcionando por meio do método connect() da classe pool
        const { rows } = await client.query("SELECT * FROM Users"); // pegando os arquivos na query, que vem em .JSON  
        console.table(rows); // desconstruindo a tabela em linhas
        res.status(200).send(rows);
    }catch(error){
        res.status(500).send("Erro de conexão com o servidor");
    }
})

// Crie uma rota POST para a criação de recursos. Essa rota deverá receber os dados do novo recurso no corpo da requisição e salvá-lo no banco de dados já desenvolvido. A rota deverá retornar o recurso criado(nome), incluindo o seu id.
// http://localhost:8080/postUsers
app.post("/postUsers", async(req,res) =>{
    try{
        const {id, nome} = req.body;
        const client = await pool.connect();
        await client.query("INSERT INTO Users(ID, nome) VALUES($1, $2)", [id, nome]);
        res.status(200).send(`O nome "${nome}" foi salvo com a id "${id}"!`);
    }catch(error){
        res.status(500).send(error);
    }
})

// Crie uma rota PUT para a atualização de recursos. Essa rota deverá receber o id do recurso a ser atualizado e os dados atualizados no corpo da requisição. A rota deverá atualizar o recurso correspondente e retorná-lo atualizado.
//  http://localhost:8080/putUsers
app.put("/putUsers", async(req,res) =>{
    try{
        const {id, nome} = req.body;
        const client = await pool.connect();
        await client.query("UPDATE Users SET nome = $1 WHERE id = $2 ", [nome, id]);
        res.status(200).send(`A ocorrência referente a id "${id}" foi atualizada para o nome "${nome}"!`);
    }catch(error){
        res.status(500).send(error);
    }
})

// Crie uma rota DELETE para a exclusão de recursos. Essa rota deverá receber o id do recurso a ser excluído e removê-lo do banco de dados. A rota deverá retornar uma mensagem indicando que o recurso foi excluído com sucesso.
//  http://localhost:8080/deleteUsers
app.delete("/deleteUsers", async(req,res) =>{
    try{
        const {id, nome} = req.body;
        const client = await pool.connect();
        await client.query("DELETE FROM Users WHERE id = $1", [id]);
        res.status(200).send(`A ocorrência referente a id "${id}" foi excluída!`);
    }catch(error){
        res.status(500).send(error);
    }
})