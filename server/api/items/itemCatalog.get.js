import { itemCatalog } from "~~/utils/itemCatalog";

export default defineEventHandler(async () => {
  return { items: itemCatalog };
});
