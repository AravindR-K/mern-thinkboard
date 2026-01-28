import crypto from "crypto";

// Generate key pair 
export const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// Sign data
export function signData(data) {
  const sign = crypto.createSign("SHA256");
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, "hex");
}

// Verify signature
export function verifySignature(data, signature) {
  const verify = crypto.createVerify("SHA256");
  verify.update(data);
  verify.end();
  return verify.verify(publicKey, signature, "hex");
}
