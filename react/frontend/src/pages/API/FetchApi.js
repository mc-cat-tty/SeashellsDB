import React from 'react';
import axios from 'axios';

const URL = window.origin;
const FETCH_API_ENDPOINT = `${URL}/api/fetch?type=`;

const dataReducer = (state, action) => {
    switch (action.type) {
        case 'DATA_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case 'DATA_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                content: action.payload
            };
        case 'DATA_FETCH_ERROR':
            return {
                ...state,
                isLoading: false,
                isError: true
            };
    }
}


const useFetchData = () => {
    const [data, dispatchData] = React.useReducer(
        dataReducer,
        {content:[], isLoading: false, isError: false}
    );

    const [fetchType, setFetchType] = React.useState('class');

    const [url, setUrl] = React.useState(
        `${FETCH_API_ENDPOINT}${fetchType}`
    );

    React.useEffect(() => {
        setUrl(`${FETCH_API_ENDPOINT}${fetchType}`);
    }, [fetchType]);

    const handleFetchData = React.useCallback(async () => {
        dispatchData({ type: 'DATA_FETCH_INIT' });
        try {
            const result = await axios.get(url);
            dispatchData({ type: 'DATA_FETCH_SUCCESS', payload: result.data })
        } catch {
            dispatchData({ type: 'DATA_FETCH_ERROR' });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchData();
    }, [handleFetchData]);

    // const handleFetchStart = event => {
    //     setFetchType(event.target.value);
    // }

    return [setFetchType, data];
};

export default useFetchData;