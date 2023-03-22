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
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useCallback } from 'react'
import { API_BASE_URL } from '../config/config_dev';
import moment from 'moment';
import CreateNewFlightModal from "./CreateNewFlightModal"
import { validateRequired, validateDateTime } from "../utils/validators"

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

      // Formatting DateTimePicker values
      const dateTimePickerValueDeparture = new Date(values.departureTime);
      const departureTime = moment(dateTimePickerValueDeparture).format('YYYY-MM-DDTHH:mm:ss.SSS');
      const dateTimePickerValueArrival = new Date(values.arrivalTime);
      const arrivalTime = moment(dateTimePickerValueArrival).format('YYYY-MM-DDTHH:mm:ss.SSS');

      const flightData = {
        flightNumber: values.flightNumber,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        aircraftType: values.aircraftType,
        aircraftRegistration: values.aircraftRegistration
      };

      flights.push({
        ...values,
        departureTime: moment(departureTime).format('YYYY-MM-DD HH:mm:ss'),
        arrivalTime: moment(arrivalTime).format('YYYY-MM-DD HH:mm:ss')
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

        // Formatting DateTimePicker values
        const dateTimePickerValueDeparture = new Date(values.departureTime);
        const departureTime = moment(dateTimePickerValueDeparture).format('YYYY-MM-DDTHH:mm:ss');
        const dateTimePickerValueArrival = new Date(values.arrivalTime);
        const arrivalTime = moment(dateTimePickerValueArrival).format('YYYY-MM-DDTHH:mm:ss');

        const flightData = {
          flightNumber: values.flightNumber,
          departureTime: departureTime,
          arrivalTime: arrivalTime,
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
          const isEmpty = validateRequired(event.target.value);
          const isValidDateTime =
            cell.column.id === 'departureTime'
              ? validateDateTime(event.target.value)
              : cell.column.id === 'arrivalTime'
              ? validateDateTime(event.target.value)
              : validateRequired(event.target.value);
          if (!isEmpty) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else if (!isValidDateTime) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is not a valid format`,
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

export default Dashboard
