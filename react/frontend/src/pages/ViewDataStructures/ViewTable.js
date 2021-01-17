import React from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import useFetchData from '../API/FetchApi';

const data = [
    {key: 'row-1-test',
        cells: [
    {
        key: "aa",
        content: "test"
    },
            {
                key: 'bb',
                content: 'test'
            } ]
    },
    {key: 'row-1-test2',
        cells: [
    {
        key: "aa",
        content: "test2"
    },
            {
                key: 'bb',
                content: 'test2'
            } ]
    }
]

const ViewTable = () => {
    const [fetchData, data] = useFetchData();
    console.log(data.content);

    return (
        <div className="table">
            <DynamicTable caption='table'
                          head={{cells:[
                                  {
                                      key:'aa',
                                      content:'aa',
                                      isSortable:true,
                                      width:undefined,
                                      soundTruncate : false,
                                  },
                                  {
                                      key:'bb',
                                      content:'bb',
                                      isSortable:true,
                                      width:undefined,
                                      soundTruncate : false,
                                  }
                              ]}}
                          rows={data}
                          defaultPage={1}
                          loadingSpinnerSize="large"
                          isLoading={false}
                          isFixedSize
            />
        </div>
    );
}

export default ViewTable;