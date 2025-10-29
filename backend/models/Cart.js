import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  image: {
    type: String,
  },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest',
  },
  items: [cartItemSchema],
}, {
  timestamps: true,
});

cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

cartSchema.statics.findOrCreateCart = async function(userId = 'guest') {
  let cart = await this.findOne({ userId });
  if (!cart) {
    cart = await this.create({ userId, items: [] });
  }
  return cart;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
