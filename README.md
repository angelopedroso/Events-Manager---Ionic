# Gerenciador de Eventos

##Trabalho da matéria de Programação para plataformas móveis 2

Este é um projeto de um aplicativo de gerenciamento de eventos desenvolvido com Ionic e Angular. O aplicativo permite realizar operações de CRUD (Create, Read, Update, Delete) para Organizadores, Eventos e Participantes. Ele também possui uma funcionalidade de modo escuro que é salva no local storage, além de gráficos utilizando ChartsJS.

O projeto usa o json-server para armazenar os dados em um arquivo JSON, que é acessado através de uma API RESTful. O json-server é uma biblioteca simples que cria uma API RESTful para testes rápidos.

## Instalação

1. Clonar o repositório
2. Instalar as dependências do projeto com o comando `npm install`
3. Iniciar o json-server com o comando `npm run server`
4. Iniciar o aplicativo com o comando `ionic serve`

## Funcionalidades

### Organizadores

- Lista todos os organizadores cadastrados.
- Permite criar um novo organizador.
- Permite editar um organizador existente.
- Permite excluir um organizador existente.

### Eventos

- Lista todos os eventos cadastrados.
- Permite criar um novo evento.
- Permite editar um evento existente.
- Permite excluir um evento existente.

### Participantes

- Lista todos os participantes cadastrados.
- Permite criar um novo participante.
- Permite editar um participante existente.
- Permite excluir um participante existente.

### Modo Escuro

- Permite alternar entre o modo claro e escuro.
- Salva a escolha do usuário no local storage.

### Máscaras de Entrada

- Usa a biblioteca ngx-mask para aplicar máscaras de entrada em campos de formulário.

## Tecnologias

- Ionic
- Angular
- TypeScript
- SCSS
- ngx-mask
- json-server
- Charts.js

## Contribuindo

Contribuições são sempre bem-vindas! Se você quiser contribuir com este projeto, basta seguir os passos abaixo:

1. Faça um fork do projeto.
2. Crie um novo branch com a sua funcionalidade ou correção de bug.
3. Envie um pull request para o branch principal do repositório.
4. Aguarde a revisão e aprovação do seu pull request.

## Licença

Este projeto está licenciado sob a Licença Apache 2.0 - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.
