"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [formData, setFormData] = useState({
    business: "",
    salesperson: "",
    price: "",
    description: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  // Predefined prices
  const predefinedPrices = [50, 100, 250, 350, 400, 500, 600, 800, 1000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Guardando venta..." });

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "¡Venta registrada con éxito!" });
        setFormData({
          business: "",
          salesperson: "",
          price: "",
          description: "",
        });
      } else {
        throw new Error(data.error || "Error al guardar la venta");
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleButtonSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Registro de Ventas
          </h1>
          <Link
            href="/ventas"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Ver todas las ventas →
          </Link>
        </div>

        {status.message && (
          <div
            className={`mb-4 p-4 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Negocio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleButtonSelect("business", "perlita")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.business === "perlita"
                    ? "bg-blue-600 text-white"
                    : "bg-pink-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Perlita Joyería
              </button>
              <button
                type="button"
                onClick={() => handleButtonSelect("business", "patron")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.business === "patron"
                    ? "bg-blue-600 text-white"
                    : "bg-orange-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                El Patrón
              </button>
            </div>
          </div>

          {/* Sales Person Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendedor
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleButtonSelect("salesperson", "perlita_jr")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.salesperson === "perlita_jr"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Perlita Jr
              </button>
              <button
                type="button"
                onClick={() => handleButtonSelect("salesperson", "walter_jr")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.salesperson === "walter_jr"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Walter Jr
              </button>
              <button
                type="button"
                onClick={() => handleButtonSelect("salesperson", "luis")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.salesperson === "luis"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Luis
              </button>
              <button
                type="button"
                onClick={() => handleButtonSelect("salesperson", "walter")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.salesperson === "walter"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Walter
              </button>
              <button
                type="button"
                onClick={() => handleButtonSelect("salesperson", "perlita")}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  formData.salesperson === "perlita"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Perlita
              </button>
            </div>
          </div>

          {/* Price Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Venta
            </label>

            {/* Predefined Price Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {predefinedPrices.map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() => handleButtonSelect("price", price.toString())}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    formData.price === price.toString()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ${price}
                </button>
              ))}
            </div>

            {/* Custom Price Input */}
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="10"
                className="pl-7 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Otro monto"
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción (Opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="Agregar detalles de la venta..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              status.type === "loading" ||
              !formData.business ||
              !formData.salesperson ||
              !formData.price
            }
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.type === "loading" ? "Guardando..." : "Registrar Venta"}
          </button>
        </form>
      </div>
    </div>
  );
}
