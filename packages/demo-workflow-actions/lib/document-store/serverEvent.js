import client from 'part:@sanity/base/client'
import {defer, merge, of, throwError, asyncScheduler} from 'rxjs'
import {mergeMap, partition, share, take, throttleTime} from 'rxjs/operators'

export function getRawServerEventObservable(query, params, options) {
  return defer(() => client.listen(query, params, options))
}

export function getServerEventObservable(query, params) {
  const listenOptions = {
    events: ['welcome', 'mutation', 'reconnect'],
    includeResult: false,
    visibility: 'query'
  }

  const listenerEvent$ = getRawServerEventObservable(query, params, listenOptions).pipe(
    throttleTime(1000, asyncScheduler, {leading: true, trailing: true})
  )

  const event$ = listenerEvent$.pipe(
    mergeMap((event, eventIndex) => {
      const isFirstEvent = eventIndex === 0
      const isWelcomeEvent = event.type === 'welcome'

      if (isFirstEvent && !isWelcomeEvent) {
        // if the first event is not welcome, it is most likely a reconnect and
        // if it's not a reconnect something is very wrong
        return throwError(
          new Error(
            event.type === 'reconnect'
              ? 'Could not establish EventSource connection'
              : `Received unexpected type of first event "${event.type}"`
          )
        )
      }

      return of(event)
    }),
    share()
  )

  // Split event stream
  const [welcomeEvent$, mutationEvent$] = event$.pipe(partition(ev => ev.type === 'welcome'))

  return merge(welcomeEvent$.pipe(take(1)), mutationEvent$)
}
