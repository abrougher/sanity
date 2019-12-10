import {useObservable} from '../utils/hooks'
import {getDocumentEntryObservable} from './documentEntry'
import {getDocumentIdsStateObservable} from './documentIds'
import {getDocumentSnapshotListStateObservable} from './documentSnapshotList'
import {getQuerySnapshotObservable} from './querySnapshot'

const noop = () => void 0

// query snapshot

export function useQuerySnapshot(query, params) {
  const stream = getQuerySnapshotObservable(query, params)
  const initialState = null
  const keys = [query, JSON.stringify(params)]

  return useObservable(stream, initialState, keys)
}

// document entry

export function useDocumentEntry(id) {
  const stream = getDocumentEntryObservable(id)
  const initialState = {
    reconnecting: false,
    draft: {
      api: null,
      data: null,
      deleted: null
    },
    published: {
      api: null,
      data: null,
      deleted: null
    },
    error: null,
    retry: noop
  }
  const keys = [id]

  return useObservable(stream, initialState, keys)
}

// document ids

export function useDocumentIds(opts) {
  const stream = getDocumentIdsStateObservable(opts)
  const initialState = {data: null, error: null, loading: false, onRetry: noop}
  const keys = [opts.filter, JSON.stringify(opts.params)]

  return useObservable(stream, initialState, keys)
}

// document list

export function useDocumentSnapshotList(opts) {
  const stream = getDocumentSnapshotListStateObservable(opts)
  const initialState = {data: null, error: null, loading: false, onRetry: noop}
  const keys = [opts.filter, JSON.stringify(opts.params)]

  return useObservable(stream, initialState, keys)
}
