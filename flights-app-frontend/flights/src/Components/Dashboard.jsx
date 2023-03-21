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
import { API_BASE_URL } from '../config/config_dev';
import { DateTimePicker , LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import moment from 'moment';

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
      const response = await axios.get(API_BASE_URL, {
        followRedirect: true
      })
      const data = await response.data

      const formattedData = data.map(x => {
        return {
          ...x, departureTime: moment(x.departureTime).format('YYYY-MM-DD HH:mm:ss'),
          arrivalTime: moment(x.arrivalTime).format('YYYY-MM-DD HH:mm:ss')
        }
      })

      const flightIds = data.map(x => x.idflight);
      setIds(flightIds)

      const flightsArray = [...Object.values(formattedData)]
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
        departureTime: moment(values.departureTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        arrivalTime: moment(values.arrivalTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
        aircraftType: values.aircraftType,
        aircraftRegistration: values.aircraftRegistration
      };
      flights.push({
        ...values,
        departureTime: moment(values.departureTime).format('YYYY-MM-DD HH:mm:ss'),
        arrivalTime: moment(values.arrivalTime).format('YYYY-MM-DD HH:mm:ss')
      });

      await axios.post(API_BASE_URL, flightData, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      await fetchData()

    } catch (error) {
      setError(error)
    } finally {
      setLoading(false);
    }
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
          departureTime: moment(values.departureTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
          arrivalTime: moment(values.arrivalTime).format('YYYY-MM-DDTHH:mm:ss.SSS'),
          aircraftType: values.aircraftType,
          aircraftRegistration: values.aircraftRegistration
        };

        const API_URL = `${API_BASE_URL}/${flightToUpdate}`

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
        !confirm(`Are you sure you want to delete ${row.getValue('flightNumber')}?`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      try {
        setLoading(true)

        const flightToDelete = ids[row.id]

        const API_URL = `${API_BASE_URL}/${flightToDelete}`

        await axios.delete(API_URL, {
          headers: {
            "Content-Type": "application/json"
          }
        });

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
        accessorKey: 'departureTime',
        header: 'Date Departure',
        size: 200,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'arrivalTime',
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
  
  return (
    <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center' ,
        mt: "4rem"
        }}>
      <Stack spacing={5}>

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              column.accessorKey === "departureTime" || column.accessorKey === "arrivalTime"
                ?
              <DateTimePicker
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                value={values[column.accessorKey]}
                onChange={(e) =>
                  setValues({ ...values,
                    [column.accessorKey === "departureTime" ? "departureTime"
                      : "arrivalTime"]: e })
                }
                required={true}/>
                :
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                value={values[column.accessorKey]}
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
        <Button color="primary" onClick={handleSubmit} variant="contained"
                disabled={!Object.values(values).every((value) => !!value)}>
          Create New Flight
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
};

const validateRequired = (value) => !!value.length;

export default Dashboard
