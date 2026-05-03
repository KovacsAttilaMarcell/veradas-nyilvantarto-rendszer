import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import router from './routes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use((err: any, _req: any, res: any, next: any) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Érvénytelen vagy hiányzó token.',
    });
  }

  next(err);
});

app.get('/', (_req, res) => {
  res.json({ message: 'A backend és az adatbázis kapcsolat működik.' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Sikeres adatbázis kapcsolat.');

    app.listen(PORT, () => {
      console.log(`Szerver fut a ${PORT} porton.`);
    });
  })
  .catch((error) => {
    console.error('Hiba az adatbázis kapcsolat során:', error);
  });