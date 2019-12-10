import documentStore from 'part:@sanity/base/datastore/document'
import {useObservable} from '@sanity/react-hooks'

export function useDocumentList(query, params) {
  const documentList$ = documentStore.listenQuery(query, params)

  return useObservable(documentList$)
}
