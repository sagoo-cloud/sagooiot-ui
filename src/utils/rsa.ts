// const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArrIR79D/y2qCJi6CeyPA
Ss9nhRhvVQa1BbcFf5REirsZIYM0S3WDj0kUxM1h7+r104a712fu4QGlKF1eCLyB
ulYt+glXEIHIBmiWeKrUwT9dWyOOkWQpFX7kLzuZ9T8uEar+ggt2sUWEWHEZfoxP
+hw9C5PXDK5I18oTw6voMV7f/qKDrY1/cZyjngnTd48Mrqi3IkP9LxryjP6tp7hW
oSuFxvNg+qCveUlJbyPnm4u/BuJYGN/lRf6TvgTbwnnVsqt2pEMf6Vh2Wn4rAhQS
ZiNDn/I1qAb5Q0iTvUMJ6MMGJ9HgLIxC/9nj5APbkIc49pHyjXRdhjcbWj0fp3eu
SQIDAQAB
-----END PUBLIC KEY-----`

async function getPublicKey() {
  const publicKeyBuffer = pemToBuffer(PUBLIC_KEY);
  window.crypto.subtle.importKey(
    "spki", // 这边如果私钥则是pkcs8
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: 'SHA-256' },
    },
    true,
    ["encrypt"] // 用于加密所以是公钥，私钥就是decrypt
  ).then((e) => { console.log(e) })
    .catch((e) => { console.log(e) });
  // console.log(publicKey)
}

getPublicKey()

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

export function encrypt(str: string) {
  return str
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
  let text = "-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----\n" // 这里-----BEGIN和-----是固定的
  text += base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n") // 中间base64编码
  text += "\n-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----" // 这里-----END和-----是固定的
  return text
}

//#endregion