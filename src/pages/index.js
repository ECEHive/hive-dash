// import { Link } from '@chakra-ui/react';
// import Head from 'next/head';
// import NextLink from 'next/link';
// export default function Home() {
//     return (
//         <>
//             <Head>
//                 <title>hive</title>
//             </Head>
//             <Link
//                 as={NextLink}
//                 href={'/printing/dashboard'}
//             >
//                 dashboard
//             </Link>
//         </>
//     );
// }
import { useRouter } from 'next/router';

export default function Printing(props) {
    const router = useRouter();
    // Make sure we're in the browser
    if (typeof window !== 'undefined') {
        router.push('/printing/dashboard');
    }
}
