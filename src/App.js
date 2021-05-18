import React, { useState, useRef, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styled from 'styled-components/macro'

import './App.css'

const Table = styled.table`
  position: relative;
  border-collapse: collapse;
  margin: 10px;
`

const TableHeadCol = styled.th`
  position: relative;
  padding: 0px;
`

const TableRow = styled.tr`
  position: relative;
`

const TableCell = styled.td`
  border: 1px solid #5f5d5d59;
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  text-align: left;
  background-color: ${props => props.active ? 'lightblue' : '#f8f5f5'};
`

const TextInput = styled.textarea`
  // outline: none;
  // border: none;
  // margin: 0;
  background: none;
  outline:none;
  resize:none;
  border: none;
  margin: 0;
  padding:0;
  overflow: hidden;
  width: 100%;
`

const Resizer = styled.div`
  position: absolute;
  height: ${props => props.height}px;
  top: 0;
  right: 0;
  width: 5px;
  cursor: col-resize;
  user-select: none;
  border-radius: 10px;
  &:hover {
    border-right: 2px solid #a0a0a0;
  }
`

export const App = props => {

  const table_ref = useRef(null)

  const [table, updateTable] = useState({
    active: {
      col: null,
      row: null,
    },
    defaultColWidth: 140,
    defaultRowHeight: 40,
    cols: [140, 140, 140, 140],
    rows: [40, 40, 40, 40, 40, 40, 40],
    data: [
      ['AGE', 'NAME', 'STACK', 'CITY'],
      ['20', 'Lisa', 'flutter', 'Moscow'],
      ['18', 'Max', 'scala', 'Moscow'],
      ['30', 'Aleks', 'python', 'AbuDabi'],
      ['46', 'Vika', 'javascript', 'Pekin'],
      ['28', 'Igor', 'android', 'Newcastle'],
      ['22', 'Andrey', 'ios', 'Amsterdam'],
    ]
  })


  const addColumn = () => {
    let data = [...table.data]
    data.map(row => row.splice(table.active.col + 1, 0, '') )

    updateTable(prevState => ({
      ...prevState, 
      active: {
        ...prevState.active,
        col: prevState.active.col + 1,
      },
      cols: [...prevState.cols, prevState.defaultColWidth], 
      data: data
    }))
  }

  const removeCol = () => {
    let data = [...table.data]
    data.map(row => row.splice(table.active.col, 1) )
    
    let cols = [...table.cols]
    cols.splice(table.active.col, 1)

    updateTable(prevState => ({
      ...prevState, 
      active: {
        ...prevState.active,
        col: prevState.active.col - 1,
      },
      cols: cols,
      data: data
    }))
  }

  const addRow = () => {
    let data = [...table.data]
    data.splice(table.active.row + 1, 0, new Array(table.cols.length).fill(''))

    // debugger
    updateTable(prevState => ({
      ...prevState, 
      active: {
        ...prevState.active,
        row: prevState.active.row + 1,
      },
      rows: [...prevState.rows, prevState.defaultRowHeight], 
      data: data
    }))
  }

  const removeRow = () => {
    let data = [...table.data]
    data.splice(table.active.row, 1)

    let rows = [...table.rows]
    rows.splice(table.active.row, 1)

    updateTable(prevState => ({
      ...prevState, 
      active: {
        ...prevState.active,
        row: prevState.active.row - 1,
      },
      rows: rows, 
      data: data
    }))
  }

  const onChangeCell = (value, row_index, cell_index) => {
    let data = [...table.data]
    data[row_index][cell_index] = value

    updateTable(prevState => ({
      ...prevState, 
      data: data
    }))
  }

  const setActiveCell = (row_index, cell_index) => {
    updateTable(prevState => ({
      ...prevState, 
      active: {
        col: cell_index, 
        row: row_index
      }
    })) 
  }


  const onMouseDown = useCallback((evt, col_index) => {
    let x = evt.clientX
    let w = parseInt(window.getComputedStyle(evt.target.parentNode).width)

    const mouseMoveHandler = e => {
        const dx = e.clientX - x
        let cols = [...table.cols]
  
        cols[col_index] = w + dx
        
        updateTable(prevState => ({
          ...prevState, 
          cols: cols
        }))
    }
  
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('mouseup', mouseUpHandler)
    }
    
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
  }, [table])


  return (
    <div>
      <button onClick={addColumn}>+Add column</button>
      <button onClick={removeCol}>-Remove column</button>
      <button onClick={addRow}>+Add row</button>
      <button onClick={removeRow}>-Remove row</button>
      {/* <CustomToolbar /> */}
      <Table ref={table_ref}>
        <thead>
          <tr>
            {new Array(table.cols.length).fill().map((item, index) => (
              <TableHeadCol key={index}>
                <Resizer 
                  height={table_ref.current !== null ? table_ref.current.offsetHeight : 0}
                  onMouseDown={evt => onMouseDown(evt, index)}
                />
              </TableHeadCol>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row, row_index) => (
            <TableRow key={row_index}>
              {row.map((cell, cell_index) => (
                  <TableCell
                    key={cell_index}
                    height={table.rows[row_index]}
                    width={table.cols[cell_index]}
                    active={row_index === table.active.row && cell_index === table.active.col}
                    onClick={evt => setActiveCell(row_index, cell_index)}
                  >
                    <TextInput
                      rows="1"
                      onChange={evt => onChangeCell(evt.target.value, row_index, cell_index)} 
                      value={cell} 
                    />
                    
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
    
  )
}