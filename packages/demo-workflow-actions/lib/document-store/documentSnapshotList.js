import deepEquals from 'react-fast-compare'
import {concat, of, Subject, throwError} from 'rxjs'
import {catchError, map, mergeMapTo, startWith, switchMapTo, take} from 'rxjs/operators'
import {getQuerySnapshotObservable} from './querySnapshot'
import {getServerEventObservable} from './serverEvent'

export function getDocumentSnapshotListObservable(opts = {}) {
  const {filter, params} = opts

  if (!filter) throwError(new Error('getDocumentSnapshotListObservable: missing `filter` option'))

  const query = `*[${filter}]`
  const serverEvent$ = getServerEventObservable(query, params)
  const querySnapshot$ = getQuerySnapshotObservable(query, params)

  return serverEvent$.pipe(switchMapTo(querySnapshot$))
}

const DOCUMENT_LIST_INITIAL_STATE = {
  data: null,
  error: null,
  loading: true,
  retry: () => void 0
}

export function getDocumentSnapshotListStateObservable(opts) {
  const retrySubject = new Subject()
  const retry$ = retrySubject.asObservable()
  const retry = () => retrySubject.next()

  return getDocumentSnapshotListObservable(opts).pipe(
    map(data => ({data, error: null, loading: false})),
    catchError((error, caught$) =>
      concat(
        of(error => ({data: null, error, loading: false})),
        retry$.pipe(take(1), mergeMapTo(caught$))
      )
    ),
    map(state => ({...state, retry})),
    startWith(DOCUMENT_LIST_INITIAL_STATE)
  )
}
