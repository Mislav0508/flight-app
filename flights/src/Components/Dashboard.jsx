import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../features/userSlice'
import "./Dashboard.css"
import { Link } from "react-router-dom"
import axios from 'axios';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useCallback } from 'react'

/* eslint-disable */

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState(null);
  const [ids, setIds] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  const user = useSelector(selectUser)

  const dispatch = useDispatch()

  const handleLogout = () => {

      dispatch(logout())
  }

  const fetchData = async () => {
    try {
      const response = await axios.get('https://inxelo-interview-project-default-rtdb.europe-west1.firebasedatabase.app/5bdf0ab7-c609-4d2f-a3c7-e593d1097886/flights.json', {
        followRedirect: true
      })
      const data = await response.data

      const flightIds = Object.keys(data)
      setIds(flightIds)

      const flightsArray = [...Object.values(data)]
      setFlights(flightsArray)
      
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);

  // CRUD Operations
  const handleCreateNewRow = async (values) => {
    try {
      setLoading(true)

      const flightData = {
        flightNumber: values.flightNumber,
        dateDeparture: values.dateDeparture,
        dateArrival: values.dateArrival,
        aircraftType: values.aircraftType,
        aircraftRegistration: values.aircraftRegistration
      };
      
      const API_URL = 'https://inxelo-interview-project-default-rtdb.europe-west1.firebasedatabase.app/5bdf0ab7-c609-4d2f-a3c7-e593d1097886/flights.json'
      
      await axios.post(API_URL, flightData)
      

      fetchData()
      
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false);
    }
    flights.push(values);
    setFlights([...flights]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    
    if (!Object.keys(validationErrors).length) {
      flights[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      try {
        setLoading(true)

        const flightToUpdate = ids[row.index]

        const flightData = {
          flightNumber: values.flightNumber,
          dateDeparture: values.dateDeparture,
          dateArrival: values.dateArrival,
          aircraftType: values.aircraftType,
          aircraftRegistration: values.aircraftRegistration
        }

        const API_URL = `https://inxelo-interview-project-default-rtdb.europe-west1.firebasedatabase.app/5bdf0ab7-c609-4d2f-a3c7-e593d1097886/flights/${flightToUpdate}.json`

        await axios.put(API_URL, flightData)

      } catch (error) {
        setError(error)
      } finally {
        setLoading(false);
      }
      setFlights([...flights]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  }

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  }

  const handleDeleteRow = useCallback(
    async (row) => {
      
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
      ) {
        return;
      }
      try {
        setLoading(true)

        const flightToDelete = ids[row.id]
        console.log("flightToDelete",flightToDelete);

        const API_URL = `https://inxelo-interview-project-default-rtdb.europe-west1.firebasedatabase.app/5bdf0ab7-c609-4d2f-a3c7-e593d1097886/flights/${flightToDelete}.json`

        await axios.delete(API_URL);

      } catch (error) {
        setError(error)
      } finally {
        setLoading(false);
      }
      
      flights.splice(row.index, 1);
      setFlights([...flights]);
    },
    [flights],
  )

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          console.log(event.target.name);
          const isValid = validateRequired(event.target.value)
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'flightNumber',
        header: 'Flight Number',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'dateDeparture',
        header: 'Date Departure',
        size: 200,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'dateArrival',
        size: 200,
        header: 'Date Arrival',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
      },
      {
        accessorKey: 'aircraftType',
        header: 'Aircraft Type',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
      },
      {
        accessorKey: 'aircraftRegistration',
        header: 'Aircraft Registration',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell)
        }),
      }
    ],
    [getCommonEditTextFieldProps],
  )
    
  console.log("flights",flights);
  
  return (
    <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center' ,
        mt: "4rem"
        }}>
      <Stack spacing={5}>
        <h1 className='dashboard__title'>DASHBOARD</h1>

        <h1>Welcome <span className='user__name'>{user.name}</span></h1>

        {loading ? (<div>Loading...</div>) : error ? (
          <div>
            Error: {error.message}
          </div>
        ) : (
          <>
            <MaterialReactTable
            displayColumnDefOptions={{
              'mrt-row-actions': {
                muiTableHeadCellProps: {
                  align: 'center',
                },
                size: 120,
              },
            }}
            columns={columns}
            data={flights}
            editingMode="modal" //default
            enableColumnOrdering
            enableEditing
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip arrow placement="left" title="Edit">
                  <IconButton onClick={() => table.setEditingRow(row)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={() => (
              <Button
                color="primary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
              >
                Create New Flight
              </Button>
            )}
          />
          <CreateNewFlightModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
          </>
        )}

        
        
        <Link to="/" style={{ textDecoration: 'none' }} onClick={() => handleLogout()}>
          <Button variant="contained" type='submit' color="error">Logout</Button>
        </Link>
      </Stack>
    </Box>

  )
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewFlightModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                required={true}
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create New Flight
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;

export default Dashboard
