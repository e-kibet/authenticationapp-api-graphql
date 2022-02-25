require('dotenv').config()
const jwt = require("jsonwebtoken")

const getPayload = token => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return { loggedIn: true, payload };
    } catch (err) {
        return { loggedIn: false }
    }
}

const sqlException = (exception) => {
    let error = "Something went wrong try again"
    if(exception.name === 'SequelizeUniqueConstraintError'){
        error = "Request failed. Record already exists"
    }else if(exception.name === 'SequelizeConnectionError'){
        error = "Failed, Unable to create connection to the database"
    }else if(exception.name === 'SequelizeAccessDeniedError'){
        error = "Failed, access denied when connecting to the database."
    }
    return error
}

module.exports = {
    getPayload, sqlException
}