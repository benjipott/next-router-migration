import React, { useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Location, History, To } from 'history'
import { ParsedUrlQuery, stringify } from 'querystring'

import { pathToRegexp } from 'path-to-regexp'

interface match {
  params: ParsedUrlQuery
  isExact: boolean
  path: string
  url: string
}

const QUERY_AND_HASH_MATCHER = /(\?|#c-).*/

export const useLocation = (): Location => {
  const { asPath, query } = useRouter()

  const state = typeof window !== 'undefined' && window.history?.state?.options

  const location = useMemo(
    () => ({
      pathname: asPath.replace(QUERY_AND_HASH_MATCHER, ''), // replace hash
      search: stringify(query),
      hash: '',
      state,
      key: asPath
    }),
    [asPath, state, query]
  )

  return location
}

export const useParams = () => {
  const { query } = useRouter()

  return query
}

export const matchRouteWithPath = (
  path: string | string[],
  matchPath: string
): boolean => {
  if (!path) {
    return false
  }

  if (path === '*') {
    return true
  }

  const regex = pathToRegexp(path)

  let match
  if (typeof path === 'string') {
    match = new RegExp(regex).exec(matchPath)
  }

  if (typeof path === 'object') {
    const paths = path
    match = paths.find(subpath => !!new RegExp(subpath).exec(matchPath))
  }

  return !!match
}

export const useRouteMatch = (path?: string | string[]): match | null => {
  const { query, asPath, pathname } = useRouter()

  let match = !path || matchRouteWithPath(path, asPath)

  return (
    (match && {
      params: query,
      isExact: match && pathname === path,
      path: asPath,
      url: asPath
    }) ||
    null
  )
}

export const useHistory = (): History => {
  const {
    push,
    replace,
    back: goBack,
    reload: go,
    beforePopState
  } = useRouter()
  const location = useLocation()
  const listen = useCallback(() => ({}), [])

  const goForward = beforePopState as any

  const history = useMemo<History>(
    () =>
      ({
        length: 0,
        action: 'POP',
        location,
        push: (to: To, state?: any) => {
          const isUrl = typeof to === 'string'
          const path = isUrl ? to : to.pathname

          if (path) {
            push(path, undefined, {
              shallow: true,
              ...(typeof state === 'object' && state)
            })
          }

          console.log('RouterMigration-> history push', path, state)
        },
        replace: (to: To, state?: any) => {
          const isUrl = typeof to === 'string'
          const path = isUrl ? to : to.pathname

          if (path) {
            replace(path, undefined, {
              shallow: true,
              ...(typeof state === 'object' && state)
            })
          }

          console.log('RouterMigration-> history replace', path, state)
        },
        go,
        goBack,
        goForward,
        listen
      } as any),
    [location, push, replace, go, goBack, goForward, listen]
  )

  return history
}

export function BrowserRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export const Switch = ({
  children
}: React.PropsWithChildren<{ path?: string | string[] }>) => {
  const { asPath } = useRouter()

  const childrenMatch = React.Children.toArray(children).find(element => {
    if (!React.isValidElement(element)) return
    const { path, index } = element.props
    const testPath = path || (index && '/')
    console.log({
      path,
      index,
      children,
      element,
      testPath,
      asPath,
      isMatching: matchRouteWithPath(testPath, asPath)
    })
    return testPath && matchRouteWithPath(testPath, asPath)
  })

  return <React.Fragment>{childrenMatch}</React.Fragment>
}

export const Routes = Switch

export const Route = ({
  children,
  element,
  path,
  index,
  exact
}: React.PropsWithChildren<{
  exact?: boolean
  index?: boolean
  path?: string
  element?: React.ReactNode
}>) => {
  const match = useRouteMatch(path)

  return (
    (match && (exact ? match.isExact : true) && (
      <Switch>
        {element}
        {children}
      </Switch>
    )) || <>{null}</>
  )
}

interface LinkProps extends NextLinkProps {
  to: string
}

export const Link = ({
  children,
  to,
  locale,
  scroll,
  href,
  replace,
  prefetch,
  passHref = true,
  shallow = true,
  ...props
}: React.PropsWithChildren<LinkProps>) => (
  <NextLink
    href={href || to}
    {...{ passHref, replace, locale, scroll, prefetch, shallow }}
  >
    <a {...props}>{children}</a>
  </NextLink>
)

export const Redirect = ({ to }: { to: To }) => {
  const { replace, asPath } = useRouter()

  useEffect(() => {
    const targetPath = typeof to === 'string' ? to : to.pathname
    if (targetPath && asPath !== targetPath) {
      replace(targetPath, typeof to === 'object' ? to : undefined)
    }
  }, [to, asPath, replace])

  return null
}
