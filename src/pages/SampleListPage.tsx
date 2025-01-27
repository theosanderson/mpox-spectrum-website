import { Link, useLocation } from 'react-router-dom';
import { PageHeaderWithReturn } from '../components/PageHeaderWithReturn';
import { useQuery } from '../helpers/query-hook';
import { useExploreUrl } from '../helpers/explore-url';
import { DetailsSampleData } from '../data/DetailsSampleDataset';
import { useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { potentiallyPartialDateToString } from '../helpers/date-cache';

export const SampleListPage = () => {
  const searchString = useLocation().search;
  const { selector } = useExploreUrl();
  const { data } = useQuery(signal => DetailsSampleData.fromApi(selector, signal), [selector]);

  const columns: GridColDef[] = [
    {
      field: 'strain',
      headerName: 'Strain',
      minWidth: 250,
      renderCell: (params: GridRenderCellParams<string>) =>
        params.value ? (
          <Link to={`${encodeURIComponent(params.value)}`}>
            <button className='underline'>
              <span className='w-60 text-ellipsis overflow-hidden block text-left'>{params.value}</span>
            </button>
          </Link>
        ) : (
          <></>
        ),
    },
    { field: 'sraAccession', headerName: 'SRA accession', minWidth: 150 },
    { field: 'date', headerName: 'Date', minWidth: 150 },
    { field: 'region', headerName: 'Region', minWidth: 200 },
    { field: 'country', headerName: 'Country', minWidth: 250 },
    { field: 'clade', headerName: 'Clade', minWidth: 100 },
    { field: 'host', headerName: 'Host', minWidth: 200 },
  ];

  const rows = useMemo(() => {
    if (!data) {
      return undefined;
    }
    return data.payload.map((d, index) => ({
      ...d,
      date: potentiallyPartialDateToString(d),
      id: index,
    }));
  }, [data]);

  if (!rows) {
    return <>Loading...</>;
  }

  return (
    <>
      <PageHeaderWithReturn title='Selected samples' to={`../explore${searchString}`} />

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          density={'compact'}
          autoHeight={true}
          initialState={{
            sorting: {
              sortModel: [{ field: 'date', sort: 'desc' }],
            },
          }}
          rowsPerPageOptions={[100, 200, 500, 1000]}
        />
      </div>
    </>
  );
};
