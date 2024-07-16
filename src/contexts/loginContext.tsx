// // loginContext.tsx

// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext({
//   isAuthenticated: false,
//   login: (token) => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Verificar si hay un token en localStorage al cargar la aplicación
//     const token = localStorage.getItem('token');
//     if (token) {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (token) => {
//     setIsAuthenticated(true);
//     localStorage.setItem('token', token);
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
