import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { client } from "../utils/client";

const Logs = () => {
  const [data, setData] = useState<any[]>([]);
  const [streamLog, setStreamLog] = useState<any[]>([]);
  const [paginations, setPagination] = useState<any>();
  const [currentPage, setCurrentPage] = useState(0);

  const clickToCopy = (e: any) => {
    const content = e.target.textContent.slice(
      1,
      e.target.textContent.length - 1
    );
    navigator.clipboard.writeText(content);
  };

  const fetchLogs = async (page = 0) => {
    const { data } = await client.get(`/api/logs/all?page=${page}`);
    const { logs, ...rest } = data.data;
    setData(logs);
    setPagination(rest);
  };

  const handleChangePage = (_: any, page: number) => {
    setCurrentPage(page)
  };

  useEffect(() => {
    const eventSource = new EventSource(`/api/logs/stream?page=${currentPage}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStreamLog((current) => [...current, ...data.stream]);
      const {
        latest: { logs, ...rest },
      } = data;
      console.log(logs)
      setData(logs);
      setPagination(rest);
    };
    return () => eventSource.close();
  }, [currentPage]);

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {data &&
                data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data
                .map((log) => (
                  <TableRow key={log._id}>
                    {Object.keys(log).map((key) => {
                      if (key === "date") {
                        return (
                          <TableCell key={log._id + key}>
                            {new Date(log[key]).toLocaleString()}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={log._id + key}>{log[key]}</TableCell>
                      );
                    })}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {paginations && (
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={paginations.total}
          rowsPerPage={10}
          page={parseInt(paginations.page)}
          onPageChange={handleChangePage}
        />
      )}
      <Box
        sx={{
          bgcolor: "black",
          p: 1,
          maxHeight: "200px",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {streamLog &&
          streamLog
            .slice(0)
            .reverse()
            .map((request: any) => (
              <Box key={request._id}>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    mb: 1,
                    color:
                      request.method === "POST"
                        ? "primary.main"
                        : request.method === "GET"
                        ? "info.main"
                        : request.method === "PUT"
                        ? "warning.main"
                        : "secondary.main",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        request.statusCode.toString().startsWith("4") ||
                        request.statusCode.toString().startsWith("5")
                          ? "#FF4842"
                          : "#00AB55",
                      color: "black",
                      padding: "0.1rem 0.3rem",
                      borderRadius: "0.3rem",
                    }}
                  >
                    {request.statusCode}
                  </span>{" "}
                  <span style={{ fontWeight: "600" }}>{request.method}</span>{" "}
                  <span style={{ color: "white" }}>{request.route}</span>{" "}
                  <span
                    style={{ color: "hsla(0, 0%, 100%, 0.5)", cursor: "copy" }}
                    onClick={clickToCopy}
                  >
                    ({request._id})
                  </span>
                </Typography>
              </Box>
            ))}
      </Box>
    </Box>
  );
};

export default Logs;
