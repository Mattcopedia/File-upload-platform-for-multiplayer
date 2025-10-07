'use client';
import { ChangeEvent, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import DeleteIcon from '@/assets/icons/delete.svg';
import File from '@/assets/icons/file.svg';
import DeleteIcon1 from '@/assets/icons/tableDel.svg';
import FileDeleteModal from '@/components/modules/modals/delete-file-modal';
import PageHeader from '@/components/modules/page-header';
import styles from '@/components/pages/Files/index.module.css';
import DateFilters from '@/components/ui/date-picker/date-filter';
import EmptyTable from '@/components/ui/empty-table';
import { Pagination } from '@/components/ui/pagination';
import SearchInputComponent from '@/components/ui/search';
import TableSkeleton from '@/components/ui/TableSkeleton';
import { ALL_TIME_FILTER, APP_ROUTES, RolesEnum } from '@/constants';
import { useDateSelector } from '@/hooks/useDateSelector';
import { useFiles } from '@/hooks/useFiles';
import { FilesApi } from '@/services/files';
import { FilesDetails } from '@/services/files/type';
import { downloadExportCSV } from '@/utils/download-csv-file';

type ModalType = 'delete' | null;

const FilePageComponent = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FilesDetails[]>([]);

  const { data: session } = useSession();
  const user = session?.user;
  const hasDeleteAuth = user?.role === RolesEnum.ADMIN;

  const headers = ['File Name', 'Uploader', 'Page Count', 'Status', 'Date Uploaded'];

  const facilityId = user?.facility.id;
  const { startAndEndDate, filter } = useDateSelector();
  const date = startAndEndDate;

  const [modalState, setModalState] = useState<{
    type: ModalType;
    files: string[] | null;
  }>({ type: null, files: null });

  const toggleSelectFile = (file: FilesDetails) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.id === file.id) ? prev.filter((f) => f.id !== file.id) : [...prev, file]
    );
  };

  const isFileSelected = (fileId: string) => {
    return selectedFiles.some((f) => f.id === fileId);
  };

  const {
    data: filesData,
    isLoading,
    isError,
    isFetched,
    error,
  } = useFiles({
    facilityId,
    page,
    rowsPerPage,
    searchQuery,
    startAndEndDate,
    filter,
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      if (!facilityId) throw new Error('Missing facilityId');

      const exportParams: {
        startDate?: string;
        endDate?: string;
        allTime?: string;
      } = {};

      if (filter === ALL_TIME_FILTER) {
        exportParams.allTime = 'true';
      } else if (startAndEndDate.startDate && startAndEndDate.endDate) {
        exportParams.startDate = dayjs.unix(startAndEndDate.startDate).format('YYYY-MM-DD');
        exportParams.endDate = dayjs.unix(startAndEndDate.endDate).format('YYYY-MM-DD');
      }

      return await FilesApi.exportFiles(exportParams, facilityId);
    },

    onSuccess: (csvBlob) => {
      downloadExportCSV({ csvBlob, startAndEndDate, facilityId, filter });
    },
    onError: () => {
      toast.error('Error exporting CSV:');
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (files: string[]) => {
      if (!facilityId) throw new Error('Missing facilityId');
      return FilesApi.deleteFiles(facilityId, files);
    },
    onSuccess: (res) => {
      if (res.notFound?.length) {
        toast.error(`Not found: ${res.notFound.join(', ')}`);
      }
      if (res.moved?.length || selectedFiles.length) {
        toast.success(`${res.moved?.length} Selected files deleted successfully.`);
      }
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setSelectedFiles([]);
      setModalState({ type: null, files: null });
      console.log(`${res.moved?.length} Selected files deleted successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting files');
    },
  });

  const handleBulkDelete = (files: string[]) => {
    bulkDeleteMutation.mutate(files);
  };

  const handleChangePage = (_: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const totalPages = filesData?.meta.totalPages || 0;

  const formatted = (timestamp: string) => {
    return dayjs(timestamp).format('MMMM DD, YYYY [at] h:mma');
  };

  const openModal = (type: ModalType, files: FilesDetails[]) => {
    setModalState({ type, files: files.map((f) => f.filename) });
  };

  const closeModal = () => {
    setModalState({ type: null, files: null });
  };
  const ischecked = () => {
    return (
      (filesData?.items?.length || 0) > 0 &&
      selectedFiles.length === (filesData?.items?.length || 0)
    );
  };
  const isIndeterminate = (): boolean => {
    return selectedFiles.length > 0 && selectedFiles.length < (filesData?.items?.length || 0);
  };

  console.log('File Data was fetched');

  return (
    <>
      <FileDeleteModal
        open={modalState.type === 'delete'}
        Icon={DeleteIcon}
        handleCloseModal={closeModal}
        actionText={`Are you sure you want to delete${selectedFiles.length > 1 ? ' these files' : ' this file'}?`}
        actionButtonText={selectedFiles.length > 1 ? 'Yes, Delete Them' : 'Yes, Delete it'}
        descriptionText={`${
          selectedFiles.length > 1 ? 'These files ' : 'This file'
        } will be permanently removed`}
        files={modalState.files}
        action={handleBulkDelete}
        isPending={bulkDeleteMutation.isPending}
        isDelete
      />

      <Box className={styles.files__container}>
        <PageHeader
          title='Files'
          actions={
            <>
              <Stack display={'flex'} flexDirection={'row'} gap={5}>
                {hasDeleteAuth && selectedFiles.length > 0 && (
                  <Button
                    color='error'
                    variant='delete'
                    onClick={() => openModal('delete', selectedFiles)}
                    startIcon={<DeleteIcon1 />}
                  >
                    Delete {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                  </Button>
                )}

                <Button
                  href={APP_ROUTES.UPLOAD_FILE}
                  component={Link}
                  startIcon={<AddIcon />}
                  variant='contained'
                >
                  Upload a File
                </Button>

                <Button
                  loading={exportMutation.isPending}
                  onClick={() => exportMutation.mutate()}
                  startIcon={<FileDownloadOutlinedIcon />}
                  variant='outlined'
                >
                  Export CSV
                </Button>
              </Stack>
            </>
          }
        />
        {!isLoading &&
        isFetched &&
        !isError &&
        filesData?.items?.length === 0 &&
        searchQuery === '' &&
        !date ? (
          <EmptyTable
            text='There are no files available - please click the button above to upload a new file'
            buttonText='Upload a File'
            startIcon
            showButton={true}
          />
        ) : (
          <Paper variant='tableWrapper'>
            <Box p={4}>
              <TableContainer className={styles.files__table}>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent={'space-between'}
                  className={styles.list__search}
                >
                  <DateFilters />
                  <Box className={styles.files__search__container}>
                    <SearchInputComponent
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder='Search file'
                    />
                  </Box>
                </Stack>

                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {hasDeleteAuth && (
                        <TableCell padding='checkbox'>
                          <Checkbox
                            indeterminate={isIndeterminate()}
                            checked={ischecked()}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(filesData?.items || []);
                              } else {
                                setSelectedFiles([]);
                              }
                            }}
                            color='primary'
                          />
                        </TableCell>
                      )}
                      {headers.map((header) => (
                        <TableCell key={header}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={headers.length}>
                          <TableSkeleton />
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={headers.length} align='center'>
                          Error loading files:
                          {(error as Error)?.message || 'Unknown error'}
                        </TableCell>
                      </TableRow>
                    ) : filesData?.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={headers.length} align='center'>
                          No files found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filesData?.items.map((file) => (
                        <TableRow key={file.id}>
                          {hasDeleteAuth && (
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={isFileSelected(file.id)}
                                onChange={() => toggleSelectFile(file)}
                                color='primary'
                              />
                            </TableCell>
                          )}
                          <TableCell className={styles.files__table_cell}>
                            <Typography display={'flex'} flexDirection={'row'} gap={2}>
                              {' '}
                              <Typography component={'span'}>
                                <File />
                              </Typography>{' '}
                              {file.filename ? file.filename : '--'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {file?.user?.firstName ? file?.user?.firstName : '--'}{' '}
                              {file?.user?.lastName ? file?.user?.lastName : '--'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{file?.pageCount ? file?.pageCount : '--'} </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{file?.status ? file?.status : '--'} </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {file?.createdAt ? formatted(file?.createdAt) : '--'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Pagination
                count={totalPages}
                page={page}
                rowsPerPage={rowsPerPage}
                onChange={handleChangePage}
                onPageChange={handleChangeRowsPerPage}
                shape='rounded'
              />
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default FilePageComponent;
