import SanityPreview from 'part:@sanity/base/preview'
import React from 'react'

import styles from './DocumentCard.module.css'

export default function DocumentCard({data, href, onOpen, schemaType, selected}) {
  const layout = 'default'
  const icon = true

  const handleClick = event => {
    event.preventDefault()
    onOpen()
  }

  return (
    <a className={styles.root} href={href} onClick={handleClick}>
      <SanityPreview
        icon={icon}
        isSelected={selected}
        layout={layout}
        value={data}
        type={schemaType}
      />
    </a>
  )
}
