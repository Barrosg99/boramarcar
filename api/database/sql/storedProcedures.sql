CREATE DEFINER=`root`@`localhost` PROCEDURE `pessoaAddOrEdit`(
	IN idPessoa INT,
	IN nome VARCHAR(45),
  IN cpf VARCHAR(45),
	IN email VARCHAR(45),
  IN senha_encript VARCHAR(100),
  IN endereco VARCHAR(45),
  IN cep VARCHAR(45),
  IN estado VARCHAR(45),
  IN cidade VARCHAR(45),
  IN telefone VARCHAR(45),
  IN data_nasc date    
)
BEGIN
IF idPessoa = 0 THEN
INSERT INTO pessoa(email,senha_encript,nome,cpf,data_nasc,telefone,estado,cep,cidade,endereco)
	VALUES (email,senha_encript,nome,cpf,data_nasc,telefone,estado,cep,cidade,endereco);
	SET idPessoa = last_insert_id();
ELSE
UPDATE pessoa
SET
email = email,
senha_encript = senha_encript,
nome = nome,
cpf = cpf,
data_nasc = data_nasc,
telefone = telefone,
estado = estado,
cep = cep,
cidade = cidade,
endereco = endereco
WHERE idPessoa = idPessoa;
END IF;
SELECT idPessoa AS 'idPessoa';
END