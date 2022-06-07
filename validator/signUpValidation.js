const { body, validationResult } = require('express-validator')

exports.signInValidation = () => {
  return [
    body('username', 'Username is required').notEmpty(),
    body('password', 'Password is required').notEmpty(),
  ]
}
exports.signUpValidation = () => {
  return [
    body('email', 'Email is required !').isEmail().notEmpty(),
    body('password', 'Password is required !').notEmpty(),
    body('email').custom(value => {
      return User.findOne({where:{email:value}}).then(user => {
        if (user) {
          return Promise.reject('Email already Taken Try other Email');
        } 
      });

  })

    
    
]
}