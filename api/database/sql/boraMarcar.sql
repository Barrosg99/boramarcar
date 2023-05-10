create database boraMarcar;

use boraMarcar;

CREATE TABLE Usuario (
id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
Nome_Razao_Social VARCHAR(100)  NOT NULL,
Telefone VARCHAR(100) NOT NULL UNIQUE,
Email VARCHAR(100) NOT NULL UNIQUE,
Senha VARCHAR(100) NOT NULL,
Criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
Atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Pessoa (
CPF VARCHAR(20) UNIQUE NOT NULL,
Data_nascimento TIMESTAMP NOT NULL,
fk_Usuario_id INT,
PRIMARY KEY (CPF, fk_Usuario_id)
);

CREATE TABLE Estabelecimento (
CNPJ VARCHAR(20) UNIQUE NOT NULL,
Tipo VARCHAR(100) NOT NULL,
fk_Usuario_id INT,
fk_Endereco_id INT,
PRIMARY KEY (CNPJ, fk_Usuario_id)
);

CREATE TABLE Evento (
id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
Horario TIMESTAMP NOT NULL,
Nome VARCHAR(100) NOT NULL,
Publico BOOLEAN NOT NULL,
fk_Usuario_id INT,
fk_Endereco_id INT,
Criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
Atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE Endereco (
id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
Logradouro VARCHAR(200),
Complemento VARCHAR (200),
CEP VARCHAR(15) NOT NULL,
Municipio VARCHAR(100) NOT NULL,
Estado VARCHAR(100) NOT NULL
);

CREATE TABLE Comparece (
fk_Pessoa_CPF VARCHAR(20),
fk_Usuario_id INT,
fk_Evento_id INT,
PRIMARY KEY (fk_Usuario_id, fk_Evento_id),
Criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Sessao (
id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
fk_Usuario_id INT,
token VARCHAR(100) NOT NULL,
Criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE Pessoa ADD CONSTRAINT FK_Pessoa_2
FOREIGN KEY (fk_Usuario_id)
REFERENCES Usuario (id)
ON DELETE CASCADE;

ALTER TABLE Estabelecimento ADD CONSTRAINT FK_Estabelecimento_2
FOREIGN KEY (fk_Usuario_id)
REFERENCES Usuario (id)
ON DELETE CASCADE;

ALTER TABLE Evento ADD CONSTRAINT FK_Evento_2
FOREIGN KEY (fk_Usuario_id)
REFERENCES Usuario (id)
ON DELETE SET NULL;

ALTER TABLE Comparece ADD CONSTRAINT FK_Comparece_1
FOREIGN KEY (fk_Pessoa_CPF, fk_Usuario_id)
REFERENCES Pessoa (CPF, fk_Usuario_id);

ALTER TABLE Comparece ADD CONSTRAINT FK_Comparece_2
FOREIGN KEY (fk_Evento_id)
REFERENCES Evento (id);

ALTER TABLE Comparece ADD UNIQUE Comparece_Unique
(fk_Pessoa_CPF,fk_Usuario_id, fk_Evento_id);


ALTER TABLE Sessao ADD CONSTRAINT FK_Sessao_1
FOREIGN KEY (fk_Usuario_id)
REFERENCES Usuario (id);

ALTER TABLE Estabelecimento ADD CONSTRAINT FK_Endereco_1
FOREIGN KEY (fk_Endereco_id)
REFERENCES Endereco (id)
ON DELETE CASCADE;

ALTER TABLE Evento ADD CONSTRAINT FK_Endereco_2
FOREIGN KEY (fk_Endereco_id)
REFERENCES Endereco (id)
ON DELETE CASCADE;