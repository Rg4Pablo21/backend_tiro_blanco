const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0521',
  database: 'tiro_blanco'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');
});

// Login (guarda directamente el jugador con código)
app.post('/api/login', (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ error: 'Falta el código del jugador' });
  }

  // Solo responde OK, ya que no se guarda aquí nada aún
  res.json({ mensaje: 'Código aceptado, listo para jugar' });
});

// Guardar jugador y su partida en la tabla jugadores
app.post('/api/jugador', (req, res) => {
  const { codigo, puntos, nivel, max_combo } = req.body;

  if (!codigo || puntos == null || nivel == null || max_combo == null) {
    return res.status(400).json({ error: 'Faltan datos del jugador o la partida' });
  }

  const query = `
    INSERT INTO jugadores (codigo, puntos, nivel, max_combo)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [codigo, puntos, nivel, max_combo], (err, result) => {
    if (err) {
      console.error('Error al insertar jugador:', err);
      return res.status(500).json({ error: 'Error al guardar datos del jugador' });
    }

    res.json({ mensaje: 'Datos del jugador guardados correctamente', jugadorId: result.insertId });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
