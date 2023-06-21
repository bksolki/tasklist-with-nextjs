import React, { useEffect, useState } from "react";
import Router from "next/router";

import { removeToken } from "../lib/token";
import { useAppAuthContext } from "../context/authContext";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text, Box } from "@chakra-ui/react";
import { TASKTYPE } from "../constants/task";
import SwipeListItem from "../components/SwipeList";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";

export default function Dashboard() {
  const {
    authInfo: { isAuth, user },
  } = useAppAuthContext();
  const [taskType, setTaskType] = useState(TASKTYPE.TODO);
  const [taskList, setTaskList] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isAuth) getTask();
  }, [isAuth, taskType]);

  const redirectToLogin = () => {
    Router.push("/auth/login");
  };

  const handleLogout = (e) => {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  };

  const loadFunc = (data) => {
    console.log("loadmore", data);
  };

  const getTask = async () => {
    const resp = await axios.get("/api/get-task", {
      params: {
        page,
        limit: 10,
      },
    });

    console.log("resp", resp);
    setTaskList(resp.data.tasks);
  };

  if (!isAuth) {
    console.log("no auth returnn");
    return <></>;
  }

  console.log("taskList", taskList);

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
            <Box className="List">
              <InfiniteScroll
                pageStart={page}
                loadMore={loadFunc}
                hasMore={true || false}
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
