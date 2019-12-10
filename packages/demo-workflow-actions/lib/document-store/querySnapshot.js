import client from 'part:@sanity/base/client'
import {defer} from 'rxjs'

export function getQuerySnapshotObservable(query, params) {
  return defer(() => client.observable.fetch(query, params))
}
