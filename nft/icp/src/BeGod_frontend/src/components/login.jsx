import React from "react";
import { useDispatch } from "react-redux";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from 'ic-auth';
import { useNavigate } from "react-router-dom";
import {  setUserAndStore } from '../redux/authSlice';

const Login = () => {
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const canisterID = "avqkn-guaaa-aaaaa-qaaea-cai";
  const whitelist = [canisterID];

  const handleLogin = async (provider) => {
    let userObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A",
    };

    try {
      if (provider === "Plug") {
        userObject = await PlugLogin(whitelist);
      } else if (provider === "Stoic") {
        userObject = await StoicLogin();
      } else if (provider === "NFID") {
        userObject = await NFIDLogin();
      } else if (provider === "Identity") {
        userObject = await IdentityLogin();
      }
      if (userObject.agent._isAgent || userObject.agent.agent._isAgent ) {
        console.log("user details",userObject.principal)
        dispatch(setUserAndStore(userObject.principal));
        navigate('/admin');
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="myLoginMenu flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <button onClick={() => handleLogin("Plug")} className="w-full py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
          Plug
        </button>
        <button onClick={() => handleLogin("Stoic")} className="w-full py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300">
          Stoic
        </button>
        <button onClick={() => handleLogin("NFID")} className="w-full py-2 mb-4 text-white bg-purple-500 rounded hover:bg-purple-600 transition duration-300">
          NFID
        </button>
        <button onClick={() => handleLogin("Identity")} className="w-full py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 transition duration-300">
          Identity
        </button>
      </div>
    </div>

  );
};

export default Login;
