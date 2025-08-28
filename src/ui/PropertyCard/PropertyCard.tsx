import './PropertyCard.css'
import { type Property } from "../../model/types";
//import { useNavigate } from 'react-router-dom'

function PropertyCard({image, rating, title, type, location, details, host, price, id }: Property) {
    //const navigate = useNavigate()

    const handleCardClick = () => {
        //navigate(`/property/${id}`)
        console.log(id)
    }

    return (
        <div className="property-card" onClick={handleCardClick}>
            <div className="property-image-container">
                <img src={image} alt="" className="property-image" />
            </div>
            <div className="property-info">
                <div className="property-header">
                    <h3 className="property-title">{title}</h3>
                    <div className="property-rating">
                        <span className="rating-star">★</span>
                        <span className="rating-value">{rating}</span>
                    </div>
                </div>
                <p className="property-type">
                    {type}
                </p>
                <p className="property-location">
                    {location}
                </p>
                <p className="property-details">
                    {details}
                </p>
                <p className="property-host">
                    Hosted by {host}
                </p>
                <div className="property-price">
                    <span className="price-amount">${price}</span>
                    <span className="price-period">per night</span>
                </div>
            </div>
        </div>
    )
}

export default PropertyCard