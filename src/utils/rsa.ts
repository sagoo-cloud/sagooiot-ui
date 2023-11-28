import jsrsasign from 'jsrsasign'

// 初始化RSA密钥对象
const publicKey = jsrsasign.KEYUTIL.getKey(import.meta.env.VITE_PUBLIC_KEY);

// 加密 
export function encrypt(str: string) {
  return jsrsasign.hextob64(publicKey.encryptOAEP(str, 'sha-256'))
}