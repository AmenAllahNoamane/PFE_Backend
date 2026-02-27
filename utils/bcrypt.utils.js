const bcrypt =require('bcrypt')


class BcryptUtils {
  // Hasher un mot de passe
  async hash(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Comparer un mot de passe avec son hash
  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new BcryptUtils();