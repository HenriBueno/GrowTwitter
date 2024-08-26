import bcrypt from "bcrypt";

function generateHash(data: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(data, salt);
  return hash;
}

export default generateHash;
