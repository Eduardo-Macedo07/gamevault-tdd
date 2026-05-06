export const getHealth = () => ({ 
  status: 'OK', 
  message: 'GameVault esta saudavel e pronto para uso!', 
  timestamp: new Date().toISOString(), 
  version: '1.0.0' 
}); 
