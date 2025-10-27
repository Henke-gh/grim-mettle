import { viewMonsterCollection } from "~~/server/utils/monsterCatalog";

export default defineEventHandler(async () => {
  return viewMonsterCollection;
});
