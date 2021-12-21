import React, {
  useEffect,
  useMemo,
  createContext,
  useRef,
  useContext,
  useCallback
} from 'react'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Location, History, To } from 'history'
import { ParsedUrlQuery, stringify } from 'querystring'

// @ts-ignore
import { pathToRegexp } from 'next/dist/compiled/path-to-regexp'

interface match {
  params: ParsedUrlQuery
  isExact: boolean
  path: string
  url: string
}

type BrowserRouterState = { [key: string]: any } | undefined
type BrowserRouterContext = {
  state: React.MutableRefObject<BrowserRouterState>
}

const BrowserRouterCtx = createContext<BrowserRouterContext>({
  state: typeof window !== 'undefined' && window.history?.state
})

export function useBrowserRouterCtx() {
  return useContext(BrowserRouterCtx)
}

export const useLocation = (): Location => {
  const { asPath, query } = useRouter()

  const state = typeof window !== 'undefined' && window.history?.state?.options

  const location = useMemo(
    () => ({
      pathname: asPath.replace(/#c-(.*)/, ''), // replace hash
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

export const useRouteMatch = (path: string | string[]): match | null => {
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
  const state = useRef<BrowserRouterState>({})
  return (
    <BrowserRouterCtx.Provider value={{ state }}>
      {children}
    </BrowserRouterCtx.Provider>
  )
}

export const Switch = ({
  children
}: React.PropsWithChildren<{ path: string | string[] }>) => {
  const { asPath } = useRouter()

  const childrenMatch = React.Children.toArray(children).find(element => {
    if (!React.isValidElement(element)) return
    const { path } = element.props
    return matchRouteWithPath(path, asPath)
  })

  return <React.Fragment>{childrenMatch}</React.Fragment>
}

export const Route = ({
  children,
  path
}: React.PropsWithChildren<{ path: string | string[] }>) => {
  const match = useRouteMatch(path)

  return (match && children) || <>{null}</>
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
  const { push, asPath } = useRouter()

  useEffect(() => {
    const targetPath = typeof to === 'string' ? to : to.pathname
    if (targetPath && asPath !== targetPath) push(targetPath)
  }, [to, asPath, push])

  return null
}
