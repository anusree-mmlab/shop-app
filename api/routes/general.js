const express = require('express');
const _ = require('lodash');
const router = express.Router();
const fs = require('fs');
const angularFilePath = __dirname+'/angular-question-answer.json';
const reactFilePath = __dirname+'/react-question-answer.json';



router.get('/video',(req, res, next) => {
    
            const path =  __dirname+'/SampleVideo.mp4'
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = req.headers.range
            if (range) {
              const parts = range.replace(/bytes=/, "").split("-")
              const start = parseInt(parts[0], 10)
              const end = parts[1] 
                ? parseInt(parts[1], 10)
                : fileSize-1
              const chunksize = (end-start)+1
              const file = fs.createReadStream(path, {start, end})
              const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
              }
              res.writeHead(206, head);
              file.pipe(res);
            } else {
              const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
              }
              res.writeHead(200, head)
              fs.createReadStream(path).pipe(res)
            }
           /*  res.status(200).json({
                status : 'success',
                data: data
            }); */
        });    

const readFile = (filePath,callback) => {
    fs.readFile(filePath,'utf8',(err, data) => {
        if(!err){
            callback(data);
        } else {
            callback(null);
        }
    });
}

router.get('/angular/fileread',(req, res, next) => {
    readFile(angularFilePath,(data) => {
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

router.post('/angular/fileappend',(req, res, next) => {
    console.log('File', req.body);
    
    //const angularFilePath = '/home/anusree/TESTS-ANUSREE/TUTS/ANGULAR/test-app/src/app/components/questions/question-answer.json'
    readFile(angularFilePath,(data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);
            //jsonObj.push({"data":"test"});
            jsonObj.push(req.body);

            //console.log(jsonObj);

            fs.writeFile(angularFilePath,JSON.stringify(jsonObj), (err) => {
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

router.post('/angular/fileupdate',(req, res, next) => {

    readFile(angularFilePath,(data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);

            const editObj = req.body.item;
            const index = req.body.index;

            jsonObj[index] = editObj;

            //console.log(jsonObj);

             fs.writeFile(angularFilePath,JSON.stringify(jsonObj), (err) => {
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

router.get('/react/fileread',(req, res, next) => {
    readFile(reactFilePath,(data) => {
        console.log('data..',data)
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

router.post('/react/fileappend',(req, res, next) => {
    console.log('File', req.body);

    readFile(reactFilePath,(data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);
            //jsonObj.push({"data":"test"});
            jsonObj.push(req.body);

            //console.log(jsonObj);

            fs.writeFile(reactFilePath,JSON.stringify(jsonObj), (err) => {
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

router.post('/react/fileupdate',(req, res, next) => {
    
        readFile(reactFilePath,(data) => {
            if(data !== null) {
                const jsonObj = JSON.parse(data);
    
                const editObj = req.body.item;
                const id = req.body.id;
                const index = _.filter(jsonObj,{id:id});

                if(index === -1) {
                    res.status(200).json({
                        status : 'failed',
                        message : "No data found"
                    });
                }
    
                jsonObj[index] = editObj;
    
                //console.log(jsonObj);
    
                 fs.writeFile(reactFilePath,JSON.stringify(jsonObj), (err) => {
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