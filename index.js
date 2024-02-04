import { escapeHtml } from './escape.js';
import template from './template.html';
import ShoppingListModel from './shoppingListModel.js';

export default {
  async fetch(request, env) {
    const defaultData = { items: [] };

    const setCache = (key, data) => env.EXAMPLE_SHOPPING_LIST.put(key, data);
    const getCache = key => env.EXAMPLE_SHOPPING_LIST.get(key);

    async function getItems(request) {
      const ip = request.headers.get('CF-Connecting-IP');
      const cacheKey = `data-${ip}`;
      let data;
      const cache = await getCache(cacheKey);
      if (!cache) {
        await setCache(cacheKey, JSON.stringify(defaultData));
        data = defaultData;
      } else {
        data = JSON.parse(cache);
      }

      const body = template.replace(
        '$ITEMS',
        JSON.stringify(
          data.items?.map(item => ({
            id: escapeHtml(item.id),
            name: escapeHtml(item.name),
            purchased: !!item.purchased
          })) ?? []
        )
      );
      return new Response(body, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    async function updateItems(request) {
      const body = await request.text();
      const ip = request.headers.get('CF-Connecting-IP');
      const cacheKey = `data-${ip}`;
      try {
        JSON.parse(body);
        await setCache(cacheKey, body);
        return new Response(body, { status: 200 });
      } catch (err) {
        return new Response(err, { status: 500 });
      }
    }

    if (request.method === 'PUT') {
      return updateItems(request);
    }
    return getItems(request);
  }
};
