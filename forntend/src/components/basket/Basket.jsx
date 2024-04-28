"use client"

const Basket = ({ selectedServices, services, onRemoveService }) => {
  if (selectedServices.size === 0) {
    return <div className="p-4 text-lg flex justify-start items-center">Your basket is empty.</div>;
  }

  return (
    <div className="w-full p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Your Selected Services</h2>
      <div className="flex flex-col flex-wrap">
        {Array.from(selectedServices).map(serviceId => {
          const service = services.find(s => s._id === serviceId);
          return (
            <div key={serviceId} className="mb-2 mr-4 flex flex-row items-center">
              <span className="mr-2">{service.title} - AED {service.price}</span>
              <button onClick={() => onRemoveService(serviceId)} className="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Basket;
