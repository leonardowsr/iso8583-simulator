export const CONFIG = {
	name: "Woovi Challenger",
	description: "An e-commerce platform built with Next.js and Tailwind CSS.",
	url: "https://woovi-challenger.example.com",
}


export interface NavItem {
   title: string
   href?: string
   disabled?: boolean
   external?: boolean
   icon?: any
   label?: string
}
interface DocsConfig {
   mainNav: NavItem[]
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   mainNav: [
      {
         title: 'Documentation',
         href: '/docs',
      },

      {
         title: 'GitHub',
         href: 'https://github.com/sesto-dev',
         external: true,
      },
   ],
   sidebarNav: [
      {
         title: 'Products',
         href: '/products',
      },
      {
         title: 'Blog',
         href: '/blog',
      },
      {
         title: 'Orders',
         href: '/profile/orders',
      },
      {
         title: 'Payments',
         href: '/profile/payments',
      },
      {
         title: 'Contact',
         href: '/contact',
      },
      {
         title: 'About',
         href: '/about',
      },
   ],
}