class Cuisines{
  cuisine_types(){ // this is used in cuisine type dropdown filter
    const cuisine_type_list=[

        // Fast Food and Snacks
        { name:"Momos", checked: false },
        { name:"Noodles", checked: false },
        { name:"Pizzas", checked: false },
        { name:"Pastas", checked: false },
        { name:"Burgers", checked: false },
        { name:"Snacks", checked: false },
        { name:"Chaat", checked: false },
        { name:"Street Food", checked: false },

        // Foreign Famous Cuisines:
        { name:"Cheese", checked: false },
        { name:"Nachos", checked: false },
        { name:"Shwarma", checked: false },

        // Regular Categories:
        { name:"Paneer", checked: false },
        { name:"Egg", checked: false },
        { name:"Chicken", checked: false },
        { name:"Non-Veg", checked: false },
        { name:"Biryani", checked: false },
        { name:"Rice", checked: false },

        // Sweet Dishes
        { name:"Cakes", checked: false },
        { name:"Deserts", checked: false },
        { name:"Ice Creams", checked: false },

        // Beverages and Drinks
        { name:"Shakes", checked: false },
        { name:"Juices", checked: false },
        { name:"Cold Drinks", checked: false },
        { name:"Beverages", checked: false },
      ]
      return cuisine_type_list;
  }
  cuisine_category(){ // this is used in cuisine category dropdown filter
    const dietaryOptions = ["Veg", "Non-Veg", "Egg"];
    return dietaryOptions;
  }
}

export default Cuisines;