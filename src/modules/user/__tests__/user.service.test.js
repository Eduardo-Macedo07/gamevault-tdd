import { describe, it, expect, beforeEach } from 'vitest'; 
import * as userService from '../user.service.js'; 
 
describe('User Service', () => { 
  let mockUserModel; 
  beforeEach(() => { 
    mockUserModel = { findOne: vi.fn(), create: vi.fn() }; 
  }); 
  it('deve erro se senhas diferentes', async () => { 
    const data = { username: 'u', email: 'e@e.com', password: '12345678', confirmPassword: '87654321' }; 
    await expect(userService.register(data, mockUserModel)).rejects.toThrow('As senhas nao coincidem.'); 
  }); 
  it('deve erro se usuario existe', async () => { 
    const data = { username: 'u', email: 'e@e.com', password: '12345678', confirmPassword: '12345678' }; 
    mockUserModel.findOne.mockResolvedValueOnce({ id: 1 }); 
    await expect(userService.register(data, mockUserModel)).rejects.toThrow('Este e-mail ou usuario ja esta cadastrado.'); 
  }); 
}); 
