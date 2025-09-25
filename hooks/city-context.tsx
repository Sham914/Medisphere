"use client"
import { createContext, useContext, useState } from "react"

const CITIES = ["Muvattupuzha", "Kothamangalam", "Perumbavoor"]

const CityContext = createContext({
  city: CITIES[0],
  setCity: (city: string) => {},
  cities: CITIES,
})


export function CityProvider({ children }: { children: React.ReactNode }) {
  // Persist city selection in localStorage
  const [city, setCityState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCity") || CITIES[0]
    }
    return CITIES[0]
  })

  const setCity = (newCity: string) => {
    setCityState(newCity)
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedCity", newCity)
    }
  }

  return (
    <CityContext.Provider value={{ city, setCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  return useContext(CityContext)
}
