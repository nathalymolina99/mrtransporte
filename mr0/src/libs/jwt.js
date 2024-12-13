import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export async function createAccessToken(payload) {
  if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET no está configurado");
  }

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, 
      TOKEN_SECRET,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      },
      (err, token) => {
        if (err) {
          console.error("Error al generar el token:", err.message);
          reject(err);
        }
        resolve(token);
      }
    );
  });
}

export async function verifyToken(token) {
  if (!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET no está configurado");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error al verificar el token:", err.message);
        reject(err);
      }
      console.log("Token decodificado:", decoded); 
      resolve(decoded);
    });
  });
}