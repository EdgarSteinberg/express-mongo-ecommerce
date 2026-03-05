class UserDTO {
  constructor({ _id, first_name, last_name, age, email, role, cart, last_connection }) {
    this._id = _id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.age = age;
    this.email = email;
    this.role = role;
    this.cart = cart;
    this.last_connection = last_connection;
  }
}

export default UserDTO;

/* const createUserDTO = (user) => ({
  _id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  age: user.age,
  email: user.email,
  role: user.role,
  cart: user.cart
}); */