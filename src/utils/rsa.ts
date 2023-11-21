import JSEncrypt from 'jsencrypt'

export function encrypt(value: string) {
  const crypt = new JSEncrypt();
  crypt.setPublicKey(import.meta.env.VITE_PUBLIC_KEY);
  return crypt.encrypt(value)
}

export function decrypt(value: string) {
  const crypt = new JSEncrypt();
  crypt.setPrivateKey(import.meta.env.VITE_PRIVATE_KEY);
  return crypt.decrypt(value)
}

// console.log(decrypt('GyFOsw70nGTQD/tnI5o2pOnJxQKH2MEsG8jL2ZxFP+nLkEpB8puahImT7cs2yjGK8dc78WPKev2N2zwypbVDG3A/31GctX38tYF2ivBO4c+XZyGuYwQSLEidDv3XqV3MrXwNLksYeIKKEwPBHD52nrWwZKvyK0LeLeaBCrRQmLV7kfhLh6bGKhe9n5Yjiwu+1GsgWpUa4ht4WwFf5og+tNCaI99IQoxpNdhHA2UtrtbgVcNZ8o2/d5aSE7g9ScvGaH0rMNfLc25UezltxTzEMSWv/8DGg7yL844U97qXwRWBGS5oi0Da9UtvGMegEjBLqBGSztGBB/LeQDzu9KyAQQ=='))