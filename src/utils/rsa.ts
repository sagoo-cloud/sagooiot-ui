import jsrsasign from 'jsrsasign'

const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY

// 初始化RSA密钥对象
const publicKey = jsrsasign.KEYUTIL.getKey(PUBLIC_KEY);

console.log(publicKey)


export function encrypt(str: string) {
  const encrypted = jsrsasign.KJUR.crypto.Cipher.encrypt(str, publicKey, 'RSAOAEP256');
  const resStr = jsrsasign.hextob64(encrypted)
  return resStr
}