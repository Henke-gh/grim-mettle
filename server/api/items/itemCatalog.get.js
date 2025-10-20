import { itemCatalog } from "~~/server/utils/itemCatalog";

export default defineEventHandler(async () => {
  return { items: itemCatalog };
});
