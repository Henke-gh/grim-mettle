import { monsterCatalog } from "~~/server/utils/monsterCatalog";

export default defineEventHandler(async () => {
  return { monsters: monsterCatalog };
});
