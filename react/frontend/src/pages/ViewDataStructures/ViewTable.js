import React from 'react';
import DynamicTable from '@atlaskit/dynamic-table';
import Tabs from '@atlaskit/tabs'
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

const arrangeData = ({content, cols}) => content.map(row => (
    {
        key: `row-${row[0]}`,
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

const tabs = [
    {
        label: 'class',
        page: 1
    },
    {
        label: 'family',
        page: 1
    },
    {
        label: 'species',
        page: 1
    },
    {
        label: 'specimen',
        page: 1
    }
]

const ViewTable = () => {
    const [fetchData, data] = useFetchData(arrangeData);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        setPage(1);
    }, [data.arrangedContent]);

    return (
        <div className="table">
            <Tabs tabs={tabs} onSelect={selected => fetchData({type: selected.label})} />
            {!data.isError ?
                <DynamicTable
                    head={{cells:arrangeColumns(data.columns)}}
                    rows={data.arrangedContent}
                    defaultPage={1}
                    rowsPerPage={10}
                    page={page}
                    loadingSpinnerSize="large"
                    isLoading={data.isLoading}
                    isFixedSize
                    emptyView={ <Alert key='bootsrap-alert-1' variant='warning'> Empty table </Alert> }
                    // defaultSortKey="nome"  // TODO: not working
                    defaultSortOrder="ASC"
                />
                : <Alert key='bootsrap-alert-1' variant='danger'> Server error :\ </Alert>
            }
        </div>
    );
}

export default ViewTable;