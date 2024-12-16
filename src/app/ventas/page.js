"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function VentasPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    business: "",
    salesperson: "",
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("/api/sales");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar las ventas");
      }

      setSales(data.sales);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const filteredSales = sales.filter((sale) => {
    if (filters.business && sale.business !== filters.business) return false;
    if (filters.salesperson && sale.salesperson !== filters.salesperson)
      return false;
    return true;
  });

  const calculateTotals = () => {
    const totals = {
      overall: 0,
      byBusiness: {
        perlita: 0,
        patron: 0,
      },
      bySalesperson: {},
    };

    sales.forEach((sale) => {
      const price = parseFloat(sale.price);
      totals.overall += price;
      totals.byBusiness[sale.business] += price;

      if (!totals.bySalesperson[sale.salesperson]) {
        totals.bySalesperson[sale.salesperson] = 0;
      }
      totals.bySalesperson[sale.salesperson] += price;
    });

    return totals;
  };

  const totals = calculateTotals();

  // Function to prepare chart data
  const prepareHourlyChartData = () => {
    // Initialize hours array (0-23)
    const hourlyData = Array(24).fill(0);
    const hourlyCount = Array(24).fill(0);

    // Group sales by hour
    filteredSales.forEach((sale) => {
      const hour = new Date(sale.created_at).getHours();
      hourlyData[hour] += parseFloat(sale.price);
      hourlyCount[hour]++;
    });

    return {
      labels: Array.from(
        { length: 24 },
        (_, i) => `${i.toString().padStart(2, "0")}:00`
      ),
      datasets: [
        {
          label: "Ventas por Hora",
          data: hourlyData,
          backgroundColor: "rgba(59, 130, 246, 0.5)", // blue-500 with opacity
          borderColor: "rgb(59, 130, 246)", // blue-500
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas por Hora del Día",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${formatPrice(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatPrice(value);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="text-sm text-blue-700 hover:text-blue-900 hover:underline font-medium"
          >
            ← Volver al registro
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Total General
            </h2>
            <p className="text-2xl font-bold text-blue-700">
              {formatPrice(totals.overall)}
            </p>
            <p className="text-sm font-medium text-gray-700">
              {filteredSales.length} ventas
            </p>
          </div>

          {/* Business Totals Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Por Negocio
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-900">
                <span className="font-medium">Perlita Joyería:</span>
                <span className="font-semibold">
                  {formatPrice(totals.byBusiness.perlita)}
                </span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span className="font-medium">El Patrón:</span>
                <span className="font-semibold">
                  {formatPrice(totals.byBusiness.patron)}
                </span>
              </div>
            </div>
          </div>

          {/* Salesperson Totals Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Por Vendedor
            </h2>
            <div className="space-y-2">
              {Object.entries(totals.bySalesperson).map(([person, total]) => (
                <div
                  key={person}
                  className="flex justify-between text-gray-900"
                >
                  <span className="font-medium">
                    {person
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    :
                  </span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="w-full h-[400px]">
            <Bar data={prepareHourlyChartData()} options={chartOptions} />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Filtrar por Negocio
              </label>
              <select
                value={filters.business}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, business: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los negocios</option>
                <option value="perlita">Perlita Joyería</option>
                <option value="patron">El Patrón</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Filtrar por Vendedor
              </label>
              <select
                value={filters.salesperson}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    salesperson: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los vendedores</option>
                <option value="perlita_jr">Perlita Jr</option>
                <option value="walter_jr">Walter Jr</option>
                <option value="luis">Luis</option>
                <option value="walter">Walter</option>
                <option value="perlita">Perlita</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Registro de Ventas
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Mostrando {filteredSales.length} de {sales.length} ventas
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Negocio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.business === "perlita"
                        ? "Perlita Joyería"
                        : "El Patrón"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.salesperson
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(sale.price)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {sale.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-8 text-gray-900 font-medium">
              No hay ventas que coincidan con los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
