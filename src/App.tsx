import PropertyApp from "./PropertyApp";

function App() {

    const properties = [
        {
            id: 1,
            image: "https://example.com/image.jpg",
            title: "Property Title",
            type: "Property Type",
            location: "Property Location",
            details: "Property Details",
            host: "Property Host",
            price: 100,
            rating: 5,
        }
    ]

  return (
    <>
      <p>Property App</p>
      <PropertyApp properties={properties} />
    </>
  )
}

export default App
