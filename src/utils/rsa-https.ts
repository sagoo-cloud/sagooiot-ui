const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY

let publicKey: CryptoKey
let privateKey: CryptoKey

async function setPublicKey() {
  const publicKeyBuffer = pemToBuffer(PUBLIC_KEY);
  publicKey = await window.crypto.subtle.importKey(
    "spki", // 这边如果私钥则是pkcs8
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: 'SHA-256' },
    },
    true,
    ["encrypt"] // 用于加密所以是公钥，私钥就是 decrypt
  )
  // console.log(publicKey)
}

async function setPrivateKey() {
  const privateBuffer = pemToBuffer(PRIVATE_KEY);
  privateKey = await window.crypto.subtle.importKey(
    "pkcs8", // 这边如果私钥则是pkcs8
    privateBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: 'SHA-256' },
    },
    true,
    ["decrypt"] // 用于加密所以是公钥，私钥就是 decrypt
  )
  // console.log(privateKey)
}

setPublicKey()
// setPrivateKey()

export function encrypt(str: string) {
  const enc = new TextEncoder()
  const data = enc.encode(str) // 这边将要加密的字符串转为utf-8的Uint8Array
  return new Promise(async (resolve) => {
    const buffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey, // 生成或者导入的CryptoKey对象
      data
    )
    const resStr = window.btoa(String.fromCharCode(...new Uint8Array(buffer)))
    resolve(resStr)
  })
}

export function decrypt(base64String: string) {
  return new Promise(async (resolve) => {
    const buffer = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      base64ToUint8Array(base64String)
    )
    const resStr = new TextDecoder().decode(buffer);
    resolve(resStr)
  })
}

function pemToBuffer(pem: string) {
  const lines = pem.split('\n');
  const encoded = lines.slice(1, -1).join('');
  const decoded = window.atob(encoded);
  const buffer = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; ++i) {
    buffer[i] = decoded.charCodeAt(i);
  }
  return buffer.buffer
}

function base64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

//#region 生成公钥私钥

// generateKey()

function generateKey() {
  window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: {
        name: "SHA-256" // 这边如果后端使用公钥加密，要注意与前端一致
      },
    },
    true,
    ["encrypt", "decrypt"] // must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
  ).then(key => {
    getPemText('spki', key.publicKey)
    getPemText('pkcs8', key.privateKey)
  })
}


function getPemText(type: "pkcs8" | "spki", key: CryptoKey) {
  // 导出私钥
  window.crypto.subtle.exportKey(type, key).then(function (res) {
    const key = RSA2text(res, type) // 私钥pem
    console.log(key)
    console.log(key.length)
  }).catch(function (err) {
    console.error(err)
  })
}

// pem格式文本
function RSA2text(buffer: ArrayBuffer, type: "pkcs8" | "spki") {
  const isPrivate = type === 'pkcs8'
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = window.btoa(binary)
  console.log(base64)
  console.log('\n')
  let text = "-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----\n" // 这里-----BEGIN和-----是固定的
  text += base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n") // 中间base64编码
  text += "\n-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----" // 这里-----END和-----是固定的
  return text
}

//#endregion