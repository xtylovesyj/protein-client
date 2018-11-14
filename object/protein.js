const fs = require('fs');
const config = require('../config/config.base');
const readLastLines = require('read-last-lines');
class Protein {
    constructor(name, startDate, finishDate) {
        this.name = name;
        this.path = config.protein_base_path;
        this.pds = config.pdbs;
        this.statusInfoName = config.status;
        this.startDate = startDate;
        this.finishDate = finishDate;
        this.lineFileName = config.statistics.line;
        this.scatterFileName = config.statistics.scatter;
        this.logName = config.logs;
    }

    getPath() {
        return this.path;
    }

    getLineData() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.path}/${this.name}/outputFolder/${this.lineFileName}`, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }
    getScatterData() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${this.path}/${this.name}/outputFolder/${this.scatterFileName}`, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }

    getCurrentStatus() {
        let status = null;
        try {
            status = fs.readFileSync(`${config.protein_base_path}/${this.name}/outputFolder/${this.statusInfoName}`);
            status = status.toString().split('\n');
            let currentIterations = +status[1];
            let totalIterations = +status[2] || status[2];
            if (currentIterations === 0 && totalIterations == 'unknow') {
                return 1;
            } else if (currentIterations < totalIterations && currentIterations > 0) {
                return 1; // 运行中
            } else if (currentIterations === totalIterations && currentIterations > 0) {
                return 3; //已完成
            } else {
                return 0; //文件异常
            }
        } catch (error) {
            // console.log(error);
            return 0;
        }

    }

    getCurrentStatusInfos() {
        return new Promise((resolve, reject) => {
            try {
                const path = `${config.protein_base_path}/${this.name}/outputFolder/${this.statusInfoName}`;
                let status = fs.readFileSync(path);
                status = status.toString().split('\n');
                let startTime = new Date(status[0]);
                let currentIterations = +status[1];
                let totalIterations = +status[2] ? +status[2] : 'unknow';
                let predictFinishTime = null;
                if (currentIterations === totalIterations) {
                    if (status[3]) {
                        predictFinishTime = new Date(status[3]);
                    } else {
                        const currentDate = new Date();
                        fs.appendFileSync(path, '\n' + currentDate);
                        predictFinishTime = currentDate;
                    }

                } else {
                    predictFinishTime = (new Date().getTime() - startTime.getTime()) * totalIterations / currentIterations + new Date().getTime();
                }
                let finishedPercent = 0;
                if (+totalIterations) {
                    finishedPercent = currentIterations / totalIterations * 100;
                }
                let sendData = {
                    name: this.name,
                    startTime: startTime,
                    predictFinishTime: new Date(predictFinishTime),
                    iterationNum: currentIterations,
                    totalIterations: totalIterations,
                    finishedPercent: finishedPercent,
                };
                resolve(sendData);
            } catch (error) {
                reject(error);
            }
        });
    }

    getLog(lineNumber) {
        return readLastLines.read(`${config.protein_base_path}/${this.name}/outputFolder/${this.logName}`, lineNumber)
            .then(lines => {
                return lines;
            });
    }
}
module.exports = Protein;