# StudyFlow – Organizador de Estudos

##  Aplicação Online

https://study-flow.netlify.app

##  Repositório no GitHub

https://github.com/ArthurSantanaSantos1/StudyFlow

---

##  Descrição do Projeto

O **StudyFlow** é uma aplicação web desenvolvida para ajudar estudantes a organizarem suas tarefas de estudo de forma simples, prática e eficiente.

O projeto surgiu para solucionar um problema muito comum entre estudantes: a dificuldade em manter uma rotina de estudos organizada, acompanhar tarefas pendentes e visualizar o progresso ao longo do tempo.

Além das funcionalidades de gerenciamento de tarefas, a aplicação também integra uma API pública de dicas de programação, exibindo mensagens motivacionais e educativas para o usuário.

---

##  Problema Real

Muitos estudantes enfrentam dificuldades em:

- Organizar suas atividades de estudo;
- Lembrar tarefas pendentes;
- Manter consistência na rotina;
- Visualizar o próprio progresso;
- Permanecer motivados durante os estudos.

---

##  Solução Proposta

O StudyFlow oferece uma interface intuitiva que permite ao usuário:

- Cadastrar tarefas de estudo;
- Informar a matéria da tarefa;
- Marcar tarefas como concluídas;
- Remover tarefas desnecessárias;
- Filtrar tarefas por status;
- Visualizar o número total de tarefas;
- Receber dicas de programação consumidas de uma API pública.

---

##  Público-Alvo

- Estudantes do ensino médio;
- Universitários;
- Pessoas que estão se preparando para vestibulares, ENEM e concursos públicos;
- Iniciantes em programação.

---

## ⚙️ Funcionalidades

-  Adicionar tarefas de estudo;
-  Organizar por matéria;
-  Marcar tarefas como concluídas;
-  Remover tarefas;
-  Filtrar tarefas:
  - Todas;
  - Pendentes;
  - Concluídas;
-  Exibir contador de tarefas;
-  Exibir dicas de programação obtidas por API pública.

---

##  API Pública Utilizada

A aplicação utiliza a API pública:

- https://programming-quotesapi.vercel.app/api/random

Essa API retorna frases e dicas relacionadas à programação, utilizadas para motivar os estudantes e enriquecer a experiência do usuário.

---

##  Testes Automatizados

O projeto possui teste de integração utilizando **Jest**, responsável por validar o consumo da API pública.

Para executar os testes:

```bash
npm test