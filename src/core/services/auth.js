class Auth {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
  }

  async login(email, password) {
    
    }
  
  async register(userData) {

  }
}

export default new Auth();