import { useEffect, useState, useMemo } from "react"
import { freeTickets } from "../../../services/seller_tickets.service"
import SpinnerLoad from "../../../components/SpinnerLoad"

const TicketFree = () => {
    const [loading, setLoading] = useState(true)
    const [filterNumber, setFilterNumber] = useState("")
    const [selected, setSelected] = useState<string[]>([])
    const [data, setData] = useState<{ tickets_excluded: (string | number)[]; raffle: { start_number: number; final_number: number } | null }>({
        tickets_excluded: [],
        raffle: null,
    })

    const load = async () => {
        setLoading(true)
        try {
            const res = await freeTickets()
            setData(res)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const allAvailable = useMemo(() => {
        if (!data.raffle) return []
        const excluded = new Set(
            data.tickets_excluded.map(n => n.toString().padStart(4, '0'))
        )
        const result: string[] = []
        for (let i = data.raffle.start_number; i <= data.raffle.final_number; i++) {
            const num = i.toString().padStart(4, '0')
            if (!excluded.has(num)) result.push(num)
        }
        return result
    }, [data])

    const filtered = useMemo(() => {
        if (!filterNumber) return allAvailable
        return allAvailable.filter(n => n.includes(filterNumber))
    }, [allAvailable, filterNumber])

    const toggleSelect = (num: string) => {
        setSelected(prev =>
            prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
        )
    }

    return (
        <>
            {loading && <SpinnerLoad />}

            <div className="row g-2 mb-3 align-items-center">
                <div className="col-md-2">
                    <input
                        className="form-control"
                        placeholder="Filtrar número"
                        value={filterNumber}
                        onChange={e => setFilterNumber(e.target.value)}
                    />
                </div>
                <div className="col-md-8">
                    <input
                        className="form-control"
                        readOnly
                        placeholder="Números seleccionados"
                        value={selected.join(', ')}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-general px-4" disabled={selected.length === 0}>
                    Comprar
                </button>
            </div>

            <div style={{ background: '#d0d0d0', borderRadius: 12, padding: 16 }}>
                <h5 className="text-center fw-bold mb-3">NÚMEROS DISPONIBLES</h5>
                {filtered.length === 0 && !loading ? (
                    <p className="text-center">No hay números disponibles</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {filtered.map(num => (
                            <button
                                key={num}
                                onClick={() => toggleSelect(num)}
                                style={{
                                    background: selected.includes(num) ? '#1a2f6e' : '#00bcd4',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '8px 14px',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    minWidth: 80,
                                }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default TicketFree
