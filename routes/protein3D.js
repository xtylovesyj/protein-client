var express = require('express');
var router = express.Router();
const fs = require('fs');
const config = require('../config/config.base');
router.get('/readFile/:folderName', function(req, res, next) {
    // 异步读取
    const pdbNames = config.pdbs;
    const pdbData = [];
    pdbNames.forEach(value => {
        fs.readFile(`${config.protein_base_path}/${req.params.folderName}/outputFolder/${value}`, function(err, data) {
            if (err) {
                pdbData.push({
                    name: value,
                    data: '',
                    message: err.stack
                });
                console.error(err);
            } else {
                pdbData.push({
                    name: value,
                    data: data.toString()
                });
            }
            if (pdbData.length === 5) {
                res.send({
                    code: 200,
                    message: '',
                    data: pdbData
                });
            }
        });
    });
});

module.exports = router;