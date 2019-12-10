import config from 'config:sanity'
import client from 'part:@sanity/base/client'
import {defer, from} from 'rxjs'
import {useObservable} from '../utils/hooks'

export function getProjectSnapshotObservable(projectId) {
  return defer(() =>
    from(
      client.request({
        uri: `/projects/${projectId}`,
        withCredentials: true
      })
    )
  )
}

export function useProjectSnapshot(projectId) {
  const source = getProjectSnapshotObservable(projectId)
  const initialValue = null
  const keys = [projectId]

  return useObservable(source, initialValue, keys)
}

export function useCurrentProjectSnapshot() {
  return useProjectSnapshot(config.api.projectId)
}
