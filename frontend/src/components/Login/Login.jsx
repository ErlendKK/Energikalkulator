// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { setUser } from '../../features/userSlice';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     // Simulerer en API-kall og respons
//     const userData = {
//       id: 1,
//       name: 'John Doe',
//       email: email,
//       password: password,
//       settings: {},
//       contacts: [],
//       projects: [],
//     };

//     // Send handling for å oppdatere brukerinformasjonen i Redux store
//     dispatch(setUser(userData));

//     // Naviger til inputs siden
//     navigate('/inputs');
//   };

//   return (
//     <div className="container ">
//       <h2>Login</h2>
//       <div className="mb-3">
//         <label htmlFor="email" className="form-label">
//           Email
//         </label>
//         <input
//           type="email"
//           className="form-control"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//       </div>
//       <div className="mb-3">
//         <label htmlFor="password" className="form-label">
//           Password
//         </label>
//         <input
//           type="password"
//           className="form-control"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//       </div>
//       <button className="btn btn-primary" onClick={handleLogin}>
//         Login
//       </button>
//     </div>
//   );
// };

// export default Login;
