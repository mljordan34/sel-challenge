// Sources and start information in DataTable.tsx
// 'yarn dev' in terminal to view webpage
//
// If need more info go to DataTable.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DataTable from './DataTable.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <p id='title'>SEL Intern Challange</p>
    <DataTable />
  </StrictMode>,
)
