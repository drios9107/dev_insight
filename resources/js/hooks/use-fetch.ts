
export function useFetch() {

    const get = async (url: string, setItems: (list: []) => void, labelField: string = 'name') => {
        return fetch(url)
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    setItems(data.data.map((i: any) => ({ value: i.id, label: i?.[labelField] })))
                }
            })
            .catch(err => console.log('***fetch error', err))
    }

    return { get }
}
