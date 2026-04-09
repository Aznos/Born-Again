import { Helmet } from 'react-helmet-async'

interface SEOProps {
    title?: string
    description?: string
}

const DEFAULT_TITLE = 'Born Again'
const DEFAULT_DESC = 'A free Bible reading app for new and growing believers. Plain English summaries, scripture, and commentary — no paywall, no subscription.'

export default function SEO({ title, description }: SEOProps) {
    const fullTitle = title ? `${title} — Born Again` : DEFAULT_TITLE
    const desc = description ?? DEFAULT_DESC

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content="website" />
            <meta name="theme-color" content="#1d1d1b" />
        </Helmet>
    )
}