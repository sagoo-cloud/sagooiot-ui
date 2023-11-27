import jsrsasign from 'jsrsasign'

// 初始化RSA密钥对象
const publicKey = jsrsasign.KEYUTIL.getKey(import.meta.env.VITE_PUBLIC_KEY);

export function encrypt(str: string) {
  const encrypted = jsrsasign.KJUR.crypto.Cipher.encrypt(str, publicKey, 'RSAOAEP256');
  return jsrsasign.hextob64(encrypted)
}