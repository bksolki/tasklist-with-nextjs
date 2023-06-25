import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "./index";
import { useAppAuthContext } from "../../context/authContext";
import { removeToken } from "../../lib/token";
import axios from "axios";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock("../../context/authContext");
jest.mock("../../lib/token");
jest.mock("axios");

describe("TodoList", () => {
  beforeEach(() => {
    useAppAuthContext.mockReturnValue({
      authInfo: { isAuth: true, user: { username: "testUser" } }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders todo list component", () => {
    render(<TodoList />);
    const logoutButton = screen.getByTestId("logout");
    expect(logoutButton).toBeInTheDocument();
  });

  test("calls handleLogout when logout button is clicked", () => {
    render(<TodoList />);
    const logoutButton = screen.getByTestId("logout");
    fireEvent.click(logoutButton);
    expect(removeToken).toBeCalled();
  });

  test("loads task data on component mount", async () => {
    axios.get.mockResolvedValue({
      data: {
        tasks: [],
        totalPages: 1
      }
    });

    render(<TodoList />);
    expect(axios.get).toBeCalledWith("/api/get-task", {
      params: {
        page: 0,
        limit: 10,
        status: "TODO"
      }
    });

    await screen.findByTestId("tab TODO");
    expect(screen.queryByText("To-do")).toBeTruthy();
  });
});
