import { useCallback } from 'react';

import { useToast } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase';

export default function useRequest() {
    const toast = useToast();
    const [user, loading, error] = useAuthState(auth);

    const request = useCallback(
        (url, data) => {
            return new Promise((resolve, reject) => {
                function doReq(token = null) {
                    fetch(url, {
                        ...data,
                        headers: {
                            ...data?.headers,
                            Authorization: `Bearer ${token || ''}`
                        }
                    })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.json();
                            } else if (res.status === 401) {
                                return res.json().then((json) => {
                                    toast({
                                        title: 'Error',
                                        description: json.message,
                                        status: 'error',
                                        duration: 5000
                                    });
                                    throw new Error(json.message);
                                });
                            } else {
                                reject(res.json());
                            }
                        })
                        .catch((err) => {
                            console.log('rejected');
                            reject(err);
                        })
                        .then((data) => {
                            resolve(data);
                        });
                }

                if (user) {
                    user.getIdToken().then((token) => {
                        doReq(token);
                    });
                } else {
                    doReq();
                }
            });
        },
        [user, toast]
    );

    return request;
}
