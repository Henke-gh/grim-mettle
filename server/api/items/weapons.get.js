import { weapons } from "~~/server/utils/itemCatalog";

const weaponPayload = weapons;

export default defineEventHandler(async () => {
  return { weapons: weaponPayload };
});
