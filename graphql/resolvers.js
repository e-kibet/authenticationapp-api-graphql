require('dotenv').config()
const models = require('../models/index')
const jwt = require('jsonwebtoken');

const Query = {
	getUserDetails: async () => {
		try {
			const users = await models.users.findAll();
			return users;
		}catch(err){
			console.log(err);
		}
	},
	getUser: async (root, { id }) => {
    	try {
      		const user = await models.users.findByPk(id)
      		return user;
    	} catch (err) {
      		console.log(err);
    	}
  	},

    loginUser: async (_ ,{username, password}) => {
      let user = await models.users.findOne({where: {username: username}})
      if(user){
        if(!await user.validPassword(password)){
          return {status: false, status_code: 400, status_message: "invalid password entered is invalid", token: null}
        }else{
          let payload = {username: user.username, email: user.email, phone: user.phone}
          var token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME});
          return {status: false, status_code: 400, status_message: "Login success", token: token}
        }
      }else{
        return {status: false, status_code: 400, status_message: "Username entered is invalid", token: null}
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
			})																							
			return "Author created."
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
			return "Author Updated";
		}catch (err) {
			console.error(err);
  		}	
	},

	deleteUser: async(_ , { AuthorID }) => {
		await models.users.destroy({ where: { id: AuthorID }})
		return "Author Deleted";
	}
}


module.exports = { Query , Mutation }