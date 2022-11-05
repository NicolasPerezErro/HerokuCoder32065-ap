import { Router } from 'express'
import { fork } from 'child_process'
import logger from '../../../logger/logger.js'

const randomRouter = new Router();

function numerosRandom(cant) {
    const obj = {};
    for (let i = 0; i < cant; i++) {
        let randomNumber = Math.ceil(Math.random() * 1000);
        if (obj[randomNumber]) {
            obj[randomNumber]++;
        } else {
            obj[randomNumber] = 1;
        }
        obj[randomNumber] ? obj[randomNumber] : obj[randomNumber] = 0
    }
    return obj
}


randomRouter.get('/random', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`);
    const body = req.query;
    if (body.cant) {
        res.send(numerosRandom(body.cant));
        return
    }
    res.redirect('/api/randomSinParam')
})

randomRouter.get('/randomSinParam', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`);

    /* DESACTIVAR child_process

    const computo = fork('./src/fork/calculoNumerosRandom.js');
    computo.send('start');
    computo.on('message', listado => {
        res.json(listado);
    })
*/
    res.send(numerosRandom(600000000));
})


export default randomRouter