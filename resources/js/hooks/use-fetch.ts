import { useCallback } from "react";

export function useFetch() {
    const get = useCallback(async (
        url: string,
        setItems: (list: []) => void,
        labelField: string = 'name',
    ) => {
        return fetch(url)
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setItems(
                        data.data.map((i: any) => ({
                            value: i.id,
                            label: i?.[labelField],
                        })),
                    );
                }
            })
            .catch((err) => console.log('***fetch error', err));
    }, []);

    const getOne = useCallback(async (
        url: string,
    ) => {
        return fetch(url)
            .then(async (res) => {
                if (res.ok) {
                    return await res.json();
                }
            })
            .catch((err) => console.log('***fetch error', err));
    }, []);

    return { get, getOne };
}
