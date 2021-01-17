import React from 'react';
import TableTree, {Rows, Row, Cell} from '@atlaskit/table-tree';
import Spinner from '@atlaskit/spinner'
import useFetchData from '../API/FetchApi';
import Alert from "react-bootstrap/Alert";

// const data = {
//   "children": [
//     {
//       "title": "Chapter 1: Clean Code",
//       "page": 1,
//       "numbering": "1",
//       "children": [
//         {
//           "title": "There Will Be Code",
//           "page": 2,
//           "numbering": "1.1",
//           "children": []
//         },
//         {
//           "title": "Bad code",
//           "page": 3,
//           "numbering": "1.2",
//           "children": []
//         },
//         {
//           "title": "The Total Cost of Owning a Mess",
//           "page": 4,
//           "numbering": "1.3",
//           "children": [
//             {
//               "title": "The Gran Redesign in the Sky",
//               "page": 5,
//               "numbering": "1.3.1",
//               "children": []
//             },
//             {
//               "title": "Attitude",
//               "page": 5,
//               "numbering": "1.3.2",
//               "children": []
//             },
//             {
//               "title": "The Primal Conundrum",
//               "page": 6,
//               "numbering": "1.3.3",
//               "children": []
//             },
//             {
//               "title": "The Art of Clean Code",
//               "page": 6,
//               "numbering": "1.3.4",
//               "children": []
//             },
//             {
//               "title": "What Is Clean Code",
//               "page": 7,
//               "numbering": "1.3.5",
//               "children": []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "title": "Chapter 2: Meaningful names",
//       "page": 17,
//       "numbering": "2",
//       "children": []
//     },
//     {
//       "title": "Chapter 3: Functions",
//       "page": 17,
//       "numbering": "3",
//       "children": [
//         {
//           "title": "Small!",
//           "page": 34,
//           "numbering": "3.1",
//           "children": [
//           ]
//         },
//         {
//           "title": "Do One Thing",
//           "page": 35,
//           "numbering": "3.2",
//           "children": [
//           ]
//         },
//         {
//           "title": "One Level of Abstraction per Function",
//           "page": 36,
//           "numbering": "3.3",
//           "children": [
//           ]
//         },
//         {
//           "title": "Switch statements",
//           "page": 37,
//           "numbering": "3.4",
//           "children": [
//           ]
//         },
//         {
//           "title": "Use Descriptive Names",
//           "page": 39,
//           "numbering": "3.5",
//           "children": [
//           ]
//         },
//         {
//           "title": "Function Arguments",
//           "page": 40,
//           "numbering": "3.6",
//           "children": [
//           ]
//         },
//         {
//           "title": "Have No Side Effects",
//           "page": 44,
//           "numbering": "3.7",
//           "children": [
//             {
//               "title": "Output Arguments",
//               "page": 45,
//               "numbering": "3.7.1",
//               "children": [
//
//               ]
//             }
//           ]
//         },
//         {
//           "title": "Command Query Separation",
//           "page": 45,
//           "numbering": "3.8",
//           "children": [
//           ]
//         }
//       ]
//     },
//     {
//       "title": "Chapter 4: Comments",
//       "page": 53,
//       "numbering": "4",
//       "children": []
//     },
//     {
//       "title": "Chapter 5: Formatting",
//       "page": 75,
//       "numbering": "5",
//       "children": []
//     }
//
//   ]
// }

const headers = ["name", "id", "type"];

const arrangeData = (type, data, cols) => data.map(row => (
    {
        'name': row[cols.indexOf('nome')],
        'id': row[cols.indexOf('id')],
        'type': type,
        'children': []
    }
));

const ViewTableTree = () => {
  const [fetchData, data] = useFetchData();
  let type = 'class';
  React.useEffect(() => {
      fetchData(type);
  }, []);

  return (
    <div className="tabletree">
        <TableTree
            headers={headers}
            columns={headers}
            columnWidths={['700px', '700px', '700px']}
        >
            {data.isLoading && <div style={{position: 'relative', left: '45%', top: '5px'}}> <Spinner size='large' /> </div>}
            {!data.isLoading &&
                <Rows
                items={arrangeData(type, data.content, data.columns)}
                render={({name, id, type, children}) => (
                    <Row
                        itemId={name}
                        items={children}
                        hasChildren={children.length > 0}
                        onExpand={() => {console.log('test')}}
                    >
                        <Cell singleLine>{name}</Cell>
                        <Cell singleLine>{id}</Cell>
                        <Cell singleLine>{type}</Cell>
                    </Row>
                )}/>
            }
            {data.isError && <Alert key='bootsrap-alert-1' variant='danger'> Server error :\ </Alert>}
        </TableTree>
    </div>
  );
}

export default ViewTableTree;