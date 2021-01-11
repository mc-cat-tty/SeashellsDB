import React from 'react';
import DynamicTable from '@atlaskit/dynamic-table';

const Table = () => (
    <div className="table">
        <DynamicTable caption='table'
          head={{cells:[
          {
              key:'kj',
              content:'jj',
              isSortable:true,
              width:undefined,
              soundTruncate : false,
          },
              {
              key:'test',
              content:'nn',
              isSortable:true,
              width:undefined,
              soundTruncate : false,
          }
              ]}}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
        />
    </div>
);

export default Table;