import compression from 'compression';
import { Router } from 'express';
import os from 'os';
import logger from '../../../logger/logger.js'

const numCpu = os.cpus().length;

const infoRouter = new Router();

infoRouter.get('/info', (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.json({
        arg_de_entrada: process.argv.slice(2),
        plataforma: process.platform,
        version: process.version,
        memoria_total: process.memoryUsage().rss,
        path: process.cwd(),
        pid: process.pid,
        numCPU: numCpu
    })
})

infoRouter.get('/info-zip', compression(), (req, res) => {
    logger.info(`Ruta: ${req.url} y metodo: ${req.method} ok`)
    res.json({
        arg_de_entrada: process.argv.slice(2),
        plataforma: process.platform,
        version: process.version,
        memoria_total: process.memoryUsage().rss,
        path: process.cwd(),
        pid: process.pid,
        numCPU: numCpu
    })
})

export default infoRouter;