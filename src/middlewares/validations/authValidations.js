import { checkSchema } from 'express-validator';

const signUpSchema = checkSchema({
  firstName: {
    in: 'body',
    customSanitizer: {
      options: (firstName) => (typeof firstName === 'string' ? firstName.trim() : 1)
    },
    isEmpty: {
      negated: true,
      errorMessage: 'firstName cannot be empty'
    },
    isString: {
      errorMessage: 'firstName has to be a string'
    },
    isLength: {
      options: {
        min: 2
      },
      errorMessage: 'firstName is too short'
    }
  },
  lastName: {
    in: 'body',
    customSanitizer: {
      options: (lastName) => (typeof lastName === 'string' ? lastName.trim() : 1)
    },
    isEmpty: {
      negated: true,
      errorMessage: 'lastName cannot be empty'
    },
    isString: {
      errorMessage: 'lastName has to be a string'
    },
    isLength: {
      options: {
        min: 2
      },
      errorMessage: 'lastName is too short'
    }
  },
  
  email: {
    in: 'body',
    customSanitizer: {
      options: (email) => (typeof email === 'string' ? email.trim() : 1)
    },
    isString: {
      errorMessage: 'Email has to be a string'
    },
    isEmail: {
      errorMessage: 'Please provide a valid email'
    }
  },
  password: {
    in: 'body',
    isEmpty: {
      negated: true,
      errorMessage: 'Password cannot be empty'
    },
    matches: {
      options: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{6,}$/i,
      errorMessage:
        'Password should not be empty, minimum six characters, at least one letter, one number and one special character'
    }
  },
  confirmPassword: {
    in: 'body',
    isEmpty: {
      negated: true,
      errorMessage: 'Password cannot be empty'
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        } else {
          return value;
        }
      }
    }
  }
});

const logInSchema = checkSchema({
  user: {
    in: 'body',
    customSanitizer: {
      options: (user) => (typeof user === 'string' ? user.trim() : 1)
    },
    isString: {
      errorMessage: ' Email has to be a string'
    },
    isEmpty: {
      negated: true,
      errorMessage: ' Email field cannot be empty'
    },
    isLength: {
      options: {
        min: 2
      },
      errorMessage: ' Email is too short'
    }
  },
  password: {
    in: 'body',
    isEmpty: {
      negated: true,
      errorMessage: 'Password cannot be empty'
    },
    isLength: {
      options: {
        min: 6
      },
      errorMessage: 'Password cannot be less than 6 Characters'
    }
  }
});

export { signUpSchema, logInSchema };
