import React, { useEffect, useState } from "react";
import Router from "next/router";

import { removeToken } from "../lib/token";
import { useAppAuthContext } from "../context/authContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { TASKTYPE } from "../constants/task";
import SwipeListItem from "../components/SwipeList";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

export default function Dashboard() {
  const {
    authInfo: { isAuth, user },
  } = useAppAuthContext();
  const [taskType, setTaskType] = useState(TASKTYPE.TODO);
  const [taskList, setTaskList] = useState([]);
  const [isMoreTaskList, setIsMoreTaskList] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuth) getTask();
  }, [isAuth, taskType, page]);

  const redirectToLogin = () => {
    Router.push("/auth/login");
  };

  const handleLogout = (e) => {
    e.preventDefault();

    removeToken();
    redirectToLogin();
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
      },
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
    <>
      <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Welcome {user?.username}!
          </a>
          <button
            className="btn btn-info"
            type="button"
            style={{ color: "white", backgroundColor: "#0d6efd" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
      <h3>{user?.username}'s Profile</h3>
      <Tabs backgroundColor="#ababab" zIndex={1}>
        <TabList onChange={(index) => setTabIndex(index)}>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>To-do</Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Doing</Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Done</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box id="scrollableDiv" className="List" height="100%" maxHeight="calc(100vh - 182px)" overflowY="auto">
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
                  // return <Text key={index}>{tasks.title}</Text>;
                  return <SwipeListItem key={index} name={tasks.title} />;
                })}
              </InfiniteScroll>
            </Box>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
