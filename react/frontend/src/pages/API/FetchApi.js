import React from 'react';
import axios from 'axios';

// const URL = window.origin;
const URL = 'http://localhost:5000'
const FETCH_API_ENDPOINT = `${URL}/api/fetch/`;

const dataReducer = (state, action) => {
    switch (action.type) {
        case 'DATA_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
                request: action.payload
            };
        case 'DATA_FETCH_SUCCESS':
            return {
                ...state,
                content: action.payload.content,
                columns: action.payload.columns,
            };
        case 'DATA_FETCH_ARRANGED':
            return {
                ...state,
                isLoading: false,
                isError: false,
                arrangedContent: action.payload
            };
        case 'DATA_FETCH_ERROR':
            return {
                ...state,
                isLoading: false,
                isError: true
            };
        default:
            throw new Error();
    }
}


const useFetchData = dataArrangerCallback => {
    const [data, dispatchData] = React.useReducer(
        dataReducer,
        {request: {}, columns: [], content: [], arrangedContent: [], isLoading: false, isError: false}
    );

    const [fetchArgs, setFetchArgs] = React.useState({type: 'class', filterId: null});

    const [url, setUrl] = React.useState(
        `${FETCH_API_ENDPOINT}${fetchArgs.type}`
    );

    React.useEffect(() => {
        if (!fetchArgs.filterId)
            setUrl(`${FETCH_API_ENDPOINT}${fetchArgs.type}`);
        else
            setUrl(`${FETCH_API_ENDPOINT}${fetchArgs.type}?upper_id=${fetchArgs.filterId}`);
    }, [fetchArgs]);


    const handleFetchData = React.useCallback(async () => {
        dispatchData({ type: 'DATA_FETCH_INIT', payload: fetchArgs });
        try {
            const result = await axios.get(url);
            dispatchData({ type: 'DATA_FETCH_SUCCESS', payload: result.data });
            const arrangedContent = dataArrangerCallback({type: fetchArgs.type, id: fetchArgs.filterId, cols: result.data.columns, content: result.data.content, prevContent: data.arrangedContent});
            dispatchData({ type: 'DATA_FETCH_ARRANGED', payload: arrangedContent });
        } catch (err) {
            console.log(err);
            dispatchData({ type: 'DATA_FETCH_ERROR' });
        }
    }, [url]);

    React.useEffect(() => {
        handleFetchData();
    }, [handleFetchData]);

    // const handleFetchStart = event => {
    //     setFetchType(event.target.value);
    // }

    return [setFetchArgs, data];
};

export default useFetchData;