import React from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import useFetchData from '../API/FetchApi';
import Alert from 'react-bootstrap/Alert'

// const testData = [
//     {key: 'row-1-test',
//         cells: [
//     {
//         key: "aa",
//         content: "test"
//     },
//             {
//                 key: 'bb',
//                 content: 'test'
//             } ]
//     },
//     {key: 'row-1-test2',
//         cells: [
//     {
//         key: "aa",
//         content: "test2"
//     },
//             {
//                 key: 'bb',
//                 content: 'test2'
//             } ]
//     }
// ]

// const testCells = [
//                   {
//                       key:'aa',
//                       content:'aa',
//                       isSortable:true,
//                       width:undefined,
//                       soundTruncate : false,
//                   },
//                   {
//                       key:'bb',
//                       content:'bb',
//                       isSortable:true,
//                       width:undefined,
//                       shouldTruncate: false,
//                   }
//               ]

const arrangeData = (data, cols) => data.map(row => (
    {
        key: `row-${row[1]}`,
        cells: row.map((value, index) => (
            {
                key: cols[index],
                content: value
            }
        ))
    }
));


const arrangeColumns = cols => cols.map(col => (
    {
        key: col,
        content: col,
        isSortable: true,
        width: undefined,
        shouldTruncate: false
    }
));

const ViewTable = () => {
    const [fetchData, data] = useFetchData();
    console.log(data.content);

    return (
        <div className="table">
            {!data.isError ?
                <DynamicTable
                          head={{cells:arrangeColumns(data.columns)}}
                          rows={arrangeData(data.content, data.columns)}
                          defaultPage={1}
                          loadingSpinnerSize="large"
                          isLoading={data.isLoading}
                          isFixedSize
                          emptyView={ <Alert key='bootsrap-alert-1' variant='warning'> Empty table </Alert> }
                />
                : <Alert key='bootsrap-alert-1' variant='danger'> Server error :\ </Alert>
            }
        </div>
    );
}

export default ViewTable;