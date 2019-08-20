const express = require("express");

const server = express();

server.use(express.json());

// Lista de projetos
const projects = [];

// Armazena a quantidade total de requests
var requests = 0;

// Middleware utilizado nas rotas onde é passado o id de um projeto
// para verificar se existe um projeto com aquele id
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.body.project = project;

  return next();
}

function getTotalRequests(req, res, next) {
  requests += 1;
  console.log(`Total requests: ${requests}`);

  return next();
}

// Adiciona um novo projeto no array
server.post("/projects", getTotalRequests, (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

// Lista todos os projetos
server.get("/projects", getTotalRequests, (req, res) => {
  return res.json(projects);
});

// Edita o título do projeto com o id passado
server.put(
  "/projects/:id",
  getTotalRequests,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;

    req.body.project.title = title;

    return res.json(projects);
  }
);

// Deleta projeto com o id passado
server.delete(
  "/projects/:id",
  getTotalRequests,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(p => p.id == id);

    projects.splice(index, 1);

    return res.json(projects);
  }
);

// Adiciona tarefa para projeto com o id passado
server.post(
  "/projects/:id/tasks",
  getTotalRequests,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;

    req.body.project.tasks.push(title);

    return res.json(projects);
  }
);

server.listen(3000);
