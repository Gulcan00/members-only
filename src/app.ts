import 'dotenv/config';
import express from 'express';
import ejs from 'ejs';
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// Error Handling
