const calculatePrice = (items) => {
  let total = items.length;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].amount;
  }
  return total * 100;
};

export { calculatePrice };
