export function base64encode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64").replace(/[=]/g, "");
  }

  throw new Error(`Can not find Buffer`);
}

export function uniqueID(): string {
  const chars = "0123456789abcdef";

  const randomID = "xxxxxxxxxx".replace(/./g, () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  });

  const timeID = base64encode(
    new Date().toISOString().slice(11, 19).replace("T", ".")
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  return `uid_${randomID}_${timeID}`;
}
