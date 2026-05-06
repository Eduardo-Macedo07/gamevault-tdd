import { Op } from 'sequelize'; 
export const register = async (data, UserModel) => { 
  const { username, email, password, confirmPassword, fullName = null } = data; 
  if (password !== confirmPassword) throw new Error('As senhas nao coincidem.'); 
  if (password.length < 8) throw new Error('A senha deve ter no minimo 8 caracteres.'); 
  const existingUser = await UserModel.findOne({ where: { [Op.or]: [{ username }, { email }] } }); 
  if (existingUser) throw new Error('Este e-mail ou usuario ja esta cadastrado.'); 
  return { message: 'Usuario criado com sucesso!' }; 
}; 
