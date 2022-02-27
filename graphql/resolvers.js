require('dotenv').config()
const models = require('../models/index')
const jwt = require('jsonwebtoken');
const { sqlException} = require('../helpers/util.helper')
const { decodedToken, destroyToken } = require("../helpers/jwt.helper")
const Minio = require('minio')
const {
	join,
	parse
} = require('path')

var minioClient = new Minio.Client({endPoint: 'play.min.io', port: 9000, useSSL: true, accessKey: process.env.MINIO_ACCESS_KEY, secretKey: process.env.MINIO_SECRET_KEY});
 
const Query = {
	getUserDetails: async (parent, args, context, info) => {
		const decoded = decodedToken(context.req, false);
		console.log(decoded)
		try {
			const users = await models.users.findAll();
			return users;
		}catch(err){
			console.log(err);
		}
	},
	getUser: async (parent, args, context, info) => {
		const decoded = decodedToken(context.req, true);
		console.info(decoded)
    	try {
      		const user = await models.users.findByPk(decoded.id)
      		return user;
    	} catch (err) {
      		console.log(err);
      }
  	},

    loginUser: async (parent ,args, context, info) => {
      let user = await models.users.findOne({where: {username: args.username}})
      if(user){
        if(!await user.validPassword(args.password)){
          return {status: false, status_code: 400, status_message: "invalid password entered is invalid", token: null}
        }else{
          let payload = {id: user.id, username: user.username, email: user.email, phone: user.phone}
          var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME});
          await models.users.update({login_status: "1"}, {where: {username: user.username}})
          return {status: true, status_code: 200, status_message: "Login success", token: token}
        }
      }else{
        return {status: false, status_code: 400, status_message: "Username entered is invalid", token: null}
      }
    },

    logout: async (parent, args, context, info) => {
		const decoded = decodedToken(context.req, false);
		console.log(decoded)
		let user = await models.users.findOne({where: {id: decoded.id}})
		if(user){
			await models.users.update({login_status: "0"}, {where: {id: decoded.id}})
			/**
			 * GET how to have the token expired when logged out
			 */
       	 	return {status: true, status_code: 200, status_message: "logout success", token: null}
      	}else{
        	return {status: false, status_code: 400, status_message: "No records found for the user", token: null}
      	}
    	}
	}

const Mutation = {
	createUser: async (_ , {
		first_name,
		last_name,
		username,
		email,
		phone,
		bio,
		password,
		photo
	}) =>  {
		try {
			await models.users && models.users.create({
				first_name,
				last_name,
				username,
				email,
				phone,
				bio,
				password,
				photo			
			}).then(async () => {
        return  "User has been created successful"
      }, async err => {
        console.error(sqlException(err))
        return sqlException(err)
      })																						
		}catch(error){
			console.error(error);
		}
	},

	updateUser: async (_ , {
		first_name,
		last_name,
		username,
		email,
    phone,
    id
	}) => {
		try {
			await models.users && models.users.update({
				first_name,
				last_name,
				username,
				email,
				phone,
			} ,{ where: { id: id } });
			return "User has been Updated";
		}catch (err) {
			console.error(err);
  		}	
	},

	deleteUser: async(_ , { AuthorID }) => {
		await models.users.destroy({ where: { id: AuthorID }})
		return "User has been Deleted";
	},

	uploadNewFile: async (parent, args, context, info) => {
		let file = args.file

		let { createReadStream, fileName, mimetype, encoding } = await args.file;

		console.log(`file name: ${fileName}`)

		let stream = createReadStream()

		let {
			ext,
			name
		} =  parse(fileName)

		console.log(`file name: ${fileName}`)

		const metaData = {'Content-Type': mimetype};

		minioClient.putObject(process.env.MINIO_BUCKETNAME, fileName, stream, metaData, async (err, objInfo)  => {
			console.log("shouldn't this run?");
			if (err) {
				console.log(err);
			} else {
				console.log('File uploaded successfully.');
				console.log(objInfo);
			}
		});
	return "Success!"
}
}


module.exports = { Query , Mutation }