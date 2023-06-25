import React, { useEffect, useState } from "react";
import Router from "next/router";

import { removeToken } from "../../lib/token";
import { useAppAuthContext } from "../../context/authContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Flex, Text, Button, Spinner } from "@chakra-ui/react";
import { TASKTYPE } from "../../constants/task";
import SwipeListItem from "../../components/SwipeList";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import dayjs from "dayjs";

const taskStatus = [TASKTYPE.TODO, TASKTYPE.DOING, TASKTYPE.DONE];

export default function TodoList() {
  const {
    authInfo: { isAuth, user }
  } = useAppAuthContext();
  const [taskType, setTaskType] = useState<string>(taskStatus[0]);
  const [taskList, setTaskList] = useState<any[]>([]);
  const [taskListWithGroup, setTaskListWithGroup] = useState<any[]>([]);
  const [isMoreTaskList, setIsMoreTaskList] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) {
      getTaskData();
    }
  }, [taskType, isAuth, page]);

  const redirectToLogin = () => {
    Router.push("/auth/login");
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  };

  const handleChangeTabs = (index: number) => {
    setTaskList([]);
    setTaskListWithGroup([]);
    setIsMoreTaskList(false);
    setPage(0);
    setTaskType(taskStatus[index]);
  };

  const handleDeleteTask = (date: string, id: string) => {
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
    const taskListAll = [...taskList, ...(resp?.data?.tasks ?? [])];

    // console.log("resp", resp);

    if (resp?.data?.totalPages > page) {
      setIsMoreTaskList(true);
    } else {
      setIsMoreTaskList(false);
    }

    const groupsByCreatedAt: { [key: string]: any[] } = taskListAll.reduce((groups, task) => {
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
          _hover={{ background: "transparent" }}
          color="#525252"
          data-testid="logout"
        >
          Logout
        </Button>
      </Flex>

      <Text fontSize={[25, 20, 18]} color="#fff">
        Hi !{user?.username}
      </Text>
      <Text marginBottom="15px" color="#fff">
        This is task management :D
      </Text>

      <Tabs
        isFitted
        variant="unstyled"
        backgroundColor="rgba(220,220,220,0.8)"
        borderRadius="6px"
        zIndex={1}
        onChange={handleChangeTabs}
      >
        <TabList data-testid="tab menu">
          <Tab
            _selected={{ color: "#1f1f1f", bg: "rgb(255,255,255,0.5)", borderTopLeftRadius: "6px" }}
            _focus={{ outline: "none" }}
          >
            To-do
          </Tab>
          <Tab _selected={{ color: "#1f1f1f", bg: "rgb(255,255,255,0.5)" }} _focus={{ outline: "none" }}>
            Doing
          </Tab>
          <Tab
            _selected={{ color: "#1f1f1f", bg: "rgb(255,255,255,0.5)", borderTopRightRadius: "6px" }}
            _focus={{ outline: "none" }}
          >
            Done
          </Tab>
        </TabList>

        <TabPanels position="relative" h="calc(100vh - 150px)" bg="rgb(255,255,255,0.3)">
          {loading && taskList.length === 0 && (
            <Box key="loading" position="relative">
              <Flex
                zIndex={5}
                position="absolute"
                height="100%"
                width="100%"
                minHeight="calc(100vh - 150px)"
                maxHeight="calc(100vh - 150px)"
                alignItems="center"
                justifyContent="center"
                bg="rgb(255,255,255,0.8)"
              >
                <Spinner marginRight="10px" marginBottom="-5px" />
                <Text as="span">Loading..</Text>
              </Flex>
            </Box>
          )}

          {taskStatus.map((status, index) => (
            <TabPanel key={index} bg="rgb(255,255,255,0.5)">
              <Box
                zIndex={1}
                id="scrollableDiv"
                className="List"
                height="100%"
                minHeight="calc(100vh - 182px)"
                maxHeight="calc(100vh - 182px)"
                overflowY="auto"
                data-testid={`tab ${status}`}
              >
                <InfiniteScroll
                  dataLength={taskList.length}
                  next={loadMoreData}
                  hasMore={isMoreTaskList}
                  scrollableTarget="scrollableDiv"
                  endMessage={
                    taskList.length > 0 && (
                      <Box width="100%" textAlign="center" padding="15px">
                        <Text as="span" color="#a5a5a5">
                          No more tasks
                        </Text>
                      </Box>
                    )
                  }
                  scrollThreshold={1}
                  loader={
                    <Box width="100%" textAlign="center" padding="30px">
                      <Spinner marginRight="15px" />
                      <Text as="span">Loading..</Text>
                    </Box>
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
