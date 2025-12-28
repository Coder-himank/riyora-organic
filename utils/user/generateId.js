export function generateUserId() {
  const prefix = "USR";
  const totalLength = Math.floor(Math.random() * 3) + 6; // 6–8
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";

  for (let i = 0; i < totalLength - prefix.length; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + suffix;
}

export function generateOrderId() {
  const prefix = "ORD";
  const totalLength = Math.floor(Math.random() * 3) + 6; // 6–8
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";

  for (let i = 0; i < totalLength - prefix.length; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + suffix;
}
