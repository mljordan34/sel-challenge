// SEL Challange
// Simple Web Application that auths and retrieves RESTful JSON data from API
// 
// Created by: Matthew Jordan
// Last updated: November 6, 2025
//
// Sources:
//        https://mui.com/material-ui/getting-started/installation/
//        https://mui.com/material-ui/react-table/#data-table
//
// To start: run 'yarn dev' in terminal
//      might have to run 'yarn add @mui/material @emotion/react @emotion/styled @mui/x-data-grid'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'stVal', headerName: 'Int Value', width: 130 },
  { field: 't', headerName: 'Timestamp', width: 300},
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    const [rows, setRows] = React.useState<any[]>([]);
    const [polling, setPolling] = React.useState(false); // initially set to false, no polling
    const intervalRef = React.useRef<number | null>(null);

    async function getData() {
        // get all data from symbols endpoint
        const rawData = await fetch('https://192.168.3.2/api/v1/logic-engine/symbols?sort=asc&filter=SystemTags%2A', {
            headers: {
                Authorization: 'Basic ' + btoa("SEL:SEL")
            }
        });
        const jsonData = await rawData.json()

        // filter that data to have only 'INS' types
        const insDataList: any[] = [];
        for (const each of jsonData) {
          if (each.Type === 'INS') {
            insDataList.push(each)
          }
        }
        // append each 'INS' type filtered above into a list of each object that has stVal and t data
        const usableObjList: any[] = [];
        for (const insObject of insDataList) { // vvv WHERE I MESSED UP (forgot to set the https://192.168.3.2)
          const insData = await fetch(`https://192.168.3.2/api/v1/logic-engine/symbols/${insObject.Name}`, {
              headers: {
                  Authorization: 'Basic ' + btoa("SEL:SEL")
              }
          });
          const jsonInsData = await insData.json()
          usableObjList.push(jsonInsData)
        }

        // convert usableObjList into DataGrid rows
        const insRowsWithIds = usableObjList.map((item: any, index: number) => ({
          id: index + 1,
          stVal: item.stVal,
          t: item.t
        }));

      // update the DataGrid display with the new set of data
      setRows([...insRowsWithIds]);
    }

    function startPolling() {
      if (polling) return; // already polling
      setPolling(true);
      intervalRef.current = setInterval(getData, 2000);
    }

    function stopPolling() {
      if (!polling) return;
      setPolling (false);
      if (intervalRef.current) { // clear and reset the intervalRef if not null
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    React.useEffect(() => {
        // clear interval if not null
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

  return (
    <div id='mainContainer'>
      <div>
        <button onClick={startPolling} id='startP'>Start Polling</button>
        <p style={{ backgroundColor: polling ? '#00cf11ff' : '#ff0000ff' }}>{polling ? 'Polling' : 'Not Polling'}</p>
        <button onClick={stopPolling} id='stopP'>Stop Polling</button>
      </div>
      <Paper sx={{ height: 900, width: '100%' }} id='grid'>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 20]}
          checkboxSelection={false}
          sx={{ 
              border: 0, 
          }}
        />
      </Paper>
    </div>
  );
}
