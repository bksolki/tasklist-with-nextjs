import React, { useEffect, useState } from "react";
import Router from "next/router";

import { removeToken } from "../lib/token";
import { useAppAuthContext } from "../context/authContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Flex, Text, Button } from "@chakra-ui/react";
import { TASKTYPE } from "../constants/task";
import SwipeListItem from "../components/SwipeList";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import dayjs from "dayjs";

const taskStatus = [TASKTYPE.TODO, TASKTYPE.DOING, TASKTYPE.DONE];

export default function Dashboard() {
  const {
    authInfo: { isAuth, user }
  } = useAppAuthContext();
  const [taskType, setTaskType] = useState(taskStatus[0]);
  const [taskList, setTaskList] = useState([]);
  const [taskListWithGroup, setTaskListWithGroup] = useState([]);
  const [isMoreTaskList, setIsMoreTaskList] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) getTaskData();
  }, [isAuth, page]);

  useEffect(() => {
    if (isAuth) {
      getTaskData();
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
    setTaskListWithGroup([]);
    setIsMoreTaskList(false);
    setPage(0);
    setTaskType(taskStatus[index]);
  };

  const handleDeleteTask = (date, id) => {
    let taskListGroupFilter = [...taskListWithGroup];
    let taskListFilter = [...taskList];
    const indexGroup = taskListGroupFilter.map((group) => group.date).indexOf(date);

    taskListGroupFilter[indexGroup].tasks = taskListGroupFilter[indexGroup].tasks.filter((task) => task.id !== id);
    taskListFilter = taskListFilter.filter((task) => task.id !== id);

    setTimeout(() => {
      setTaskList(taskListFilter);
      setTaskListWithGroup(taskListGroupFilter);
    }, 550);
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setPage(page + 1);
  };

  const getTaskData = async () => {
    setLoading(true);
    const resp = await axios.get("/api/get-task", {
      params: {
        page,
        limit: 10,
        status: taskType
      }
    });
    const taskListAll = [...taskList, ...resp.data.tasks];

    // console.log("resp", resp);

    if (resp.data?.totalPages > page) {
      setIsMoreTaskList(true);
    } else {
      setIsMoreTaskList(false);
    }

    const groupsByCreatedAt = taskListAll.reduce((groups, task) => {
      const date = dayjs(task.createdAt).format("YYYY-MM-DD");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
      return groups;
    }, {});

    const groupArrays = Object.keys(groupsByCreatedAt).map((date) => {
      return {
        date,
        tasks: groupsByCreatedAt[date]
      };
    });

    setTaskList(taskListAll);
    setTaskListWithGroup(groupArrays);
    setLoading(false);
  };

  if (!isAuth) {
    return <></>;
  }

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
      <Text marginBottom="15px">This is task management :D</Text>

      <Tabs backgroundColor="rgba(220,220,220,0.8)" borderRadius="6px" zIndex={1} onChange={handleChangeTabs}>
        <TabList>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>To-do</Tab>
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
                data-id={`tab ${status}`}
              >
                <InfiniteScroll
                  dataLength={taskList.length}
                  next={loadMoreData}
                  hasMore={isMoreTaskList}
                  scrollableTarget="scrollableDiv"
                  scrollThreshold={1}
                  endMessage={<Text>test</Text>}
                  loader={
                    <div className="loader" key={0}>
                      Loading ...
                    </div>
                  }
                >
                  {taskListWithGroup?.map((group, index) => {
                    return (
                      <Box key={index}>
                        {group.tasks?.length > 0 && <Text>{dayjs(group.date).format("DD MMM YY")}</Text>}
                        {group.tasks?.map((task) => {
                          return (
                            <SwipeListItem
                              key={task.id}
                              id={task.id}
                              name={task.title}
                              date={group.date}
                              description={task.description}
                              deleteItem={handleDeleteTask}
                            />
                          );
                        })}
                      </Box>
                    );
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
