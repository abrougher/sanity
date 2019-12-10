import React from 'react'

import styles from './UserCard.module.css'

export default function UserCard(props) {
  const {data} = props

  return (
    <div className={styles.root}>
      <div className={styles.avatar}>
        <img src={data.imageUrl} />
      </div>
      <div className={styles.displayName}>
        {data.displayName}
        {data.isCurrentUser && <> (me)</>}
      </div>
    </div>
  )
}
