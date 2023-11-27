import jsrsasign from 'jsrsasign'

// 初始化RSA密钥对象
const publicKey = jsrsasign.KEYUTIL.getKey(import.meta.env.VITE_PUBLIC_KEY);

// 从PEM格式的私钥创建RSA密钥对象
const rsaPrivateKey = new jsrsasign.RSAKey();
rsaPrivateKey.readPKCS8PrvKeyHex(jsrsasign.KEYUTIL.getHexFromPEM(import.meta.env.VITE_PRIVATE_KEY));

// 加密 
export function encrypt(str: string) {
  return jsrsasign.hextob64(publicKey.encryptOAEP(str, 'sha-256'))
}

// 解密
export function decrypt(encryptedBase64: string) {
  const encryptedHex = jsrsasign.b64tohex(encryptedBase64);
  return jsrsasign.hextob64(rsaPrivateKey.decryptOAEP(encryptedHex, 'sha-256'))
}