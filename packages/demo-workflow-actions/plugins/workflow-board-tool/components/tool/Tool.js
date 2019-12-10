import React from 'react'
import {Column} from '../column'

import styles from './Tool.module.css'

const columns = [
  {id: 'draft', title: 'Draft'},
  {id: 'in-review', title: 'In review'},
  {id: 'approved', title: 'Approved'},
  {id: 'declined', title: 'Declined'},
  {id: 'published', title: 'Published'}
]

export default function Tool() {
  return (
    <div className={styles.root}>
      {columns.map(column => (
        <div key={column.id}>
          <Column data={column} />
        </div>
      ))}
    </div>
  )
}
