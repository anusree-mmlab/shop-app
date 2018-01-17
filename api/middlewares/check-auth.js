const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            next();

        } catch(error) {
            return res.status(500).json({
                error: {
                    message: 'Auth Failed ****',
                    error: error
                }
            });
    
            next();
        }
        
    } else {
        return res.status(500).json({
            error: {
                message: 'Auth Failed ---'
            }
        });

        next();
    }
}