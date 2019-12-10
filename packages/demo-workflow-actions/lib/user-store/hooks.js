import {useCurrentProjectSnapshot} from '../project-store'
import {useObservable} from '../utils/hooks'
import {getUserSnapshotObservable} from './userSnapshot'
import {getUserSnapshotListObservable} from './userSnapshotList'

export function useUserSnapshot(userId) {
  const source = getUserSnapshotObservable(userId)
  const initialState = null
  const keys = [userId]

  return useObservable(source, initialState, keys)
}

export function useUserSnapshotList(userIds) {
  if (!userIds) {
    throw new Error('useUserSnapshotList: `userIds` must be an array of strings')
  }

  const source = getUserSnapshotListObservable(userIds)
  const initialState = null
  const keys = [userIds.join(',')]

  return useObservable(source, initialState, keys)
}

export function useProjectUsers() {
  const project = useCurrentProjectSnapshot()
  const allUserIds = project && project.members.map(user => user.id)

  return useUserSnapshotList(allUserIds || [])
}
