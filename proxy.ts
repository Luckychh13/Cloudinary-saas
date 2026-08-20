import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/home',
  '/sign-in',
  '/sign-up',
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware(
  async (auth, req) => {
    const { userId } = await auth()
    const currentUrl = new URL(req.url)
    const isAccessingDashBoard = currentUrl.pathname === '/home'
    const isApiRequest = currentUrl.pathname.startsWith('/api')

    if(userId && !isAccessingDashBoard && isPublicApiRoute(req)){
        return NextResponse.redirect(new URL('/home', req.url))
    }

    if(!userId){
        
        if(!isPublicApiRoute(req) && !isPublicRoute(req)){
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }
        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in', req.url))
        }
    }

    return NextResponse.next()
  },
  
)

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ]
}