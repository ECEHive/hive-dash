import { useCallback } from 'react';

import { useToast } from '@chakra-ui/react';

import { useAuth } from '@/contexts/AuthContext';

export default function useRequest() {
    const toast = useToast();
    const { userId } = useAuth();

    const request = useCallback(
        (url, data) => {
            console.log('REQUEST');
            return new Promise((resolve, reject) => {
                fetch(url, {
                    ...data,
                    headers: {
                        ...data?.headers,
                        Authorization: `Bearer ${userId || ''}`
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
                        console.log('wassap');
                        resolve(data);
                    })
                    .finally(() => {
                        reject();
                    });
            });
        },
        [userId, toast]
    );

    return request;
}
