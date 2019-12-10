import FolderIcon from 'part:@sanity/base/folder-icon'
import schema from 'part:@sanity/base/schema'
import React from 'react'
import {useRouter} from '../../../../lib/router'
import {useWorkflowDocumentList} from '../../lib/hooks'
import {DocumentCard} from '../documentCard'

import styles from './Column.module.css'

// Return false if we explicitly disable the icon, otherwise use the
// passed icon or the schema type icon as a backup
function getIconWithFallback(icon, schemaType) {
  if (icon === false) {
    return false
  }

  return icon || (schemaType && schemaType.icon) || FolderIcon
}

export default function Column({data}) {
  const router = useRouter()
  const metadataList = useWorkflowDocumentList(data.id) || []

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{data.title}</h2>
      </header>

      <div className={styles.content}>
        {metadataList.length > 0 && (
          <div className={styles.cardList}>
            {metadataList.map(doc => {
              const showIcon = true
              const schemaType = schema.get(doc._type)
              const href = router.resolveIntentLink('edit', {id: doc._id, type: doc._type})
              const icon = getIconWithFallback(showIcon, schemaType)

              return (
                <div key={doc._id}>
                  <DocumentCard
                    data={doc}
                    href={href}
                    icon={icon}
                    onOpen={() => router.navigateUrl(href)}
                    schemaType={schemaType}
                    selected={false}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
