import userDatastore from 'part:@sanity/base/user'
import {defer, from} from 'rxjs'
import {filter, map} from 'rxjs/operators'

export function getCurrentUserSnapshotObservable() {
  return userDatastore.currentUser.pipe(
    filter(event => event.type === 'snapshot'),
    map(({user}) => user)
  )
}

export function getUserSnapshot(userId) {
  return userDatastore.getUser(userId)
}

export function getUserSnapshotObservable(userId) {
  return defer(() => from(getUserSnapshot(userId)))
}
