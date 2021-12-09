import jwt from "jsonwebtoken";

const generateToken = (payload: Object) => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: "30d",
    });
  }
};

export default generateToken;
