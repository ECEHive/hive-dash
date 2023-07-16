import { useRouter } from 'next/router'

export default function Printing(props) {
    const router = useRouter()
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
        router.push('/config/website')
    }
}