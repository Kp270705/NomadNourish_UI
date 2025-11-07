class Cuisines{
  cuisine_types(){
    const cuisine_type_list=[
        { name:"Momos", checked: false },
        { name:"Noodles", checked: false },
        { name:"Pizzas", checked: false },
        { name:"Snacks", checked: false },
        { name:"Street Food", checked: false },
        { name:"Chaat", checked: false },
        { name:"Shwarma", checked: false },
        { name:"Nachos", checked: false },
        { name:"Cheese", checked: false },
        { name:"Paneer", checked: false },
        { name:"Egg", checked: false },
        { name:"Chicken", checked: false },
        { name:"Non-Veg", checked: false },
        { name:"Biryani", checked: false },
        { name:"Desert", checked: false },
        { name:"Cakes", checked: false },
        { name:"Shakes", checked: false },
      ]
      return cuisine_type_list;
  }
  cuisine_category(){
    const dietaryOptions = ["Veg", "Non-Veg", "Egg"];
    return dietaryOptions;
  }
}

export default Cuisines;