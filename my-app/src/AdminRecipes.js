export const adminRecipes = 
[
    {
      id: 'admin-burger-1',
      admin: true, // Marker so we always include this recipe
      name: 'American Burger Recipe Test',
      imageUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1299&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ingredients: [
        'Buns',
        'Burger Meat',
        'Lettuce',
        'Onions',
        'Tomato',
        'Pickles',
        'Cheese',
        'Mayonnaise'
      ],
      steps: [
        'Cook meat thoroughly (e.g., grill or pan-fry).',
        'Assemble on buns with lettuce, tomato, onions, pickles, cheese, mayo.'
      ],
      cuisineType: 'American', // For cuisine filtering
      foodType: 'Burgers',     // For food type filtering
      diet: 'omnivore'         // "omnivore" or "herbivore"
    },
    
    {
        id: 'admin-pasta-1',
        admin: true, // Marker so we always include this recipe
        name: 'Chicken Alfredo Pasta',
        imageUrl:
          'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ingredients: [
          'Chicken - 1 lbs',
          'Fettucino Pasta - 1 box',
          'Heavy Cream',
          'Butter',
          'Salt',
          'Pepper',
          'Parmesan cheese - 1 cup',
          'Pecorino Romano cheese - 1/2 cup'
        ],
        steps: [
          'Cook meat thoroughly (e.g., grill or pan-fry).',
          'Boil water and cook pasta as instructed on the box',
          'While those are cooking, shread and combine the 2 cheeses',
          'Melt butter on a pan and add Heavy Cream and mix',
          'Put all ingredients together and mix'
        ],
        cuisineType: 'Italian', // For cuisine filtering
        foodType: 'Pasta',     // For food type filtering
        diet: 'omnivore'         // "omnivore" or "herbivore"
      },

      {
        id: 'admin-salad-1',
        admin: true, // Marker so we always include this recipe
        name: 'Mediterranean Chopped Salad',
        imageUrl:
          'https://feelgoodfoodie.net/wp-content/uploads/2019/02/Mediterranean-Chopped-Salad-12.jpg',
        ingredients: [
          'Romain Lettuce',
          'Tomatoes',
          'Chickpeas',
          'Kalamata olives',
          'Red Onions',
          'Feta cheese - Vegan version'
        ],
        steps: [
          'Chop all the ingredients up and Toss it around. Add Whatever dressing you want.'
        ],
        cuisineType: 'Mediterranean', // For cuisine filtering
        foodType: 'Salads',     // For food type filtering
        diet: 'herbivore'         // "omnivore" or "herbivore"
      }

  ];
  