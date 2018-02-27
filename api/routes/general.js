const express = require('express');
const _ = require('lodash');
const router = express.Router();
const fs = require('fs');
const angularFilePath = __dirname+'/files/angular-question-answer.json';
const reactFilePath = __dirname+'/files/react-question-answer.json';
const nodeFilePath = __dirname+'/files/node-question-answer.json';
const purejsFilePath = __dirname+'/files/js-question-answer.json';

const addIdToNode = (data) => {
    const jsonObj = JSON.parse(data);
    
    const modifiedRes = jsonObj.map((obj, i) => {
       const newObj = obj;
       newObj.id = i+1;

       return newObj;
    });

    console.log('modifiedRes', modifiedRes);
    fs.writeFile(angularFilePath,JSON.stringify(modifiedRes), (err) => {
        if(err) {
            console.log(err);
           
        } else {
           console.log("id added");
        }
    });
}


router.get('/video',(req, res, next) => {
    
            const path =  __dirname+'/files/SampleVideo.mp4'
            const stat = fs.statSync(path)
            const fileSize = stat.size
            //const range = req.headers.range ? req.headers.range: "bytes=0-10000";
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
            } else {console.log('Else part');
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

            //Add id to each object
            //addIdToNode(data);

            res.status(200).json({
                status : 'success',
                subject: "angular",
                data: data
            });
        } else {
            res.status(200).json({
                status : 'failed',
                subject: "angular",
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
            const id = req.body.index;

            //get the index from id
            const index = _.findIndex(jsonObj, {id:id})
console.log(index, editObj);
            if(index !== -1) {
                jsonObj[index] = editObj;
            
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
            }
            else {
                res.status(200).json({
                    status : 'failed',
                    message: "index is -1"
                });
            }

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
                subject: "react",
                data: data
            });
        } else {
            res.status(200).json({
                status : 'failed',
                subject: "react",
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
            const id = req.body.index;

            //get the index from id
            const index = _.findIndex(jsonObj, {id:id})
console.log(index, editObj);
            if(index !== -1) {
                jsonObj[index] = editObj;
            
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
            }
            else {
                res.status(200).json({
                    status : 'failed',
                    message: "index is -1"
                });
            }

        } else {
            res.status(200).json({
                status : 'failed'
            });
        }
    });
});

router.get('/node/fileread',(req, res, next) => {
    
        readFile(nodeFilePath,(data) => {
            if(data !== null) {    
                res.status(200).json({
                    status : 'success',
                    subject: "node",
                    data: data
                });
            } else {
                res.status(200).json({
                    status : 'failed',
                    subject: "node",
                    data: data
                });
            }
        })
});

router.post('/node/fileappend',(req, res, next) => {
    console.log('File', req.body);

    readFile(nodeFilePath,(data) => {
        if(data !== null) {
            const jsonObj = JSON.parse(data);
            //jsonObj.push({"data":"test"});
            jsonObj.push(req.body);

            //console.log(jsonObj);

            fs.writeFile(nodeFilePath,JSON.stringify(jsonObj), (err) => {
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

router.post('/node/fileupdate',(req, res, next) => {
    
        readFile(nodeFilePath,(data) => {
            if(data !== null) {
                const jsonObj = JSON.parse(data);
    
                const editObj = req.body.item;
                const id = req.body.index;
    
                //get the index from id
                const index = _.findIndex(jsonObj, {id:id})
    console.log(index, editObj);
                if(index !== -1) {
                    jsonObj[index] = editObj;
                
                    fs.writeFile(nodeFilePath,JSON.stringify(jsonObj), (err) => {
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
                }
                else {
                    res.status(200).json({
                        status : 'failed',
                        message: "index is -1"
                    });
                }
    
            } else {
                res.status(200).json({
                    status : 'failed'
                });
            }
        });
    
});

router.get('/purejs/fileread',(req, res, next) => {
    
        readFile(purejsFilePath,(data) => {
            if(data !== null) {
    
                //Add id to each object
                //addIdToNode(data);
    
                res.status(200).json({
                    status : 'success',
                    subject: "angular",
                    data: data
                });
            } else {
                res.status(200).json({
                    status : 'failed',
                    subject: "angular",
                    data: data
                });
            }
        })
    });
    
    router.post('/purejs/fileappend',(req, res, next) => {
        console.log('File', req.body);
        
        //const angularFilePath = '/home/anusree/TESTS-ANUSREE/TUTS/ANGULAR/test-app/src/app/components/questions/question-answer.json'
        readFile(purejsFilePath,(data) => {
            if(data !== null) {
                const jsonObj = JSON.parse(data);
                //jsonObj.push({"data":"test"});
                jsonObj.push(req.body);
    
                //console.log(jsonObj);
    
                fs.writeFile(purejsFilePath,JSON.stringify(jsonObj), (err) => {
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
    
    router.post('/purejs/fileupdate',(req, res, next) => {
    
        readFile(purejsFilePath,(data) => {
            if(data !== null) {
                const jsonObj = JSON.parse(data);
    
                const editObj = req.body.item;
                const id = req.body.index;
    
                //get the index from id
                const index = _.findIndex(jsonObj, {id:id})
    console.log(index, editObj);
                if(index !== -1) {
                    jsonObj[index] = editObj;
                
                    fs.writeFile(purejsFilePath,JSON.stringify(jsonObj), (err) => {
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
                }
                else {
                    res.status(200).json({
                        status : 'failed',
                        message: "index is -1"
                    });
                }
    
            } else {
                res.status(200).json({
                    status : 'failed'
                });
            }
        });
    
    });

module.exports = router;