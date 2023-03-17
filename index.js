import express from 'express';
import { appendFileSync } from 'fs';
const app = express();

app.use(express.static('.'));
app.use(express.json());

app.post('/statistic', (req, res) => {
    appendFileSync('statistics.txt', JSON.stringify(req.body) + '\n');
    res.sendStatus(201);
});

app.listen(3000, function () {
    console.log('Екземпляр запущено через порт 3000');
});

