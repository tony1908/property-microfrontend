import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PropertyCard from "./PropertyCard";
import type { Property } from "../../model/types";

const mockProperty: Property = {
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

describe("PropertyCard", () => {
    it("should render the property card", () => {
        render(<PropertyCard {...mockProperty} />)

        expect(screen.getByText(mockProperty.title)).toBeInTheDocument()
        expect(screen.getByText(`Hosted by ${mockProperty.host}`)).toBeInTheDocument()
        expect(screen.getByText(`$${mockProperty.price}`)).toBeInTheDocument()
        expect(screen.getByText(mockProperty.type)).toBeInTheDocument()
        expect(screen.getByText(mockProperty.location)).toBeInTheDocument()
        expect(screen.getByText(mockProperty.details)).toBeInTheDocument()
    })

    it("should render image with correct src", () => {
        render(<PropertyCard {...mockProperty} />)
        
        const image = screen.getByText(mockProperty.title).closest(".property-card")?.querySelector("img")

        expect(image).toHaveAttribute("src", mockProperty.image)
    })

    it("should call handleCardClick when clicked", () => {
        const consoleSpy = vi.spyOn(console, "log")

        render(<PropertyCard {...mockProperty} />)

        const card = screen.getByText(mockProperty.title).closest(".property-card")
        fireEvent.click(card!);

        expect(consoleSpy).toHaveBeenCalledWith(mockProperty.id)
        consoleSpy.mockRestore()
    })
});



