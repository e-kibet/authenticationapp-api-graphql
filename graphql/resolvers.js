require('dotenv').config()
const models = require('../models/index')
const jwt = require('jsonwebtoken');
const { sqlException} = require('../helpers/util.helper')

const Query = {
	getUserDetails: async () => {
		try {
			const users = await models.users.findAll();
			return users;
		}catch(err){
			console.log(err);
		}
	},
	getUser: async (parent, args, context, info) => {
    	try {
      		const user = await models.users.findByPk(args.id)
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
          let payload = {username: user.username, email: user.email, phone: user.phone}
          var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME});
          await models.users.update({login_status: "1"}, {where: {username: user.username}})
          return {status: true, status_code: 200, status_message: "Login success", token: token}
        }
      }else{
        return {status: false, status_code: 400, status_message: "Username entered is invalid", token: null}
      }
    },

    logout: async (parent, args, context, info) => {
      let user = await models.users.findOne({where: {id: args.id}})
      if(user){
        await models.users.update({login_status: "0"}, {where: {id: args.id}})
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
	}
}


module.exports = { Query , Mutation }