import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import TodoList from "./index";
import { useAppAuthContext } from "../../context/authContext";
// import { removeToken } from "../../lib/token";
import { TASKTYPE } from "../../constants/task";

jest.mock("axios");
jest.mock("../../context/authContext", () => ({
  useAppAuthContext: jest.fn()
}));

describe("TodoList component", () => {
  let mockAuthInfo;
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn()
    }
  };

  beforeEach(() => {
    mockAuthInfo = {
      isAuth: true,
      user: {
        username: "testuser"
      }
    };
    useAppAuthContext.mockReturnValue({
      authInfo: mockAuthInfo
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders TodoList component", () => {
    render(<TodoList />);

    expect(screen.getByText("Hi !testuser")).toBeInTheDocument();
    expect(screen.getByText("This is task management :D")).toBeInTheDocument();
    expect(screen.getByTestId("tab menu")).toBeInTheDocument();
    expect(screen.getByTestId("logout")).toBeInTheDocument();
  });

  test("logs out when Logout button is clicked", async () => {
    render(<TodoList />);

    fireEvent.click(screen.getByTestId("logout"));
    expect(mockRouter.push).toHaveBeenCalledWith("/auth/login");
  });

  test("loads task data on component mount", () => {
    const getMock = jest.spyOn(axios, "get");
    render(<TodoList />);

    expect(getMock).toHaveBeenCalledWith("/api/get-task", {
      params: {
        page: 0,
        limit: 10,
        status: TASKTYPE.TODO
      }
    });
  });

  // test("test_delete_task_on_swipe", async () => {
  //   const mockGetTaskData = jest.fn();
  //   jest.mock("axios", () => ({
  //     get: (url, params) => mockGetTaskData(url, params),
  //     delete: (url) => Promise.resolve()
  //   }));
  //   mockGetTaskData.mockResolvedValue({
  //     data: { tasks: [{ id: "1", title: "task1", description: "description1", createdAt: "2022-02-01T00:00:00.000Z" }] }
  //   });
  //   render(<TodoList />);

  //   await waitFor(() => expect(screen.getByText("task1")).toBeInTheDocument());
  //   const listItem = screen.getByText("task1").closest(".ListItem");
  //   fireEvent.touchStart(listItem);
  //   fireEvent.touchEnd(listItem);
  //   await waitFor(() => expect(mockGetTaskData).toHaveBeenCalledTimes(2));
  // });
});
