export default class ShoppingListModel {
    constructor() {
      this.items = [];
    }
  
    getItems() {
      return this.items;
    }
  
    addItem(name) {
      const newItem = {
        id: this.items.length + 1,
        name: name,
        purchased: false,
      };
      this.items.push(newItem);
      return newItem;
    }
  
    editItem(id, newName) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.name = newName;
      }
    }
  
    togglePurchased(id) {
      const item = this.items.find((item) => item.id === id);
      if (item) {
        item.purchased = !item.purchased;
      }
    }
  
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id);
    }
  }
  