import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect } from "react"
import { getCustomers } from "../../services/customer.service"

const Customers = () => {

    useEffect(() => {
        const getCustomersFn = async () => {
            try {
                const customers = await getCustomers();
                console.log('customers ==> ', customers);
                
            }
            catch (error) {
                console.error('Error fetching customers:', error);
            }
        }

        getCustomersFn()
    }, [])

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#314b91', color: "white" }}>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Documento</TableCell>
                            <TableCell>Ciudad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Juan Perez
                            </TableCell>
                            <TableCell>
                                1234567890
                            </TableCell>
                            <TableCell>
                                123456789
                            </TableCell>
                            <TableCell>
                                Bogotá
                            </TableCell>
                            <TableCell>
                                <button>Editar</button>
                                <button>Borrar</button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Customers