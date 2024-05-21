export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey("raw", passwordData, { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ]);

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // Ensure that exportedKey is an ArrayBuffer
  const exportedKey = (await crypto.subtle.exportKey("raw", derivedKey)) as ArrayBuffer;
  const hash = new Uint8Array(exportedKey);

  // Combine the salt and hash
  const combined = new Uint8Array(salt.length + hash.length);
  combined.set(salt);
  combined.set(hash, salt.length);

  // Encode as Base64 for storage
  return btoa(String.fromCharCode(...combined));
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(plainPassword);

  // Decode the Base64-encoded hashed password
  const combined = new Uint8Array(
    atob(hashedPassword)
      .split("")
      .map((char) => char.charCodeAt(0)),
  );
  const salt = combined.slice(0, 16);
  const hash = combined.slice(16);

  const keyMaterial = await crypto.subtle.importKey("raw", passwordData, { name: "PBKDF2" }, false, [
    "deriveBits",
    "deriveKey",
  ]);

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const exportedKey = (await crypto.subtle.exportKey("raw", derivedKey)) as ArrayBuffer;
  const newHash = new Uint8Array(exportedKey);

  // Compare the hashes
  if (hash.length !== newHash.length) return false;
  for (let i = 0; i < hash.length; i++) {
    if (hash[i] !== newHash[i]) return false;
  }
  return true;
}
