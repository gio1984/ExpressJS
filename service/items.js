const { v4: uuidv4 } = require('uuid');


let items = [
  {
    id: "1",
    title: "First item",
    description: "Che bel item",
    category: "Home",
    location: "Oulu",
    images: ["firstImg", "secondImg"],
    price: 22.99,
    datePosting: "2021-02-22T18:25:43.511Z",
    deliveryType: "Shipping"
  }
];

module.exports = {
  insertItems: (title, description, category, location, images, price, datePosting, deliveryType) => {
    items.push({
      id: uuidv4(),
      title,
      description,
      category,
      location,
      images,
      price,
      datePosting,
      deliveryType
    });
  },
  getAllitems: () => items,
  getCategoryItems: (category) => items.filter(t => t.category == category),
  getLocationItems: (location) => items.filter(t => t.location == location),
  getDateItems: (date) => items.filter(t => t.datePosting == date),
  modifyItem: (id, title, description, category, location, images, price, datePosting, deliveryType) => {
    x = items.find(i => i.id == id)
    x.title = title
    x.description = description
    x.category = category
    x.location = location
    x.images = images
    x.price = price
    x.datePosting = datePosting
    x.deliveryType = deliveryType
  }
}