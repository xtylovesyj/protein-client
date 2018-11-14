var express = require('express');
var router = express.Router();
var log4js = require('log4js');
const config = require('../config/config.base');
const logger4j = log4js.getLogger('状态监控');
const readLastLines = require('read-last-lines');
const systemBaseInfo = require('../services/systemBaseInfo');
const addWebsocketTask = require('../services/websocket');
const Protein = require('../object/protein');
addWebsocketTask('statusMonitor', ws => {
    systemBaseInfo.getDisk().then(data => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                command: 'init',
                data: {
                    cpu: data.cpu,
                    memory: systemBaseInfo.getMemory(),
                    disk: data.disk
                }
            }));
        }
    });
});
addWebsocketTask('statusMonitor', ws => {
    new Protein(ws['_params_']['folderName']).getCurrentStatusInfos().then(data => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                command: 'currentTask',
                data: data
            }));
        }
    }).catch(err => {
        console.error(err);
    });
});
addWebsocketTask('statusMonitor', ws => {
    if (ws.readyState === 1) {
        let proteinLog = null;
        let appLog = null;
        let lineNum = 100;
        (async function() {
            try {
                lineNum = ws['_params_']['lineNum'] || 100;
                proteinLog = await new Protein(ws['_params_']['folderName']).getLog(lineNum);
            } catch (error) {
                logger4j.error(error.stack);
                console.error(`${config.protein_base_path}/${ws['_params_']['folderName']}/outputFolder/log ${error}`);
            }
            try {
                appLog = await readLastLines.read(global.rootPath + '/log/app.log', lineNum);
            } catch (error) {
                logger4j.error(error.stack);
                console.error(`${global.rootPath}/log/app.log ${error}`);
            }
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({
                    command: 'readLogs',
                    data: {
                        protein: proteinLog ? proteinLog : null,
                        app: appLog ? appLog : null
                    }
                }));
            }
        })();

    }
});
router.get('/readLog', function(req, res, next) {
    const folderName = req.query.folderName;
    new Protein(folderName).getLog(req.query.lineNum).then(data => {
        res.send({
            code: 200,
            message: '',
            data: data
        });
    }).catch(err => {
        res.send({
            code: 500,
            message: err.stack,
            data: ''
        });
    });
});

router.get('/readAppLog', function(req, res, next) {
    readLastLines.read(global.rootPath + '/log/app.log', req.query.lineNum)
        .then(lines => {
            console.log('lines', lines);
            res.send({
                code: 200,
                message: '',
                data: lines
            });
        }).catch(error => {
            logger4j.error(error.stack);
            console.error(error);
            res.send({
                code: 500,
                message: error.stack,
                data: ''
            });
        });
});

router.get('/proteinStatus', (req, res, next) => {
    new Protein(req.query.folderName).getCurrentStatusInfos().then(data => {
        res.send({
            code: 200,
            message: '',
            data: data
        });
    }).catch(err => {
        res.send({
            code: 500,
            message: err.stack,
            data: ''
        });
    });
});
module.exports = router;