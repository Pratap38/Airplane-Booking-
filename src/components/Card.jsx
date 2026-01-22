import React from 'react';

const CardSection = () => {
  // Example card data
  const cards = [
    {
      title: "Fast Booking",
      description: "Book your flights in just a few clicks and save time.",
      icon: "/images/fastbook.png",
    },
    {
      title: "Best Deals",
      description: "Get exclusive offers and discounts on top destinations.",
      icon: "/images/best.png",
    },
    {
      title: "24/7 Support",
      description: "We’re here for you anytime you need assistance.",
      icon: "/images/tech.png",
    },
  ];

  return (
    <section className="bg-white text-black py-1">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid grid-row-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <img src={card.icon} alt={card.title} className="w-16 h-16 mb-6" />
              <h3 className="text-xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSection;
