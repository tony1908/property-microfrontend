import './PropertyApp.css'
import { PropertyCard } from './ui/PropertyCard'
import type { Property } from './model/types'

const PropertyApp = (properties: Property[]) => {
    return (
        <div className="property-grid-container"> 
            <h1>Popular Destinations</h1>
            <div className="property-grid">
                {properties.map((property: Property) => (
                    <PropertyCard 
                        key={property.id}
                        {...property}
                    />
                ))}
            </div>
        </div>
    )
}

export default PropertyApp