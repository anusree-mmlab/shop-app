const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = __dirname+'/question-answer.json';


const readFile = (callback) => {
    fs.readFile(filePath,'utf8',(err, data) => {
        if(!err){
            callback(data);
        } else {
            callback(null);
        }
    });
}

router.get('/fileread',(req, res, next) => {
    readFile((data) => {
        if(data !== null) {
            res.status(200).json({
                status : 'success',
                data: data
            });
        } else {
            res.status(200).json({
                status : 'failed',
                data: data
            });
        }
    })
});

router.post('/fileappend',(req, res, next) => {
    console.log('File', req.body);
    
    //const filePath = '/home/anusree/TESTS-ANUSREE/TUTS/ANGULAR/test-app/src/app/components/questions/question-answer.json'
    readFile((data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);
            //jsonObj.push({"data":"test"});
            jsonObj.push(req.body);

            //console.log(jsonObj);

            fs.writeFile(filePath,JSON.stringify(jsonObj), (err) => {
                if(err) {
                    console.log(err);
                    return res.status(402).json({
                        status: "failed"
                    });
                } else {
                    return res.status(200).json({
                        status: "success"
                    });
                }
            });
        } else {
            return res.status(200).json({
                status: "failed the append"
            });
        }
    });
});

router.post('/fileupdate',(req, res, next) => {

    readFile((data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);

            const editObj = req.body.item;
            const index = req.body.index;

            jsonObj[index] = editObj;

            //console.log(jsonObj);

             fs.writeFile(filePath,JSON.stringify(jsonObj), (err) => {
                if(err) {
                    console.log(err);
                    return res.status(402).json({
                        status: "failed"
                    });
                } else {
                    return res.status(200).json({
                        status: "success"
                    });
                }
            });

        } else {
            res.status(200).json({
                status : 'failed'
            });
        }
    });

});

module.exports = router;