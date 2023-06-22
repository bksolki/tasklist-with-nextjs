import React, { useEffect, useState } from "react";
import Router from "next/router";

import { removeToken } from "../lib/token";
import { useAppAuthContext } from "../context/authContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Flex, Text, Button } from "@chakra-ui/react";
import { TASKTYPE } from "../constants/task";
import SwipeListItem from "../components/SwipeList";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { css } from "@emotion/react";

const taskStatus = [TASKTYPE.TODO, TASKTYPE.DOING, TASKTYPE.DONE];

export default function Dashboard() {
  const {
    authInfo: { isAuth, user }
  } = useAppAuthContext();
  const [taskType, setTaskType] = useState(taskStatus[0]);
  const [taskList, setTaskList] = useState([]);
  const [isMoreTaskList, setIsMoreTaskList] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) getTask();
  }, [isAuth, page]);

  useEffect(() => {
    if (isAuth) {
      getTask();
    }
  }, [taskType]);

  const redirectToLogin = () => {
    Router.push("/auth/login");
  };

  const handleLogout = (e) => {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  };

  const handleChangeTabs = (index) => {
    setTaskList([]);
    setIsMoreTaskList(false);
    setPage(0);
    setTaskType(taskStatus[index]);
  };

  const loadFunc = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setPage(page + 1);
  };

  const getTask = async () => {
    setLoading(true);
    const resp = await axios.get("/api/get-task", {
      params: {
        page,
        limit: 10,
        status: taskType
      }
    });

    console.log("resp", resp);
    // console.log("resp.data?.totalPages < page", resp.data?.totalPages, page);
    if (resp.data?.totalPages > page) {
      setIsMoreTaskList(true);
    } else {
      setIsMoreTaskList(false);
    }
    setTaskList([...taskList, ...resp.data.tasks]);
    setLoading(false);
  };

  if (!isAuth) {
    console.log("no auth returnn");
    return <></>;
  }

  // console.log("taskList", taskList);

  return (
    <Box padding="15px" height="100vh" width="100%" bg="linear-gradient(-135deg, #c850c0, #4158d0)">
      <Flex width="100%" alignItems="revert" position="relative">
        <Button
          className="btn btn-info"
          type="button"
          bg="transparent"
          padding="0 0 5px 0"
          onClick={handleLogout}
          position="absolute"
          right={0}
          top="-10px"
          fontSize="14px"
        >
          Logout
        </Button>
      </Flex>

      <Text fontSize={[25, 20, 18]}>Hi !{user?.username}</Text>
      <Text marginBottom="15px">This is task management</Text>

      <Tabs backgroundColor="#ababab" zIndex={1} onChange={handleChangeTabs}>
        <TabList>
          <Tab id={TASKTYPE.TODO} _selected={{ color: "white", bg: "blue.500" }}>
            To-do
          </Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Doing</Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Done</Tab>
        </TabList>

        <TabPanels>
          {taskStatus.map((status, index) => (
            <TabPanel key={index}>
              <Box
                id="scrollableDiv"
                className="List"
                height="100%"
                minHeight="calc(100vh - 182px)"
                maxHeight="calc(100vh - 182px)"
                overflowY="auto"
                data-id="tab "
              >
                <InfiniteScroll
                  dataLength={taskList.length}
                  next={loadFunc}
                  hasMore={isMoreTaskList}
                  scrollableTarget="scrollableDiv"
                  scrollThreshold={1}
                  loader={
                    <div className="loader" key={0}>
                      Loading ...
                    </div>
                  }
                >
                  {taskList?.map((tasks, index) => {
                    return <SwipeListItem key={index} name={tasks.title} />;
                  })}
                </InfiniteScroll>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
