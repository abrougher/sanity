import {map, switchMap} from 'rxjs/operators'
import {getDocumentSnapshotListObservable} from './lib/document-store'
import {getCurrentUserSnapshotObservable} from './lib/user-store'
import S from '@sanity/desk-tool/structure-builder'

const HIDDEN_TYPES = [
  // 'workflow.metadata'
  'post'
]

const hiddenDocTypes = listItem => !HIDDEN_TYPES.includes(listItem.getId())

const assignedToMeQuery = `
  * [$userId in assignees] {
    ...coalesce(
        *[_type == $type && _id == "drafts." + ^.targetId][0],
        *[_type == $type && _id == ^.targetId][0]
      )
  }
`

function getDocumentListAssignedToMeObservable(typeName) {
  return getCurrentUserSnapshotObservable().pipe(
    switchMap(user =>
      getDocumentSnapshotListObservable(assignedToMeQuery, {type: typeName, userId: user.id})
    )
  )
}

const workflowAssignToMeStructure = opts => {
  return () =>
    getDocumentListAssignedToMeObservable(opts.type).pipe(
      map(docs => {
        return S.list()
          .id(opts.id || 'me')
          .title(opts.title)
          .items(
            docs.map(doc =>
              S.listItem()
                .id(doc._id)
                .title(doc.title)
            )
            //   [
            //   S.listItem()
            //     .id('test')
            //     .title('test')
            // ]
          )
      })
    )
}

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .child(
          S.list()
            .id('posts')
            .title('Posts')
            .items([
              S.listItem()
                .id('me')
                .title('Assigned to me')
                .child(workflowAssignToMeStructure({type: 'post', title: 'Assigned to me'}))
            ])
        ),

      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
