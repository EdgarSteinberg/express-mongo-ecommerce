import bcrypt from 'bcrypt';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const comparePassword = (user, password) => {
  if (!user) { // mensaje error
    console.log('❌ Usuario no encontrado');
    return false;
  }

  if (!user.password) { // mensaje error
    console.log('❌ El usuario no tiene password');
    return false;
  }

  return bcrypt.compareSync(password, user.password);
};
