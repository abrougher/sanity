import {useDocumentList} from './document-store'

const workflowMetadataQuery = `
  *[_type == $type && state == $state] {
    "document": coalesce(
      *[_id == "drafts." + ^.targetId][0],
      *[_id == ^.targetId][0]
    ) {_id, _type},
    state
  }
`

export function useWorkflowDocumentList(state) {
  const metadataList = useDocumentList(workflowMetadataQuery, {
    type: 'workflow.metadata',
    state
  })

  return metadataList && metadataList.map(metadata => metadata.document).filter(Boolean)
}
