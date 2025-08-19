"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { RefreshCw } from "lucide-react"

type VoltageRow = {
  id: number
  ts: string
  volt: number
}

export default function DashboardPage() {
  const [voltageData, setVoltageData] = useState<{ time: string; voltage: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem("dmg9000_authenticated")
    if (!isAuthenticated) {
      router.push("/")
    } else {
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/voltages")
      if (!res.ok) throw new Error("Error en la API")

      const rows: VoltageRow[] = await res.json()

      // Convertir datos de BD -> formato para Recharts
      const formatted = rows.map((row) => ({
        time: new Date(row.ts).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        voltage: row.volt,
      }))

      setVoltageData(formatted.reverse()) // reverse para que se grafiquen en orden ascendente
      setLastUpdate(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchData()
  }

  const handleLogout = () => {
    localStorage.removeItem("dmg9000_authenticated")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard DMG9000</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
              <CardDescription>Última actualización: {lastUpdate.toLocaleString("es-ES")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <div className="text-sm text-muted-foreground">Estado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {voltageData[voltageData.length - 1]?.voltage ?? "-"}V
                  </div>
                  <div className="text-sm text-muted-foreground">Voltaje Actual</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Normal</div>
                  <div className="text-sm text-muted-foreground">Operación</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voltage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Voltaje vs Tiempo</CardTitle>
              <CardDescription>Monitoreo en tiempo real del voltaje del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={voltageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(value) => `Tiempo: ${value}`}
                      formatter={(value) => [`${value}V`, "Voltaje"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="voltage"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}